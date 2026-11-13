#!/usr/bin/env python3
"""Fetch recent video performance from YouTube, Facebook, Instagram and TikTok.

Credentials come from environment variables (never commit them):
  YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID
  META_ACCESS_TOKEN, FB_PAGE_ID, IG_USER_ID      (Facebook Page + Instagram Business)
  TIKTOK_ACCESS_TOKEN                            (TikTok Display API, scope video.list)
Platforms with missing credentials are skipped. Output: content/analytics/<date>.json
Manual CSV exports can also be dropped in content/analytics/exports/.
"""
import json, os, sys, datetime, urllib.request, urllib.parse, urllib.error

LIMIT = int(os.environ.get("VIDEO_LIMIT", "25"))
GRAPH = "https://graph.facebook.com/v21.0"


def call(url, headers=None, data=None):
    req = urllib.request.Request(url, headers=headers or {}, data=data)
    if data is not None:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"HTTP {e.code}: {e.read().decode()[:300]}")


def youtube():
    key, ch = os.environ.get("YOUTUBE_API_KEY"), os.environ.get("YOUTUBE_CHANNEL_ID")
    if not (key and ch):
        return None
    h = {"X-Goog-Api-Key": key}
    base = "https://www.googleapis.com/youtube/v3"
    chan = call(f"{base}/channels?part=statistics,contentDetails&id={ch}", h)["items"][0]
    uploads = chan["contentDetails"]["relatedPlaylists"]["uploads"]
    items = call(f"{base}/playlistItems?part=contentDetails&maxResults={min(LIMIT,50)}&playlistId={uploads}", h)["items"]
    ids = ",".join(i["contentDetails"]["videoId"] for i in items)
    vids = call(f"{base}/videos?part=snippet,statistics,contentDetails&id={ids}", h)["items"]
    return {
        "channel": chan["statistics"],
        "videos": [{
            "id": v["id"], "url": f"https://youtu.be/{v['id']}",
            "title": v["snippet"]["title"], "published": v["snippet"]["publishedAt"],
            "duration": v["contentDetails"]["duration"], "tags": v["snippet"].get("tags", []),
            "description": v["snippet"]["description"][:500], **v["statistics"],
        } for v in vids],
    }


def facebook():
    tok, page = os.environ.get("META_ACCESS_TOKEN"), os.environ.get("FB_PAGE_ID")
    if not (tok and page):
        return None
    h = {"Authorization": f"Bearer {tok}"}
    f = "id,description,title,created_time,length,permalink_url,views,likes.summary(true),comments.summary(true)"
    data = call(f"{GRAPH}/{page}/videos?fields={urllib.parse.quote(f)}&limit={LIMIT}", h).get("data", [])
    for v in data:
        try:
            ins = call(f"{GRAPH}/{v['id']}/video_insights?metric=total_video_views,total_video_avg_time_watched,total_video_complete_views", h)
            v["insights"] = {m["name"]: m["values"][0]["value"] for m in ins.get("data", [])}
        except RuntimeError as e:
            v["insights_error"] = str(e)
    return {"videos": data}


def instagram():
    tok, ig = os.environ.get("META_ACCESS_TOKEN"), os.environ.get("IG_USER_ID")
    if not (tok and ig):
        return None
    h = {"Authorization": f"Bearer {tok}"}
    f = "id,caption,media_type,media_product_type,timestamp,permalink,like_count,comments_count"
    media = call(f"{GRAPH}/{ig}/media?fields={f}&limit={LIMIT}", h).get("data", [])
    vids = [m for m in media if m.get("media_type") == "VIDEO" or m.get("media_product_type") == "REELS"]
    for m in vids:
        try:
            ins = call(f"{GRAPH}/{m['id']}/insights?metric=reach,views,saved,shares,total_interactions,ig_reels_avg_watch_time", h)
            m["insights"] = {x["name"]: x["values"][0]["value"] for x in ins.get("data", [])}
        except RuntimeError as e:
            m["insights_error"] = str(e)
    return {"videos": vids}


def tiktok():
    tok = os.environ.get("TIKTOK_ACCESS_TOKEN")
    if not tok:
        return None
    h = {"Authorization": f"Bearer {tok}"}
    f = "id,title,video_description,create_time,duration,share_url,view_count,like_count,comment_count,share_count"
    body = json.dumps({"max_count": min(LIMIT, 20)}).encode()
    res = call(f"https://open.tiktokapis.com/v2/video/list/?fields={f}", h, body)
    return {"videos": res.get("data", {}).get("videos", [])}


def main():
    out = {"fetched_at": datetime.datetime.utcnow().isoformat() + "Z"}
    for name, fn in [("youtube", youtube), ("facebook", facebook), ("instagram", instagram), ("tiktok", tiktok)]:
        try:
            r = fn()
            out[name] = r if r is not None else {"skipped": "missing credentials"}
        except Exception as e:
            out[name] = {"error": str(e)}
        print(f"{name}: {'ok' if 'videos' in out[name] else out[name]}", file=sys.stderr)
    os.makedirs("content/analytics", exist_ok=True)
    path = f"content/analytics/{datetime.date.today()}.json"
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(out, fh, ensure_ascii=False, indent=2)
    print(path)


if __name__ == "__main__":
    main()

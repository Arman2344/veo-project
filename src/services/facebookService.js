const axios = require('axios');
const fbConfig = require('../config/facebook');

const api = axios.create({
  baseURL: fbConfig.baseUrl,
  params: { access_token: fbConfig.pageAccessToken },
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const fbError = err.response?.data?.error;
    const message = fbError
      ? `Facebook API Error [${fbError.code}]: ${fbError.message}`
      : err.message;
    throw new Error(message);
  }
);

// ─── Posts ────────────────────────────────────────────────────────────────────

async function publishPost({ message, link, scheduledTime }) {
  const payload = { message };
  if (link) payload.link = link;
  if (scheduledTime) {
    payload.published = false;
    payload.scheduled_publish_time = Math.floor(
      new Date(scheduledTime).getTime() / 1000
    );
  }
  return api.post(`/${fbConfig.pageId}/feed`, payload);
}

async function getPosts(limit = 10, after = null) {
  const params = {
    fields: 'id,message,story,created_time,full_picture,permalink_url,likes.summary(true),comments.summary(true),shares',
    limit,
  };
  if (after) params.after = after;
  return api.get(`/${fbConfig.pageId}/feed`, { params });
}

async function deletePost(postId) {
  return api.delete(`/${postId}`);
}

// ─── Comments ────────────────────────────────────────────────────────────────

async function getComments(postId, limit = 25, after = null) {
  const params = {
    fields: 'id,message,from,created_time,like_count,can_reply_privately',
    limit,
  };
  if (after) params.after = after;
  return api.get(`/${postId}/comments`, { params });
}

async function replyToComment(commentId, message) {
  return api.post(`/${commentId}/comments`, { message });
}

async function deleteComment(commentId) {
  return api.delete(`/${commentId}`);
}

async function hideComment(commentId, hide = true) {
  return api.post(`/${commentId}`, { is_hidden: hide });
}

// ─── Analytics ───────────────────────────────────────────────────────────────

const INSIGHT_METRICS = [
  'page_impressions',
  'page_impressions_unique',
  'page_engaged_users',
  'page_post_engagements',
  'page_fans',
  'page_fans_adds',
  'page_fans_removes',
  'page_views_total',
  'page_actions_post_reactions_total',
].join(',');

async function getPageInsights(period = 'day', since = null, until = null) {
  const params = { metric: INSIGHT_METRICS, period };
  if (since) params.since = since;
  if (until) params.until = until;
  return api.get(`/${fbConfig.pageId}/insights`, { params });
}

async function getPostInsights(postId) {
  const metrics = [
    'post_impressions',
    'post_impressions_unique',
    'post_engaged_users',
    'post_reactions_by_type_total',
    'post_clicks',
  ].join(',');
  return api.get(`/${postId}/insights`, { params: { metric: metrics } });
}

async function getPageInfo() {
  return api.get(`/${fbConfig.pageId}`, {
    params: {
      fields: 'id,name,about,fan_count,followers_count,picture,cover,website,phone,email,rating_count,overall_star_rating',
    },
  });
}

module.exports = {
  publishPost,
  getPosts,
  deletePost,
  getComments,
  replyToComment,
  deleteComment,
  hideComment,
  getPageInsights,
  getPostInsights,
  getPageInfo,
};

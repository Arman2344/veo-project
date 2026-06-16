// PLACEHOLDER — replace these with your real profile URLs.
// These are intentionally centralized here so you only need to edit one file.
export const SOCIAL_LINKS = {
  tiktok: 'https://www.tiktok.com/@your-handle', // TODO: replace with real TikTok URL
  instagram: 'https://www.instagram.com/your-handle', // TODO: replace with real Instagram URL
  facebook: 'https://www.facebook.com/your-page', // TODO: replace with real Facebook Page URL
  youtube: 'https://www.youtube.com/@your-channel', // TODO: replace with real YouTube URL
};

export default function SocialLinks() {
  return (
    <div className="social-links">
      <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a>
      <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
      <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
      <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>
    </div>
  );
}

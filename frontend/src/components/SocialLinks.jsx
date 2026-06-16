// PLACEHOLDER — replace these with your real profile URLs.
// These are intentionally centralized here so you only need to edit one file.
export const SOCIAL_LINKS = {
  tiktok: 'https://www.tiktok.com/@froshhype',
  instagram: 'https://www.instagram.com/froshhype/',
  facebook: 'https://www.facebook.com/profile.php?id=61550913838282',
  youtube: 'https://www.youtube.com/@your-channel', // TODO: add your real YouTube channel URL here once you have one
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

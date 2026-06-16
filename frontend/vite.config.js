import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT for GitHub Pages: this must match your repository name.
  // If your repo is github.com/yourname/my-repo, set base to '/my-repo/'.
  // If you deploy to a custom domain or a user/org root page (yourname.github.io),
  // set base to '/'.
  base: '/veo-project/', // TODO: adjust to match your actual GitHub repo name
});

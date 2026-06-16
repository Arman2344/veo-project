# CreatorCraft — Digital Products & Affiliate Landing Site

A multilingual (English / Deutsch / فارسی-دری) landing site for selling digital
PDF guides/templates and promoting affiliate tools. Frontend is a static React
site deployed to GitHub Pages; backend is a set of Netlify Functions handling
payments, email, and lead capture.

## Why two separate parts (frontend vs backend)?

GitHub Pages can **only serve static files** (HTML/CSS/JS). It cannot:

- **Run server-side code.** Creating a PayPal order, or verifying a webhook
  signature, requires code that runs on a server you control.
- **Hide secrets.** Anything shipped to the browser (including a "hidden" API
  key in JavaScript) is visible to anyone who opens devtools. Payment provider
  secret keys, email API keys, etc. must live only on a server.
- **Receive webhooks.** PayPal (or any payment provider) calls your backend
  directly after a payment completes. A static site has no server endpoint to
  receive that call.

So:

- **`/frontend`** — the public-facing website (React + Vite). Pure static
  output, deployed to GitHub Pages via GitHub Actions.
- **`/backend`** — Netlify Functions (serverless). Handles checkout creation,
  webhook verification, signed downloads, email sending, lead capture, and a
  small analytics stub. Deployed independently to Netlify's free tier.

The two communicate over plain HTTP: the frontend calls the backend's function
URLs (configured via `VITE_API_BASE_URL`).

## Project structure

```
/frontend                 Vite + React app, deployed to GitHub Pages
  src/components/         Header, Footer, LanguageSwitcher, ProductCard, etc.
  src/pages/               Home, Products, ProductDetail, Affiliates, ThankYou, Admin
  src/i18n/                en.json, de.json, fa.json + I18nContext.jsx
  src/data/                products.json, affiliates.json (edit these to manage content)
  src/styles/              global.css, variables.css (small design system)
  .github/workflows/       (see top-level .github/workflows/deploy.yml)

/backend                  Netlify Functions, deployed to Netlify
  netlify/functions/       create-checkout, payment-webhook, generate-download-link,
                            send-email, subscribe-lead, fetch-og-metadata, track-event
  emails/                   HTML email templates per language
  lib/                      shared helpers (HMAC tokens, CORS, product lookup)

/.github/workflows/deploy.yml   GitHub Actions: build frontend, deploy to GitHub Pages
```

## Run the frontend locally

```bash
cd frontend
npm install
npm run dev
```

Visit the printed local URL (usually `http://localhost:5173`). Copy
`frontend/.env.example` to `frontend/.env` and adjust `VITE_API_BASE_URL` if
you're running the backend locally too (see below).

## Deploy the frontend to GitHub Pages

1. In `frontend/vite.config.js`, set `base` to match your repo name, e.g.
   `base: '/your-repo-name/'` (or `'/'` if deploying to a `username.github.io` root repo).
2. Push to `main` — the included workflow at `.github/workflows/deploy.yml`
   builds `frontend/` and publishes `frontend/dist` to GitHub Pages automatically.
3. In your repo settings, go to **Settings > Pages** and set the source to
   **GitHub Actions** (one-time setup).
4. If your backend URL differs from the default, set a repository **variable**
   named `VITE_API_BASE_URL` (Settings > Secrets and variables > Actions > Variables)
   so the build picks it up.

## Deploy the backend to Netlify (free tier)

1. Install the Netlify CLI: `npm install -g netlify-cli` (or use `npx netlify-cli`).
2. From the `backend/` folder: `netlify init` (or `netlify link` if the site
   already exists), then `netlify deploy --prod`.
3. In the Netlify dashboard for that site, go to **Site configuration >
   Environment variables** and set all the variables listed in
   `backend/.env.example` (PayPal keys, email API key, download secret, etc.).
4. Note your function base URL, typically:
   `https://your-site-name.netlify.app/.netlify/functions`
   Set this as `VITE_API_BASE_URL` for the frontend build (see above).

For local backend development: `cd backend && npx netlify dev` (reads
`backend/.env`, copy it from `backend/.env.example` first).

## How to add or edit digital products

Edit `frontend/src/data/products.json`. Each entry looks like:

```json
{
  "id": "my-new-product",
  "image": "/images/products/my-new-product.svg",
  "price": 19,
  "currency": "USD",
  "hasFreeSample": true,
  "freeSampleFile": "my-new-product-sample.pdf",
  "fullFile": "my-new-product-full.pdf",
  "title": { "en": "...", "de": "...", "fa": "..." },
  "description": { "en": "...", "de": "...", "fa": "..." },
  "benefits": { "en": ["..."], "de": ["..."], "fa": ["..."] },
  "included": { "en": ["..."], "de": ["..."], "fa": ["..."] },
  "faq": { "en": [{ "q": "...", "a": "..." }], "de": [...], "fa": [...] }
}
```

Place the free sample file in `frontend/public/samples/`. The full/paid file
should live in your real private file storage (see `backend/.env.example` ->
`PRODUCT_FILE_BASE_URL`), **not** in the public frontend folder.

**Important:** also mirror `id`, `price`, `currency`, and `fullFile` in
`backend/lib/products.js` — the backend has its own minimal copy of the
catalog so it doesn't depend on the frontend's build output.

## How to add affiliate products

Edit `frontend/src/data/affiliates.json` — add an entry with `id`, `image`,
`url` (your real affiliate link), and `name`/`description`/`benefit` per
language. Affiliate cards automatically render with
`rel="nofollow sponsored"` on their links.

## Connecting a real payment provider (PayPal walkthrough)

1. Create a PayPal Developer account at <https://developer.paypal.com> and
   create an app under **Apps & Credentials** (start in **Sandbox** mode to
   test with fake money first).
2. Copy the **Client ID** and **Secret** into `PAYPAL_CLIENT_ID` /
   `PAYPAL_CLIENT_SECRET` in your Netlify environment variables. Leave
   `PAYPAL_ENV=sandbox` until you're ready to accept real payments, then
   switch it to `live` and use your live app's credentials instead.
3. Open `backend/netlify/functions/create-checkout.js` — the TODO block shows
   the exact `fetch` calls to get an access token and create a PayPal Order
   (Orders API v2, no SDK needed). Uncomment/adapt it.
4. In the PayPal Developer Dashboard, go to your app > **Webhooks** > **Add
   Webhook**, point it at
   `https://your-backend-site.netlify.app/.netlify/functions/payment-webhook`,
   and subscribe to at least `PAYMENT.CAPTURE.COMPLETED`. Copy the generated
   **Webhook ID** into `PAYPAL_WEBHOOK_ID`.
5. `backend/netlify/functions/payment-webhook.js` already implements real
   PayPal webhook signature verification (via PayPal's "Verify Webhook
   Signature" API) and only acts on `PAYMENT.CAPTURE.COMPLETED` events — no
   further changes needed unless you rename the `custom_id` metadata fields.

## Connecting a real email provider (SendGrid walkthrough)

1. Sign up at <https://sendgrid.com> and verify a sender identity (Settings >
   Sender Authentication) — either a single sender address or a full domain.
2. Create an API key (Settings > API Keys, "Mail Send" permission), set
   `EMAIL_API_KEY` and `EMAIL_FROM` (must match your verified sender) in
   Netlify environment variables.
3. `backend/netlify/functions/send-email.js` already implements the real
   SendGrid API call — no further changes needed unless you switch providers.

## Security notes

- **Signed download links**: `backend/lib/downloadToken.js` issues HMAC-signed,
  time-limited tokens (`DOWNLOAD_LINK_SECRET`) so paid file URLs can't be
  guessed or shared indefinitely.
- **Webhook signature verification**: `payment-webhook.js` rejects any request
  that PayPal's "Verify Webhook Signature" API doesn't confirm as authentic —
  this stops attackers from faking "payment completed" events to get free downloads.
- **Never commit `.env` files.** Both `frontend/.env.example` and
  `backend/.env.example` are templates only; real `.env` files are gitignored.
- The `/admin` page is a **convenience viewer only**, not real authentication
  (see below) — don't rely on it to protect anything sensitive.

## Admin / managing content

There is no full authenticated CMS in this MVP. The real source of truth is:

- `frontend/src/data/products.json`
- `frontend/src/data/affiliates.json`

Edit these files directly (locally with your editor, or via GitHub's web
editor) and redeploy. There's also an optional `/admin` route in the frontend
that is **password-gated client-side only** — it's a convenience speed bump
(the "password" ships inside the public JS bundle and is not secure), and it's
**read-only**: it just displays the current JSON content so you can sanity check
it without digging through files. A real multi-user admin panel would need a
backend + database and is out of scope for this MVP.

## Before going live, you must:

- [ ] Replace `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` / `PAYPAL_WEBHOOK_ID`
      placeholders and uncomment the real PayPal order-creation `fetch` calls
      in `create-checkout.js` (the structure is correct; the actual API call
      is commented out as a TODO). Switch `PAYPAL_ENV` to `live` when ready.
- [ ] Replace `EMAIL_API_KEY` / `EMAIL_FROM` with your real SendGrid values
      (the SendGrid API call in `send-email.js` is already implemented).
- [ ] Generate a real `DOWNLOAD_LINK_SECRET` (e.g. `openssl rand -hex 32`).
- [ ] Set a real `PRODUCT_FILE_BASE_URL` pointing at private file storage that
      holds your actual paid product files (S3, Supabase Storage, etc.) —
      currently points at a deliberately-invalid placeholder domain.
- [ ] Replace the placeholder sample files in `frontend/public/samples/` with
      real free-sample PDFs/ZIPs.
- [ ] Replace placeholder product images in `frontend/public/images/` with
      real artwork/photos.
- [ ] Add your real YouTube channel URL in `frontend/src/components/SocialLinks.jsx`
      (TikTok / Instagram / Facebook are already set to your real profiles).
- [ ] Replace placeholder affiliate URLs in `frontend/src/data/affiliates.json`
      with your real affiliate links.
- [ ] Replace `SUPPORT_EMAIL` placeholder in `frontend/src/components/Footer.jsx`
      and `backend/.env.example` with your real support email.
- [ ] Change or remove the `/admin` page's hardcoded access code in
      `frontend/src/pages/Admin.jsx` if you keep using it.
- [ ] Wire up `subscribe-lead.js` to a real datastore (Supabase/Airtable/etc.)
      instead of just logging to console.
- [ ] Wire up `track-event.js` to a real privacy-friendly analytics provider
      (Plausible/Umami/Fathom) if you want persistent analytics dashboards.
- [ ] Adjust `base` in `frontend/vite.config.js` to match your real GitHub repo name.

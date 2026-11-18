# CryptoCharity

A static React + Vite + Tailwind CSS charitable-giving site that lets supporters donate cryptocurrency directly to families in need — deployed on GitHub Pages.

> ⚠️ **Demo disclaimer** — This repository is a demonstration project. The wallet address is a **placeholder** and must be replaced with a real, verified address before any real donations are accepted. See [Configuration](#configuration).

---

## Tech stack

| Layer | Tool |
|---|---|
| UI framework | React 18 |
| Build / SSG | Vite 7 + vite-react-ssg |
| Styling | Tailwind CSS 3 |
| Routing | React Router DOM 6 |
| Scroll animations | AOS |
| Globe | react-globe.gl (Three.js) |
| Email | EmailJS |
| QR codes | react-qr-code |
| Head management | react-helmet-async |
| Deploy | GitHub Pages (gh-pages) |

---

## Getting started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173/Charity/)
npm run dev

# Production build (SSG pre-renders all routes)
npm run build

# Preview the production build locally
npm run preview

# Lint
npm run lint

# Format with Prettier
npm run format
```

---

## Configuration

All shared values live in **[`src/config.js`](src/config.js)**. Edit this file before deploying:

```js
// src/config.js

// ⚠️ REQUIRED: replace with your real Ethereum wallet address
export const DONATION_WALLET = {
  address: '0xYOUR_REAL_WALLET_ADDRESS_HERE',
  chainId: 1, // 1 = Ethereum mainnet
};

// EmailJS — get your IDs from https://www.emailjs.com/
// Enable Allowed Origins in the EmailJS dashboard to prevent abuse.
export const EMAILJS = {
  serviceId: 'service_xxxxxxx',
  contactTemplateId: 'template_xxxxxxx',
  newsletterTemplateId: 'template_xxxxxxx',
  publicKey: 'xxxxxxxxxxxxxxxxxxxx',
};

// Social links — set to '' to hide an icon
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/yourhandle',
  ...
};
```

### Environment variables (optional)

You can alternatively expose secrets via Vite's `.env` files:

```
VITE_EMAILJS_SERVICE_ID=service_xxx
VITE_EMAILJS_PUBLIC_KEY=xxxx
VITE_DONATION_WALLET=0xYOUR_REAL_WALLET
```

Then read them in `src/config.js` with `import.meta.env.VITE_*`.

---

## Routes

| Path | Page |
|---|---|
| `/` | Home — hero, stats, how it works, globe |
| `/donate` | Donate — QR code, wallet address, sample feed |
| `/about` | About — mission, team |
| `/impact` | Impact — stories |
| `/contact` | Contact — EmailJS form |
| `/process` | How It Works — donation journey |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/dashboard` | Donor Dashboard — private contribution history and preferences |

---

## Donor dashboard setup

The donor dashboard uses Supabase email magic links, row-level security, and a server-side transaction verifier. It is intentionally unavailable until a Supabase project is configured; it does not fall back to browser-only or sample donor data.

1. Create a Supabase project and apply `supabase/migrations/202611180001_donor_dashboard.sql` in the Supabase SQL Editor (or with the Supabase CLI).
2. In Supabase Authentication, enable the Email provider, configure production SMTP, and add these allowed redirect URLs:
   - `https://kenredco.github.io/Charity/dashboard`
   - `http://localhost:5173/Charity/dashboard`
3. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the project URL and publishable/anon key. These two values are public client configuration; database row-level security protects donor records.
4. Configure the GitHub repository Actions **Variables** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` so the Pages build can connect to Supabase.
5. Before enabling verification, confirm the donation addresses in `src/config.js` are the intended mainnet recipients. Deploy `supabase/functions/verify-donation` and set its server-side secrets:

   ```sh
   supabase secrets set APP_ALLOWED_ORIGINS="https://kenredco.github.io,http://localhost:5173" \
     DONATION_ETH_ADDRESS="your-verified-ethereum-address" \
     DONATION_BTC_ADDRESS="your-verified-bitcoin-address" \
     DONATION_SOL_ADDRESS="your-verified-solana-address" \
     DONATION_TRX_ADDRESS="your-verified-tron-address" \
     DONATION_XRP_ADDRESS="your-verified-xrp-address"
   supabase functions deploy verify-donation
   ```

   The Supabase function runtime provides its URL, anon key, and service-role key. Never put the service-role key in Vite variables or browser code. Optional `ETH_RPC_URL`, `SOL_RPC_URL`, `TRON_RPC_URL`, `TRON_API_KEY`, and `XRP_RPC_URL` secrets can be used to configure production RPC providers; public defaults are rate-limited and are not an availability guarantee.

When signed in, the on-site Ethereum, Bitcoin, Solana, and TRON wallet flows submit transaction hashes for verification and private account history. Donations remain available when signed out, but are not added to an account. The server checks that each transfer paid the configured recipient and records its network data; unconfirmed transactions remain pending. This does not cryptographically prove who controls the sending wallet, and no past transactions are imported. The XRP payment URI and QR/copy-to-external-wallet flows leave this site and cannot be associated automatically. Blockchain transactions remain public regardless of the account's anonymous preference.

Donation history and preferences are protected by owner-only RLS policies; only the verification function can create or update donation records. Receipts are downloadable transaction summaries, not tax-deductibility certificates. Project cards appear only after verified donations are linked to projects in the database; no project or financial data is seeded by this repository. Email notification choices are stored privately, but actual notification delivery requires configuring a server-side email sender.

---

## Deploying to GitHub Pages

```bash
# Build + deploy (uses gh-pages)
npm run deploy
```

The `base` in `vite.config.js` and the `basename` in `src/main.jsx` are both set to `/Charity`. Update both if you rename the repository.

The `public/404.html` SPA redirect ensures deep-links (e.g. `/Charity/donate`) work after a page refresh or direct visit.

---

## SEO

- Static HTML is pre-rendered at build time for all 8 routes by `vite-react-ssg`.
- Per-page `<title>`, `<meta description>`, Open Graph, and Twitter Card tags are injected by `react-helmet-async` via `src/components/PageMeta.jsx`.
- JSON-LD `Organization` / `WebSite` schema is included on the home page.
- `public/sitemap.xml` and `public/robots.txt` are served as static files.
- Place an **`og-image.png`** (1200×630 px) in `public/` for social share previews.

---

## Image optimization (to-do before launch)

The story images in `src/assets/` are large PNGs (~2.3–2.8 MB each). Before launch:

1. Convert to WebP/AVIF (`cwebp`, Squoosh, or a Vite image plugin).
2. Resize to actual display dimensions.
3. Add responsive `srcset` attributes.
4. Replace the Unsplash hero and About team photos with self-hosted, optimized assets.

---

## License

MIT — see `LICENSE` for details.

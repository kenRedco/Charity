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

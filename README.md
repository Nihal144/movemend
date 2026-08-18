# MoveMend

Track your movement, guide your recovery.

A Next.js progressive web app — installable, and usable offline.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS v4**
- **TypeScript** + ESLint

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## PWA behaviour

The service worker is **only registered in production builds** — a caching
worker fights hot reload in `next dev`. To exercise install and offline
behaviour:

```bash
npm run build
npm start
```

| File | Role |
| --- | --- |
| `src/app/manifest.ts` | Web app manifest (`/manifest.webmanifest`) |
| `public/sw.js` | Service worker — offline-first app shell |
| `src/components/service-worker.tsx` | Registers the worker, applies updates |
| `src/components/install-prompt.tsx` | Install button (`beforeinstallprompt`) |
| `src/app/offline/page.tsx` | Offline fallback page |

### Caching strategy

- **Navigations** — network first, falling back to cache, then `/offline`.
- **`/_next/static/`** — cache first; hashed build output is immutable.
- **Everything else** — stale-while-revalidate.

Install prompts require HTTPS (localhost is exempt), so the install button
stays hidden until the browser reports the app as installable.

## Icons

Source art lives in `assets/`. The PNGs in `public/icons/` are generated from
it — to regenerate after editing the SVG:

```bash
npm install --no-save sharp
node -e "
const sharp=require('sharp'), fs=require('fs');
const std=fs.readFileSync('assets/icon.svg'), msk=fs.readFileSync('assets/icon-maskable.svg');
[[std,192,'icon-192'],[std,512,'icon-512'],[msk,192,'maskable-192'],
 [msk,512,'maskable-512'],[std,180,'apple-touch-icon'],[std,32,'favicon-32']]
  .forEach(([b,s,n])=>sharp(b).resize(s,s).png().toFile(\`public/icons/\${n}.png\`));
"
```

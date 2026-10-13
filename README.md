# Rook Notes marketing website

A static Astro + TypeScript website for `rooknotes.com`. The free product remains at `https://lite.rooknotes.com`; this site does not access or migrate its storage.

## Develop

Use Node.js 22.12+ (validated on 24.19.0) and npm. From `/workspace/rook-website`:

```sh
npm ci
npm run dev -- --port 4321
```

English is served at `/`, Turkish at `/tr/`. The existing checkout is already isolated; a Git worktree is unnecessary. No credentials, database, third-party font calls, or analytics setup are required. Astro CLI telemetry is disabled in the package scripts.

## Validate and build

```sh
npm run check
npm run build
npm run preview -- --port 4321
# In a separate shell, with the server running:
npm test
```

The browser checks require Chromium at `/usr/bin/chromium`, or set `CHROMIUM_PATH` to your installed browser. Set `SITE_URL` if your development/preview server uses another port. Tests check both languages, assets and internal destinations, tabs, keyboard FAQ controls, modal focus and Escape, mobile navigation, 390/768/1440px overflow, reduced motion, JavaScript errors, and WCAG AA via axe. Reports and rendered page screenshots are written to `.artifacts/`.

`npm run build` outputs `dist/` for any static host. The default build targets the root of `rooknotes.com`. `ASTRO_SITE` and `ASTRO_BASE` override the canonical origin and deployment path; all internal links, screenshot assets, social metadata, robots and sitemap follow them. Keep `lite.rooknotes.com` separate.

## GitHub Pages deployment

`.github/workflows/deploy-pages.yml` runs on pushes to `main`, pull requests, and manual dispatch. It installs the lockfile dependencies with Node.js 24, checks types, builds, and runs all 22 browser/accessibility checks against the production output. Pull requests validate without deploying. Successful pushes to `main` or manual runs upload `dist/` and deploy it with GitHub's official Pages actions. Only the deploy job receives `pages:write` and `id-token:write`; no custom deployment secret is needed.

In the repository's **Settings → Pages → Build and deployment**, select **GitHub Actions** as Source. If this is the first setup, enable Pages before running the workflow, then use **Actions → Deploy GitHub Pages → Run workflow** if needed. The workflow gets the site's origin and base path from GitHub Pages, so the default project URL (`https://volkanto.github.io/rook-website/`) and an already-configured custom domain both work. To publish at `rooknotes.com`, configure that custom domain and its DNS in Pages settings; this workflow does not change DNS.

Reproduce the project Pages build locally:

```sh
ASTRO_SITE=https://volkanto.github.io ASTRO_BASE=/rook-website npm run build
ASTRO_SITE=https://volkanto.github.io ASTRO_BASE=/rook-website npm run preview -- --port 4323
# In a separate shell:
SITE_URL=http://127.0.0.1:4323/rook-website SITE_CANONICAL=https://volkanto.github.io/rook-website npm test
```

For a custom domain at the root, use `ASTRO_SITE=https://rooknotes.com ASTRO_BASE=/`. Browser reports are retained as a workflow artifact even if checks fail. Deployment only runs after validation succeeds.

## Content and design

- `src/content/en.ts` and `src/content/tr.ts`: complete translated copy.
- `src/components/Site.astro`: page flow, navigation, tabs, FAQ, dialog, SEO and structured data.
- `src/components/Screenshot.astro`: dimensioned real images, lazy loading, accessible enlargement.
- `src/components/Icon.astro`: local lightweight SVG icons.
- `src/styles/global.css`: semantic brand tokens, responsive layouts and reduced motion.
- `public/images/manifest.json`: original screenshot source, commit, dimensions, and demo provenance.
- `docs/feature-verification.md`: evidence and limitations for product claims.
- `docs/validation.md`: verified results and manual review notes.
- `docs/previews/`: rendered full desktop/mobile pages in both languages; regenerate with `node scripts/render-previews.mjs` against the production preview server.

## Refresh product imagery

Committed images are ready to use. Regeneration is optional and requires a separate reference checkout of the product, an isolated browser context, and its local development server. The script imports **synthetic notes** through the real JSON v1 restore UI and generates the weekly summary using the application itself; do not point it at a profile with existing data.

```sh
# In an external reference directory (not another checkout inside this project):
git clone https://github.com/volkanto/rook-lite.git /tmp/rook-lite
cd /tmp/rook-lite
npm ci
npm run dev -- --host 127.0.0.1
# In this marketing repository:
ROOK_SOURCE_DIR=/tmp/rook-lite ROOK_CAPTURE_ORIGIN=http://127.0.0.1:5173 node scripts/capture-product.mjs
npm run social
```

Review the refreshed UI and all claims before publishing. Original retina PNGs are retained in `public/images/originals/`; the site uses compressed WebP images. `scripts/verify-product.mjs` separately checks offline writing against a local production Rook Lite server on port 5174. It operates only in a new disposable browser context.

The live Rook domains were unavailable through this cloud environment's network policy. Product validation used an unmodified local build of the recorded commit. See `THIRD_PARTY_NOTICES.md` for attribution.

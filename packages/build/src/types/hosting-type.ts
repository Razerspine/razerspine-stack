/**
 * Supported deployment hosting environments.
 *
 * - 'netlify'    → Netlify CI/CD (env: NETLIFY)
 * - 'vercel'     → Vercel (env: VERCEL) — routing config must exist in project root, not dist
 * - 'cloudflare' → Cloudflare Pages (env: CF_PAGES)
 * - 'static'     → Any static host (GitHub Pages, S3, etc.) — fallback default
 */
export type HostingType = 'netlify' | 'vercel' | 'cloudflare' | 'static';

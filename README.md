# fixmyviolation.com

Static site on Cloudflare Workers; every commit to `main` auto-deploys.

- `public/` is the website. Put the finished files here. No build step.
- `wrangler.jsonc` holds the Cloudflare settings.
- `public/index.html` and `public/404.html` are placeholders (marked `noindex`) - replace them with the real site.
- Clean URLs work: `services.html` is served at `/services`, `about/index.html` at `/about/`.

## Going live checklist

1. Upload the real site into `public/` (keep `404.html`), commit to `main`.
2. Check the deploy in Workers & Pages -> fixmyviolation.
3. Remove `noindex` from the real pages, add `sitemap.xml` and `robots.txt`.
4. Submit https://fixmyviolation.com/sitemap.xml in Google Search Console and Bing.

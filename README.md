# fixmyviolation.com

Static Tampa Bay overgrown-property cleanup website: 25 HTML pages, nine process guides, seven jurisdiction guides, 30 FAQs and a cleanup request form without file uploads.

The existing Cloudflare Workers Static Assets configuration serves `public/`. Commits to `main` auto-deploy through the repository's configured Cloudflare integration. No application build step is needed; keep `wrangler.jsonc`.

- `public/` — deployable website, sitemap, robots, llms, headers and assets.
- `public/config.js` — add the business's Web3Forms public access key to activate online submissions. Until configured, the form directs visitors to call 813-671-2757.
- `README-DEPLOY.md` — deployment/configuration instructions, analytics placeholder and launch checklist.
- `QA-REPORT.md` — checks performed and remaining browser/Lighthouse verification.
- `tools/` — optional authoring and QA scripts; not run by the host.

No photo upload or paid attachment feature is included. The unfinished parent-service attribution is omitted until the approved name is supplied.

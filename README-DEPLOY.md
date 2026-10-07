# Fix My Violation — deployment guide

25 finished static HTML pages. No framework, npm install, server functions, web fonts or build step. Upload only `public/` to your web host. Authoring and QA tools are included separately for maintenance.

## Before launch

1. **Web3Forms key:** add your public Web3Forms access key to `public/config.js`. Create/configure the receiving account privately at https://web3forms.com. Do not put a receiving email address in this repository or HTML. The key is designed for browser use; it is not an account credential. Configure domain restrictions/spam protection in the provider dashboard as appropriate.
2. **No photo upload:** the notice-attachment field has been removed at the owner’s request. No attachment subscription is needed.
3. **Brand attribution:** the supplied brand was `[Fix My Violation, a ___ service]`. No parent company was supplied. Public pages use “Fix My Violation” and do not invent the missing attribution. Insert the approved parent-service name when available, including the shared header/footer if desired.
4. Confirm your business’s handling of submitted information matches `/privacy/`. No analytics or advertising beacon is active in this release. No public email address, street address, credentials, reviews, price promises or response-time guarantees were invented.
5. Complete the launch checks below on the deployed preview. The site is being uploaded to the existing `bluemoonco/fixmyviolation` repository, whose `main` branch is configured to auto-deploy to Cloudflare Workers Static Assets. The existing `wrangler.jsonc` is preserved.

## Existing deployment: GitHub → Cloudflare Workers

This repository already uses Cloudflare Workers Static Assets with `public/` as the asset directory and `404-page` handling. Commits to `main` auto-deploy according to the existing repository setup. No hosting migration or build step is needed. Keep `wrangler.jsonc`. `_headers` applies to static asset responses on both Workers Static Assets and Pages.

## Alternative deployment: GitHub → Cloudflare Pages

1. Unzip this package. Create a GitHub repository and commit the contents of this `fixmyviolation` folder (so `public/` is at repository root).
2. In Cloudflare, go to **Workers & Pages**, create a **Pages** project and connect that GitHub repository.
3. Select your production branch (usually `main`). Framework preset: **None**. Build command: **leave blank**; if the interface requires a value, use `exit 0`. Build output directory: **public**. Root directory: repository root. No environment variables are required.
4. Deploy and inspect the provided preview hostname. `public/_headers` is consumed by Cloudflare Pages (and the existing Workers Static Assets deployment). `404.html` provides the real not-found page instead of a single-page-app catch-all.
5. Add **fixmyviolation.com** through the Pages project’s **Custom domains** workflow. Follow Cloudflare’s DNS instructions for your domain. Verify HTTPS before sending leads to it.
6. If using `www`, attach it and configure Cloudflare’s redirect from `www.fixmyviolation.com` to the apex, preserving path/query. Canonicals, sitemap and social metadata already use `https://fixmyviolation.com`.
7. Keep branch previews private or apply preview-only `X-Robots-Tag: noindex` without changing production indexing. Redirect the production `pages.dev` hostname to the custom domain using Cloudflare’s documented process if desired.
8. Submit `https://fixmyviolation.com/sitemap.xml` in the search-engine consoles you use. Structured data makes the site understandable; rankings, AI citations and rich-result eligibility are not guaranteed. Commercial FAQ markup is not a promise of a Google FAQ rich result.

Official hosting docs: https://developers.cloudflare.com/pages/configuration/build-configuration/ and https://developers.cloudflare.com/pages/configuration/custom-domains/

## Cloudflare Web Analytics placeholder

Each page includes an HTML comment marking the insertion location in `<head>`:

```html
<!-- Cloudflare Web Analytics: add the dashboard-provided beacon here after updating the privacy page. -->
```

Use Cloudflare’s dashboard-provided snippet/token; no token has been invented. If Cloudflare automatically inserts the beacon, do not also insert it manually. Update the privacy page before enabling it. The existing Content Security Policy permits the Cloudflare beacon script and collection endpoint. If you paste an inline initialization script, review the CSP and use its hash or an external same-origin file rather than weakening the policy broadly. Verify the beacon against Cloudflare’s current instructions.

## Form behavior

- No key: submission is disabled and a click-to-call message is shown. Nothing silently disappears and no success page is faked.
- Valid configured key: multipart POST directly to Web3Forms. Only an HTTP-success response with `success: true` triggers the thank-you state.
- Network/API failure: entered values remain on screen; the user is asked to call before resending to avoid an uncertain duplicate.
- Required: name, phone, property address and jurisdiction. Other fields are optional.
- Deadlines today, overdue or within seven days show a call message. Dates use America/New_York calendar days to match Tampa Bay.
- Session storage retains UTM attribution, landing page and a short-lived success marker, not entered personal information.
- Desktop CTA opens the shared form in a native dialog; mobile and no-JavaScript navigation use the dedicated route. No-JavaScript users are offered the phone channel.
- Test one actual delivery after account setup. The form has no file input or attachment handling.

## Launch checks

- Test the homepage, guide, local-code, FAQ and form pages at 320, 390, 768 and 1440 px. Check 200% zoom, keyboard navigation, dialog focus/escape, screen-reader labels and reduced motion.
- Confirm click-to-call reaches **813-671-2757**. Government contact numbers on some guides are separately identified.
- Check deadline values: yesterday, today, seven days away, eight days away and blank.
- Test required fields, provider failure, success redirect and actual inbox receipt. Check UTM values from a landing page through both modal and full-page form.
- Verify HTTPS, security headers, real 404 status, canonical URLs and social preview after DNS is active.
- Run Lighthouse mobile on the hosted homepage, a guide and the form. The implementation targets 95+ through small, dependency-free assets, but no Lighthouse score was measured in the delivery environment. See QA-REPORT.md for the checks actually run.
- Recheck the cited current ordinances before launch and whenever a guide changes. If a jurisdiction changes its code or process, update the guide’s text, citations, last-reviewed date and Article metadata together. Do not simply advance review dates without a review.

## Files and maintenance

`public/` is the deployable website. `tools/` contains optional original content sources and authoring/QA scripts. Cloudflare does not run these scripts.

The Python authoring script `tools/build_site.py` regenerates the already-delivered HTML when you choose to edit shared templates or content. It uses only Python’s standard library. `tools/check_site.py` uses lxml for structural checks; it is not a deployment dependency. `tools/make_og.py` uses Pillow to make the deterministic social card; it is not loaded on website pages.

Assets are versioned (`site.v1.css`, `site.v2.js`, `og.v1.png`) and served with one-year immutable caching. When changing them, increment their filenames and update HTML/template references. `config.js` is outside `/assets/` and uses `no-cache`, allowing the form key to be updated without an immutable cache. HTML uses Cloudflare’s normal revalidation behavior.

There are nine full process guides, seven jurisdiction guides, a local-code hub, 30-question FAQ, services, request form, thank-you, privacy, home and 404 pages. The sitemap excludes thank-you and 404. Both have `noindex,follow`. JSON-LD includes LocalBusiness without an invented address, six Services, Article on the 16 detailed guides, BreadcrumbList and visible FAQ content.

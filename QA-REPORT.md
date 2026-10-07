# Delivery validation — October 7, 2026

## Passed

- 25 generated HTML pages; every page has a unique title and meta description and exactly one H1.
- Every internal link, local asset reference and local fragment target resolves.
- All JSON-LD blocks parse; 30 FAQ answers have corresponding visible question-and-answer content.
- Visible form controls have explicit associated labels. No public email address was found. Business phone occurrences in visible HTML are click-to-call links.
- JavaScript syntax validation passed (`node --check`).
- Mock-transport form behavior passed: missing-key blocking, UTM/page source, deadline dates yesterday/today/one/seven/eight days away/blank, success-only redirect, duplicate-submit prevention, network failure, honeypot and the absence of attachment handling.
- Sample design-token contrast checks: muted text/paper 5.00:1; muted text/pale panels 4.68:1; CTA text/yellow 11.08:1; secondary hero text/green 7.72:1.
- Homepage compressed size: 6,293 bytes. Stylesheet: 5,595 bytes. JavaScript: 3,137 bytes. These are gzip calculations, not measured hosting transfer results. The social image is metadata-only and does not load as a page image.
- All 16 detailed guides include source links and review dates. Numeric values not independently verified were explicitly withheld, rather than replaced with neighboring-jurisdiction rules.

## Not claimed as verified

A browser executable was unavailable. Downloading Playwright Chromium failed because the environment returned an invalid/truncated archive. Therefore browser rendering, interactive dialog focus, real mobile layout, automated accessibility scanning and Lighthouse were not measured. The included deployment checklist covers these remaining checks. The 95+ mobile Lighthouse target is not a measured score.

No real Web3Forms submission was sent. A configured access key is needed before end-to-end delivery can be verified. No file upload is included. The delivered default offers phone contact and blocks unconfigured online submission.

The update targets the existing GitHub repository and its configured deployment. No DNS or Cloudflare account settings are changed. No assertion is made that all external sites will remain reachable; official ordinance portals can restrict automated readers. See each guide for source-specific verification limits. This content is general information, not a legal opinion or a guarantee that cleanup closes a case.

## Reproduce local checks

From this package directory:

```sh
python tools/check_site.py
node --check public/assets/site.v2.js
node tools/test_form.cjs
```

The HTML checker needs Python lxml; these are optional maintenance checks, not deployment dependencies. The form harness uses only Node built-ins and mocked DOM/transport. It does not substitute for browser testing.

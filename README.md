# tauralune.com

Static website for **Tauralune**, an MSME-registered (Udyam `UDYAM-AP-23-0106911`) sole proprietorship in Andhra Pradesh, India, that develops, publishes and supports Android apps.

Plain HTML, CSS and JavaScript. No build step, no frameworks, no third-party scripts or fonts. Works on Cloudflare Pages and GitHub Pages as-is.

## Folder structure

```
/
├── index.html      Home: overview, services, apps in development, support, official business details
├── privacy.html    Privacy Policy (also opens at /privacy)
├── terms.html      Terms of Service (also opens at /terms)
├── 404.html        "Page not found" page (both hosts use it automatically)
├── styles.css      All styles: light/dark theme, layout, mobile menu, print
├── script.js       Theme toggle, mobile menu, smooth scroll, copy email, mailto form
├── favicon.svg     Browser tab icon (modern browsers)
├── favicon.ico     Browser tab icon (older browsers, Google search results)
├── apple-touch-icon.png  180x180 home-screen icon
├── logo.png        512x512 logo (used in structured data)
├── fonts/          Self-hosted Fraunces heading font and its licence
├── og-image.png    1200x630 preview image for link sharing
├── robots.txt      Lets search engines crawl and points to the sitemap
├── sitemap.xml     List of pages for Google Search Console
├── _headers        Security headers (Cloudflare Pages only; ignored by GitHub Pages)
├── CNAME           Custom domain for GitHub Pages (harmless on Cloudflare Pages)
└── README.md       This file
```

## Business details (already filled in)

These match the Udyam certificate and the Excell Broadband invoice exactly. Keep them identical on D&B, Google Play and anywhere else.

| Item | Value |
|---|---|
| Business name | Tauralune (sole proprietorship) |
| Proprietor | Mangiri Pavan Kumar |
| Udyam | UDYAM-AP-23-0106911 (business started 11 November 2026) |
| Address | 402, Grand T Meadows Apartment, Andhra Bank Colony, Avilala, Tirupati, Andhra Pradesh 517507, India |
| Phone | +91 70325 65385 (links use `+917032565385`) |
| Email | support@tauralune.com |

## Brand

Logo: "Taurus moon" mark, navy `#131C33` and gold `#E0AE45`. Headings use Fraunces SemiBold, self-hosted in `fonts/` (SIL Open Font License, see `fonts/OFL.txt`), so the site still loads nothing from third parties.

## Preview locally

```bash
python3 -m http.server 8000
```

Open http://localhost:8000. (Opening `index.html` by double-click also works.)

## Changing an app's stage

Each app is an `<article class="app-card">` in the `#apps` section of `index.html`. Change two things:

1. The icon: `<use href="#phase-half"/>`
2. The label next to it: `<span>In development</span>`

| Stage | Icon id |
|---|---|
| Planned | `#phase-new` |
| Design | `#phase-crescent` |
| In development | `#phase-half` |
| Testing | `#phase-gibbous` |
| Live on store | `#phase-full` |

Also update `data-stage` on the article (`planned`, `design`, `development`, `testing`, `live`).

## Adding a published app

Replace a placeholder card (or add a new one) with this block. Change the name, description, package name and Galaxy Store link.

```html
<article class="app-card" data-stage="live">
  <div class="app-stage">
    <svg class="phase" aria-hidden="true" focusable="false"><use href="#phase-full"/></svg>
    <span>Live on store</span>
  </div>
  <h3>App Name</h3>
  <p>One or two sentences on what the app does for the user.</p>
  <dl class="app-meta">
    <div><dt>Platform</dt><dd>Android</dd></div>
    <div><dt>Store</dt><dd>Published</dd></div>
  </dl>
  <p class="store-links">
    <a href="https://play.google.com/store/apps/details?id=com.tauralune.appname">Get it on Google Play</a>
    <a href="https://galaxystore.samsung.com/detail/com.tauralune.appname">Get it on Galaxy Store</a>
  </p>
</article>
```

Only use the official Google Play badge image if you follow Google's badge guidelines; plain text links are always fine.

When the first app is live:

1. Change the "Pre-launch" note in the hero of `index.html`.
2. Change the intro paragraph of the `#apps` section.
3. Add a `SoftwareApplication` entry to the JSON-LD `@graph` in `<head>` of `index.html`:

```json
{
  "@type": "SoftwareApplication",
  "name": "App Name",
  "operatingSystem": "Android",
  "applicationCategory": "UtilitiesApplication",
  "url": "https://play.google.com/store/apps/details?id=com.tauralune.appname",
  "publisher": { "@id": "https://tauralune.com/#organization" },
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
}
```

Do not add ratings or download counts to the JSON-LD unless they are real and visible on the page.

4. Update the `<lastmod>` date in `sitemap.xml`.
5. Review `privacy.html` sections 5 and 6 so they match the app's Data safety form exactly.

## Ads: app-ads.txt

If an app uses AdMob or Unity Ads, add a file named `app-ads.txt` to the repo root, so it is served at `https://tauralune.com/app-ads.txt`. Paste the exact line(s) your ad network gives you, for example AdMob:

```
google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
```

Your Play Store and Galaxy Store listings must show `https://tauralune.com` as the developer website for the ad network to find this file.

## URLs to give app stores

| Field | URL |
|---|---|
| Website | https://tauralune.com |
| Privacy policy | https://tauralune.com/privacy |
| Account / data deletion | https://tauralune.com/privacy#data-deletion |
| Terms | https://tauralune.com/terms |
| Support email | support@tauralune.com |

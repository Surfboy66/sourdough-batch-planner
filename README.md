# Sourdough Batch Planner

A mobile-first, Celsius-only sourdough planner for iPhone and desktop browsers.

## Features

- Prominent strike-water temperature calculator using the desired dough temperature formula.
- Scalable Pain au Levain, Rye Formula, Sprouted Wheat Berry, and Rugbrod formulas.
- Pain au Levain defaults to the user's adjusted 370 g final dough water for two loaves; the source formula uses 400 g.
- Editable Pain au Levain water, hydration estimate, and approximate final dough weight.
- Pain au Levain classic, olive, rosemary, and roasted onion variations.
- Start-time and bake-time schedules with late-night warnings.
- Manual step-time adjustment that shifts downstream steps.
- Saved step completion and settings using browser local storage.
- Offline use after the first successful load.
- Print and copy-friendly ingredient preparation list.

Formula data is summarised from the user-provided Craftsy PDF, *Handmade Sourdough: From Starter to Baked Loaf*. This repository contains concise formula data and short procedural summaries rather than long copyrighted recipe text.

## Run locally

The app is static and has no runtime dependencies.

1. Open `index.html` directly for a quick preview, or serve the repository root with any static web server.
2. Open the local URL in a browser.
3. The service worker is available only when served over HTTP/HTTPS, not from a `file://` URL.

## Tests

Node.js 22 or newer is recommended.

```sh
npm test
```

The checks cover recipe scaling, the 370 g Pain au Levain default, dough-weight changes, strike-water calculation, static asset references, PWA metadata, and the Celsius-only requirement.

## Deploy with GitHub Pages

The included workflow deploys the repository root.

1. Push this repository to GitHub.
2. Open **Settings** in the GitHub repository.
3. Open **Pages**.
4. Under **Build and deployment**, select **GitHub Actions** as the source.
5. Open **Actions** and confirm the `Deploy GitHub Pages` workflow completes.
6. Open the Pages URL shown by the workflow.

## Deploy with Netlify

1. Sign in to Netlify and choose **Add new site from Git**.
2. Select this GitHub repository.
3. Leave the build command blank.
4. Use `.` as the publish directory.
5. Deploy the site.

The included `netlify.toml` already configures the repository root as the publish directory.

## Add to iPhone Home Screen

1. Open the published URL in Safari on the iPhone.
2. Tap the **Share** button.
3. Tap **Add to Home Screen**.
4. Confirm the name `Sourdough`.
5. Open the new Home Screen icon once while online so the offline app shell can be cached.

## Privacy and storage

Settings and completed steps are stored only in the current browser using `localStorage`. No recipe or schedule data is sent to a server by the app.

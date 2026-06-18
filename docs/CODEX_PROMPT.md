# Codex handoff prompt: Sourdough iPhone app

You are working in a GitHub-backed Codex environment. Build a new app from this chat context. This is **not** the existing health-tracking app, although this prompt may be pasted into a previous Codex chat that had built a health app. Treat this as a new, separate application and repository unless the user explicitly tells you to reuse an existing repository.

## High-level goal

Build and publish an iPhone-friendly sourdough batch planner app for personal use. The app should be a polished, mobile-first static web app that can be opened in Safari and added to the iPhone Home Screen. It must support scalable sourdough recipes, a prominent Celsius-only water temperature calculator, recipe timelines, and clear manual publishing/use instructions.

The user has already used an HTML single-file prototype. A revised prototype is attached in this handoff as `sourdough_master_improved.html`. Use it as the functional baseline, but improve, refactor, test, and automate the project as much as possible.

## User requirements from the ChatGPT conversation

1. The app is for use on an iPhone.
2. The app should be visually appealing and easier to use than the original HTML prototype.
3. The water temperature calculator must be prominent.
4. Temperatures must be Celsius only. Do not include Fahrenheit toggles or Fahrenheit-only UI.
5. Recipes must be scalable by loaf count or batch size.
6. The source recipe is a Craftsy PDF titled approximately `Handmade Sourdough: From Starter to Baked Loaf` by Richard Miscovich.
7. The Pain au Levain recipe in the source PDF uses 400 g/ml final dough water, but the user now prefers **370 g/ml** for the two-loaf base batch because 400 ml is too much. The app must default to 370 g/ml for Pain au Levain while making it clear that this is the user-adjusted value.
8. Publishing should happen through GitHub, with as much automation as possible.
9. For manual steps, provide concise, step-by-step instructions.
10. The end result must be usable on the iPhone, preferably as a Home Screen web app.

## Source recipe facts extracted from the PDF

Do not reproduce long copyrighted recipe text. Use concise formula data and short procedural summaries only.

### Pain au Levain

Source yield: two large loaves.
Desired dough temperature: 25.6°C.
Prefermented flour: 25%.

Levain:
- Water 227 g
- Liquid sourdough starter 45 g
- Bread flour 227 g
- Total 499 g

Final dough source formula:
- Water 400 g in the PDF, but use **370 g by default** in this app as the user's adjusted preference
- Bread flour 457 g
- Levain 454 g
- Whole-wheat flour 228 g
- Salt 17 g
- Approximate source total dough weight: 1556 g before the user's water reduction

Key timing summary:
- Levain ferments about 8 hours at about 23.8°C
- Autolyse 20 to 30 minutes
- Primary fermentation 2.5 hours, with two folds about every 45 minutes
- Pre-shape/rest about 20 minutes
- Final proof about 2 hours, with optional retard
- Bake at 232°C for about 40 minutes

Variations:
- Olive: substitute whole rye flour for whole wheat if desired; add 400 g olives for the two-loaf base. This may increase yield to three loaves.
- Rosemary: replace whole wheat flour with white flour and add 28 g fresh rosemary for the two-loaf base.
- Roasted onion: keep whole wheat, hold back about 28 g water, add 226 g caramelised onions from about 283 g raw onion.

### Rye Formula

Source yield: two 750 g loaves.
Desired dough temperature: 27.8°C.
Prefermented flour: 27%.

Rye sour:
- Water 182 g
- Liquid sourdough starter 14 g
- Whole rye flour 225 g
- Total 421 g

Final dough:
- Whole rye flour 340 g
- High-gluten flour 280 g
- Instant active yeast 3 g
- Salt 17 g
- Water 468 g
- Rye sour 421 g
- Approximate total 1584 g

Key timing summary:
- Rye sour ferments 12 to 15 hours
- Primary fermentation about 45 minutes, no folds
- Rest after dividing about 10 minutes
- Proof 45 to 60 minutes
- Bake at 232°C for about 45 minutes

### Sprouted Wheat Berry Sourdough

Source yield: two large loaves.
Desired dough temperature: 25.6°C.
Prefermented flour: 35%.

Levain:
- High-extraction flour 121 g
- Sprouted wheat flour 121 g
- Water 242 g
- Liquid sourdough starter 36 g
- Total 520 g

Final dough:
- Sprouted wheat flour 328 g
- High-extraction flour 121 g
- Water 340 g
- Salt 15 g
- Levain 484 g
- Sprouted soaker 173 g
- Approximate total 1461 g

Sprouted soaker:
- Sprouted grains 173 g

Key timing summary:
- Levain ferments 8 to 10 hours
- Wheat berries soak 24 to 36 hours, then sprout 12 to 36 hours
- Autolyse 20 to 30 minutes
- Primary fermentation 2.5 hours, with two folds about every 45 minutes
- Pre-shape/rest about 20 minutes
- Room-temperature proof about 1 hour, then overnight retard
- Bake at 232°C for about 40 minutes

### Rugbrød

Source yield: one 13 inch / 33 cm Pullman loaf.
Desired dough temperature: about 27°C.
Prefermented flour: 55%.

Rye sour:
- Water 245 g
- Liquid sourdough starter 55 g
- Whole rye flour 300 g
- Total 600 g

Levain:
- Water 103 g
- Liquid sourdough starter 14 g
- High-gluten flour 103 g
- Total 220 g

Soaker:
- Rye chops 75 g
- Water 150 g
- Total about 225 g

Final dough:
- High-gluten flour 130 g
- Whole rye flour 200 g
- Water 180 g
- Instant dry yeast 2.5 g
- Salt 16 g
- Soaker 225 g
- Rye sour 600 g
- Levain 220 g
- Blackstrap molasses 15 g
- Fennel seed, about 1 tbsp + 1/2 tsp
- Extra rye chops, baker's percentage 10%
- Approximate total 1588.5 g

Key timing summary:
- Rye sour ferments 12 to 15 hours
- Soaker overnight at about 25°C
- Levain ferments 8 to 10 hours, or 4 to 6 hours then refrigerated retard
- No primary fermentation and no pre-shape
- Transfer directly to Pullman pan after mixing
- Proof 45 to 60 minutes
- Bake covered 15 minutes at 260°C, then 15 minutes at 204°C, then uncovered 45 minutes at 163°C
- Cool, then rest covered 24 to 48 hours before cutting

## Technical target

Prefer a static, client-side-only app. It should require no server for normal use. The repository should be suitable for GitHub Pages and/or Netlify deployment.

Recommended implementation options, in priority order:

1. If the existing app is simple enough, keep it as vanilla HTML/CSS/JavaScript and split it into maintainable files:
   - `index.html`
   - `src/styles.css`
   - `src/app.js`
   - `src/recipes.js`
   - `manifest.webmanifest`
   - `sw.js`
2. If a framework is genuinely beneficial, use Vite with React. Do not add a heavy framework unless it improves maintainability.

## Required app features

### Core recipe functionality

- Recipe selector.
- Batch scaling by yield count.
- Ingredient table grouped by stage, e.g. levain, final dough, soaker, toppings/variation.
- Scaled gram amounts with sensible rounding.
- Clear note that Pain au Levain final water defaults to user-adjusted 370 g for two loaves, not the PDF's 400 g.
- User-editable Pain au Levain final water amount.
- Hydration estimate. Make clear if preferment/soaker water is included or excluded.
- Approximate dough weight.
- Variation support for Pain au Levain: classic, olive, rosemary, roasted onion.

### Water temperature calculator

This must be prominent near the top of the app.

Use Celsius only. Required fields:
- Target dough temperature, default from the selected recipe.
- Room temperature.
- Flour temperature.
- Preferment/levain/sour temperature, when the recipe uses preferment.
- Friction factor with options such as hand mix and machine mix, in Celsius.
- Calculated strike water temperature.

Use a standard baker's desired dough temperature formula:

For formulas with preferment:
`waterTemp = (targetDoughTemp * 4) - roomTemp - flourTemp - prefermentTemp - frictionFactor`

For formulas without preferment:
`waterTemp = (targetDoughTemp * 3) - roomTemp - flourTemp - frictionFactor`

Display the result clearly in °C. Include a short note that the actual dough temperature should be checked after mixing and adjusted next bake.

### Timeline and scheduling

- Start-time mode: user chooses start date/time, app calculates all steps.
- Bake-time mode: user chooses desired bake time, app back-calculates schedule if possible.
- Step list with date/time, duration, and short action summary.
- Checkboxes for completed steps.
- Warnings for steps scheduled late at night or overnight.
- Manual time adjustment for a step, with downstream steps shifting accordingly if feasible.
- Option to reset schedule adjustments.

### iPhone and PWA support

- Add `manifest.webmanifest`.
- Add `sw.js` for offline caching of app shell.
- Add Apple mobile web app metadata.
- Add app icons, preferably generated SVG/PNG placeholders if no custom artwork is available.
- Make tap targets large enough for iPhone use.
- Avoid hover-only UI.
- Use safe-area inset CSS for notches.
- Persist user settings in `localStorage`.
- Ensure the app works offline after first load.

### Polish and usability

- Mobile-first visual design.
- Clear hierarchy: water calculator, selected recipe summary, schedule, ingredient list.
- Avoid dense text blocks.
- Include a compact help/about section explaining the recipe source and user-adjusted water setting.
- Include print styles or an exportable prep list if easy.
- Do not use external CDN dependencies unless necessary. The app should be reliable when installed as a Home Screen app.

## GitHub and deployment automation

Automate as much as the Codex environment allows.

Tasks:

1. Create or initialise a GitHub repository for this as a new project, suggested name: `sourdough-batch-planner`.
2. Add source files.
3. Add `README.md` with:
   - What the app does.
   - How to run locally.
   - How to deploy via GitHub Pages.
   - How to deploy via Netlify.
   - How to add the app to the iPhone Home Screen.
4. Add `AGENTS.md` with maintenance instructions for future Codex sessions.
5. Add a `.gitignore` appropriate to the chosen stack.
6. Add GitHub Actions workflow for CI. For a vanilla app, lint or static validation is sufficient. For a Vite app, run install/build/test.
7. Add GitHub Pages deployment workflow if feasible.
8. Add `netlify.toml` for Netlify deployment.
9. Commit changes on a new branch, e.g. `codex/sourdough-app`.
10. Open a pull request if Codex has permission. If not, provide exact terminal or GitHub UI steps.

## Manual publishing instructions to include in README

### GitHub Pages

Provide concise steps:

1. Push the repository to GitHub.
2. Go to repository Settings.
3. Go to Pages.
4. Select GitHub Actions or deploy from the configured branch, depending on the final setup.
5. Wait for deployment to complete.
6. Open the Pages URL on iPhone Safari.
7. Tap Share.
8. Tap Add to Home Screen.
9. Confirm app name.

### Netlify

Provide concise steps:

1. Create or log into Netlify.
2. Add new site from Git.
3. Choose the GitHub repository.
4. Use the build command and publish directory specified by the project.
5. Deploy.
6. Open the Netlify URL on iPhone Safari.
7. Tap Share.
8. Tap Add to Home Screen.

## Quality checks before finishing

Run whatever checks are appropriate to the chosen stack. At minimum:

- Confirm ingredient scaling is correct for Pain au Levain at 1, 2, and 3 loaves.
- Confirm Pain au Levain final water defaults to 370 g at 2 loaves.
- Confirm changing final water changes hydration and dough weight.
- Confirm strike water temperature calculation is correct for sample inputs.
- Confirm PWA manifest and service worker are linked correctly.
- Confirm no Fahrenheit UI remains.
- Confirm app loads in a mobile viewport.
- Confirm all core functionality works without network access after first load.

## Acceptance criteria

The task is complete only when:

1. The app can be run locally.
2. The app can be deployed from GitHub with a documented workflow.
3. The README contains manual iPhone installation steps.
4. The water temperature calculator is prominent and Celsius-only.
5. Pain au Levain defaults to 370 g final dough water for two loaves.
6. Recipes are scalable and visually clear.
7. Changes are committed in GitHub or clear manual GitHub steps are provided.
8. Any limitations are stated honestly.

## Starting source

Use `sourdough_master_improved.html` as the current working prototype. The original pasted prototype is included as `original_pasted_app.html` for reference only. Prefer the improved prototype unless you find a defect.

## Deliverables

Return:

1. Summary of what was built.
2. Repository branch/PR link, if available.
3. Published app URL, if available.
4. Clear manual steps that remain for the user.
5. Test/build results.
6. Known limitations.


## If attached files are unavailable in Codex

If you cannot see `sourdough_master_improved.html`, ask the user to upload or paste it. Do not proceed by inventing the existing app code. You may still create the repository structure and recipe data from the requirements above.

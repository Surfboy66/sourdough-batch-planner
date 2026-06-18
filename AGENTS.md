# AGENTS.md

## Project context

This repository contains a static iPhone-friendly sourdough batch planner app. It is intended for personal use by the user and should remain simple, reliable, and offline-capable.

This is a standalone project. Never modify or reuse the Health Activity Hub repository when working on this app.

## User preferences

- Celsius only. Do not reintroduce Fahrenheit UI.
- Pain au Levain final dough water defaults to 370 g for a two-loaf batch.
- Preserve recipe scaling and prominent water temperature calculator.
- Prefer static client-side code unless a framework provides clear benefit.
- Keep iPhone usability central: large tap targets, readable text, safe-area handling, and Home Screen support.

## Validation checklist

Before submitting changes:

1. Confirm the app loads locally.
2. Confirm no Fahrenheit UI is visible.
3. Confirm Pain au Levain defaults to 370 g final water for two loaves.
4. Confirm scaling works for 1, 2, and 3 loaves.
5. Confirm water temperature formula is correct.
6. Confirm README iPhone installation instructions remain current.
7. Confirm PWA manifest and service worker still load.
8. Run `npm test` before committing.

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const required = [
  "index.html",
  "manifest.webmanifest",
  "sw.js",
  "assets/icon.svg",
  "src/styles.css",
  "src/recipes.js",
  "src/calculations.js",
  "src/app.js",
];

for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing required file: ${file}`);
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "src/app.js"), "utf8");
const recipes = fs.readFileSync(path.join(root, "src/recipes.js"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.webmanifest"), "utf8"));

for (const reference of ["manifest.webmanifest", "sw.js", "src/styles.css", "src/recipes.js", "src/calculations.js", "src/app.js"]) {
  if (!html.includes(reference) && !app.includes(reference)) throw new Error(`Missing app reference: ${reference}`);
}

if (/fahrenheit|\b°F\b/i.test(`${html}\n${app}\n${recipes}`)) throw new Error("Fahrenheit UI is not allowed");
if (/Celsius only|Factor 4 with preferment/i.test(`${html}\n${app}`)) throw new Error("Remove superfluous calculator copy");
if (!recipes.includes("current:370")) throw new Error("Pain au Levain must default to 370 g final water");
if (!html.includes("apple-mobile-web-app-capable")) throw new Error("Missing iPhone Home Screen metadata");
if (manifest.display !== "standalone") throw new Error("Manifest must use standalone display mode");
if (!app.includes('data-actual="start"') || !app.includes('data-actual="finish"')) throw new Error("Timeline needs manual start and finish inputs");
if (app.includes("data-adjust")) throw new Error("Rigid downstream schedule adjustment should not return");
if (html.includes("formulaSummary") || app.includes("Approx hydration") || app.includes("Approx dough")) throw new Error("Recipe totals should not be displayed");

console.log("Static validation passed");

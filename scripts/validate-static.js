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
if (!recipes.includes("current:370")) throw new Error("Pain au Levain must default to 370 g final water");
if (!html.includes("apple-mobile-web-app-capable")) throw new Error("Missing iPhone Home Screen metadata");
if (manifest.display !== "standalone") throw new Error("Manifest must use standalone display mode");

console.log("Static validation passed");

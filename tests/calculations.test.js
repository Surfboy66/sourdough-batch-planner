const test = require("node:test");
const assert = require("node:assert/strict");

global.window = global;
require("../src/recipes.js");
const calculations = require("../src/calculations.js");

const pain = global.SOURDOUGH_RECIPES.find((recipe) => recipe.id === "pain");
const classic = pain.variations.find((variation) => variation.id === "classic");

test("Pain au Levain uses the user-adjusted 370 g final water", () => {
  const finalWater = pain.stages
    .find((stage) => stage.name === "Final dough")
    .ingredients.find((ingredient) => ingredient.controlled);
  assert.equal(finalWater.amount, 370);
  assert.equal(pain.waterControl.current, 370);
});

test("Pain au Levain final water scales for one, two, and three loaves", () => {
  assert.equal(calculations.scaleAmount(370, 1, pain.baseYield), 185);
  assert.equal(calculations.scaleAmount(370, 2, pain.baseYield), 370);
  assert.equal(calculations.scaleAmount(370, 3, pain.baseYield), 555);
});

test("changing Pain au Levain water changes approximate dough weight", () => {
  const defaultWeight = calculations.finalDoughWeight(pain, 2, 370, classic);
  const lowerWaterWeight = calculations.finalDoughWeight(pain, 2, 350, classic);
  assert.equal(defaultWeight, 1526);
  assert.equal(defaultWeight - lowerWaterWeight, 20);
});

test("Celsius strike water formula uses the four-factor preferment method", () => {
  const result = calculations.strikeWaterTemp({
    target: 25.6,
    room: 21,
    flour: 21,
    preferment: 23,
    friction: 3,
    hasPreferment: true,
  });
  assert.equal(Math.round(result * 10) / 10, 34.4);
});

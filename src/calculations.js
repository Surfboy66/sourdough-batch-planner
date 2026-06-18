(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.SourdoughCalculations = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function scaleAmount(amount, yieldCount, baseYield) {
    const yieldValue = Math.max(1, Number(yieldCount) || 1);
    const baseValue = Math.max(1, Number(baseYield) || 1);
    return Number(amount) * (yieldValue / baseValue);
  }

  function strikeWaterTemp({ target, room, flour, preferment, friction, hasPreferment = true }) {
    const factor = hasPreferment ? 4 : 3;
    const prefermentValue = hasPreferment ? Number(preferment) || 0 : 0;
    return factor * Number(target) - Number(room) - Number(flour) - prefermentValue - Number(friction);
  }

  function finalDoughWeight(recipe, yieldCount, controlledWater, variation) {
    const finalStage = recipe.stages.find((stage) => stage.name === "Final dough") || recipe.stages.at(-1);
    const waterOffset = variation?.waterOffset || 0;
    const baseTotal = finalStage.ingredients.reduce((sum, ingredient) => {
      const amount = ingredient.controlled ? controlledWater + waterOffset : ingredient.amount;
      return sum + Number(amount || 0);
    }, 0);
    const addins = (variation?.addins || []).reduce(
      (sum, ingredient) => sum + (ingredient.unit === "g" ? Number(ingredient.amount || 0) : 0),
      0,
    );
    return scaleAmount(baseTotal + addins, yieldCount, recipe.baseYield);
  }

  return { scaleAmount, strikeWaterTemp, finalDoughWeight };
});

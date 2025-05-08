import { addIngredient } from "./shoppingList.js";
import { IGNORE_WORDS } from "./ignoreWords.js";
import { scrapeRecipe } from "./scraper.js";

async function fetchIngredientsAndParse(url) {
  const { ingredients } = await scrapeRecipe(url);
  console.log(ingredients);
  parseAndAddIngredients(ingredients);
  console.log("I hit this");
}

function cleanIngredientName(name) {
  return name
    .split(/\s+/)
    .filter((word) => !IGNORE_WORDS.includes(word.toLowerCase()))
    .join(" ")
    .trim();
}

function parseAndAddIngredients(ingredientsList) {
  ingredientsList.forEach((line) => {
    console.log("Parsing line:", line);

    const match = line.match(
      /^(\d+\s\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?|[¼½¾⅓⅔⅛⅜⅝⅞])?\s*(cups?|cup|tablespoons?|tbsp|teaspoons?|tsp|cloves?|pinch|dash|pounds?|lbs?|ounces?|oz|grams?|g|kilograms?|kg|liters?|l|ml)?\.?,?\s*(.+)$/i
    );

    if (match) {
      let [, amount, unit, name] = match;

      // Normalize text
      amount = amount?.trim() || "";
      unit = unit?.toLowerCase().replace(/\.$/, "").trim() || "";
      name = cleanIngredientName(name);

      addIngredient(amount, unit, name);
    } else {
      // Fallback: treat entire line as ingredient name with no amount/unit
      const nameOnly = cleanIngredientName(line);
      console.warn("No match, fallback to name-only:", nameOnly);
      addIngredient(null, null, nameOnly);
    }
  });
}

export { fetchIngredientsAndParse, parseAndAddIngredients };

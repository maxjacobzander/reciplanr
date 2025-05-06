import { JSDOM } from "jsdom";
import { addIngredient } from "./shoppingList.js";
import { IGNORE_WORDS } from "./ignoreWords.js";
import { scrapeRecipe } from "./scraper.js";

async function fetchIngredientsAndParse(url) {
  const { ingredients } = await scrapeRecipe(url);
  console.log(ingredients);
  parseAndAddIngredients(ingredients);
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
    const match = line.match(
      /^(\d+\/\d+|\d+\s\d+\/\d+|\d+|\d*\.\d+|[¼½¾⅓⅔⅛⅜⅝⅞])?\s*([a-zA-Z]+\.?)?\s*(.*)$/
    );

    if (match) {
      let [, amount, unit, name] = match;

      unit = unit?.replace(/\.$/, "");

      amount = amount?.trim() || null;
      unit = unit?.trim() || "";
      name = cleanIngredientName(name?.trim() || "");
      addIngredient(amount, unit, name);
      return;
    } else {
      // if nothing matches, fallback to the whole line as name
      addIngredient(null, null, cleanIngredientName(line));
    }
  });
}

export { fetchIngredientsAndParse, parseAndAddIngredients };

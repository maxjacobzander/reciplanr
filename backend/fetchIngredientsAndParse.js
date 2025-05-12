import { scrapeRecipe } from "./scraper.js";
import { addToList } from "./addToList.js";

async function fetchIngredientsAndParse(
  url,
  { addIngredient, addSingularIngredient }
) {
  const { ingredients } = await scrapeRecipe(url);
  console.log(ingredients);

  addToList(ingredients, { addIngredient, addSingularIngredient });
}

export { fetchIngredientsAndParse };

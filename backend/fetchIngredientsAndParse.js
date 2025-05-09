import { scrapeRecipe } from "./scraper.js";
import { addToList } from "./addToList.js";

async function fetchIngredientsAndParse(url) {
  const { ingredients } = await scrapeRecipe(url);
  console.log(ingredients);

  addToList(ingredients);
}

export { fetchIngredientsAndParse };

import pkg from "@rethora/url-recipe-scraper";
const { default: getRecipeData } = pkg;

// import pkg from "@rethora/url-recipe-scraper"; imports the module.

// const { default: getRecipeData } = pkg; extracts the default export (the getter function) and assigns it to getRecipeData.

export async function scrapeRecipe(url) {
  const recipe = await getRecipeData(url);
  console.log("in function", recipe.recipeIngredient);
  return {
    ingredients: recipe.recipeIngredient || [],
    title: recipe.name || "Untitled Recipe",
  };
}

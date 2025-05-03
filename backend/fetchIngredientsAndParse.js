import { JSDOM } from "jsdom";

export async function fetchIngredientsAndParse(standardizedUrl) {
  const response = await fetch(standardizedUrl);
  // grab the text from the page
  const html = await response.text();

  const dom = new JSDOM(html);
  const document = dom.window.document;

  // when you add cooked.wiki to the front of a link, it generates a new page, upon which there is a <div> element with a class of "shopping-list sticky" containing a list and each <li> contains an itemprop called recipeIngredient.

  const ingredients = document.querySelectorAll(
    '[itemprop="recipeIngredient"]'
  );

  // iterate through ingredients and get content

  const ingredientsList = Array.from(ingredients).map((el) =>
    // for jsdom, I needed to change innerText to textContent
    el.textContent.trim()
  );
  console.log(ingredientsList);
  return ingredientsList;
}

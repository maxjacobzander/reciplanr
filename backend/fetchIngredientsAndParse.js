import { JSDOM } from "jsdom";
import { addIngredient } from "./shoppingList";

async function fetchIngredientsAndParse(standardizedUrl) {
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
  parseAndAddIngredients(ingredientsList);
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
      unit = unit?.trim() || null;
      name = name?.trim();
      addIngredient(amount, unit, name);
      return;
    } else {
      // if nothing matches, fallback to the whole line as name
      addIngredient(null, null, line);
    }
  });
}

export { fetchIngredientsAndParse, parseIngredients };

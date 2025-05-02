export async function fetchIngredientsAndParse(standardizedUrl) {
  const response = await fetch(standardizedUrl);
  // grab the text from the page
  const html = await response.text();

  const parser = new DOMParser();
  const parsed = parser.parseFromString(html, "text/html");

  // when you add cooked.wiki to the front of a link, it generates a new page, upon which there is a <div> element with a class of "shopping-list sticky" containing a list and each <li> contains an itemprop called recipeIngredient.

  const ingredients = parsed.querySelectorAll(
    '.shopping-list.sticky li [itemprop="recipeIngredient"]'
  );

  // iterate through ingredients and get content
}

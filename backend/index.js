import express from "express";
import cors from "cors";
import { addIngredient, getShoppingListArray } from "./shoppingList.js";
import {
  fetchIngredientsAndParse,
  parseAndAddIngredients,
} from "./fetchIngredientsAndParse.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// send recipes to be handled by shoppingList.js
// link input recipes
app.post("/ingredients-from-link", async (request, response) => {
  console.log("hello", request.body);
  const url = request.body.url;
  if (!url) return response.status(400).json({ error: "No url provided" });

  const standardizedUrl = `https://cooked.wiki/${url}`;
  console.log("standardized url", standardizedUrl);
  // fetch link + parse out ingredients
  try {
    await fetchIngredientsAndParse(standardizedUrl);
    response.json({ shoppingList: getShoppingListArray() });
  } catch (error) {
    console.error("Error parsing recipe:", error);
    response.status(500).json({ error: "Failed to parse recipe" });
  }
});

// text input receipes:
app.post("/ingredients", (request, response) => {
  try {
    const text_input = request.body.text;

    const adapted = text_input.includes("\n")
      ? text_input.split("\n")
      : text_input.split(",");

    const ingredients = adapted
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    ingredients.forEach((line) => {
      const parts = line.split(/\s+/);
      if (parts.length < 2) return;

      const amount = parseFloat(parts[0]);
      if (isNaN(amount)) return;

      let unit = "";
      let name = "";

      if (parts.length === 2) {
        // "4 potatoes"
        name = parts[1];
      } else {
        // "2 cups sugar"
        unit = parts[1];
        name = parts.slice(2).join(" ");
      }

      addIngredient(amount, unit, name);
    });

    response.json({ shoppingList: getShoppingListArray() });
  } catch (error) {
    console.error("Error parsing recipe:", error);
    response.status(500).json({ error: "Failed to parse recipe" });
  }
});

// GET request (app.get) to get the shopping_list
app.get("/shoppinglist", (request, response) => {
  // log out to test
  console.log(`you've reached the shopping list!`);
  const list = getShoppingListArray();
  response.json(list);
});

app.listen(port, () => {
  console.log(`ReciPlanr backend listening at http://localhost:${port}`);
});

import express from "express";
import cors from "cors";
import {
  addIngredient,
  addSingularIngredient,
  getShoppingListArray,
} from "./shoppingList.js";
import {
  fetchIngredientsAndParse,
  parseAndAddIngredients,
} from "./fetchIngredientsAndParse.js";
import { IGNORE_WORDS } from "./ignoreWords.js";

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
  try {
    await fetchIngredientsAndParse(url);
    response.json({ shoppingList: getShoppingListArray() });
  } catch (error) {
    console.error("Error parsing recipe:", error);
    response.status(500).json({ error: "Failed to parse recipe" });
  }
});

// text input recipes:
app.post("/ingredients", (request, response) => {
  try {
    const text_input = request.body.text;

    const adapted = text_input
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    function cleanIngredientName(name) {
      const mainPart = name.split(",")[0].trim();

      return mainPart
        .split(/\s+/)
        .filter((word) => !IGNORE_WORDS.includes(word.toLowerCase()))
        .join(" ");
    }

    adapted.forEach((line) => {
      const parts = line.trim().split(/\s+/);

      // try to parse a number from the first part
      const amount = parseFloat(parts[0]);

      if (!isNaN(amount)) {
        let unit = "";
        let name = "";

        if (parts.length === 2) {
          name = parts[1];
        } else {
          unit = parts[1];
          name = cleanIngredientName(parts.slice(2).join(" "));
        }

        addIngredient(amount, unit, name);
      } else {
        // no number found —> treat the full line as ingredient name
        const name = cleanIngredientName(line);
        addSingularIngredient(name);
      }
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

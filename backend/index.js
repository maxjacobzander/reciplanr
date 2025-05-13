import express from "express";
import session from "express-session";
import cors from "cors";
import { createShoppingList } from "./shoppingList.js";
import { fetchIngredientsAndParse } from "./fetchIngredientsAndParse.js";
import { IGNORE_WORDS } from "./ignoreWords.js";
import { addToList } from "./addToList.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === "production";

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-fallback-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: isProduction },
  })
);

// send recipes to be handled by shoppingList.js
// link input recipes
app.post("/ingredients-from-link", async (request, response) => {
  console.log("hello", request.body);
  const url = request.body.url;
  if (!url) return response.status(400).json({ error: "No url provided" });

  const shoppingList = createShoppingList(request.session.shoppingList || {});
  const {
    addIngredient,
    addSingularIngredient,
    getShoppingListArray,
    rawData,
  } = shoppingList;
  try {
    await fetchIngredientsAndParse(url, {
      addIngredient,
      addSingularIngredient,
    });

    request.session.shoppingList = rawData();

    response.json({
      shoppingList: getShoppingListArray(),
    });
  } catch (error) {
    console.error("Error parsing recipe:", error);
    response.status(500).json({ error: "Failed to parse recipe" });
  }
});

// text input recipes:
app.post("/ingredients", (request, response) => {
  try {
    const text_input = request.body.text;

    console.log("text_input", text_input);

    const shoppingList = createShoppingList(request.session.shoppingList || {});
    const {
      addIngredient,
      addSingularIngredient,
      getShoppingListArray,
      rawData,
    } = shoppingList;

    const adapted = text_input
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    console.log("adapted", adapted);

    function cleanIngredientName(name) {
      const mainPart = name.split(",")[0].trim();

      return mainPart
        .split(/\s+/)
        .filter((word) => !IGNORE_WORDS.includes(word.toLowerCase()))
        .join(" ");
    }

    addToList(adapted, { addIngredient, addSingularIngredient });

    request.session.shoppingList = rawData();

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
  const shoppingList = createShoppingList(request.session.shoppingList || {});
  const { getShoppingListArray } = shoppingList;
  response.json(getShoppingListArray());
});

app.listen(port, () => {
  console.log(`ReciPlanr backend listening at http://localhost:${port}`);
});

import express from "express";
import session from "express-session";
import cors from "cors";
import { createShoppingList } from "./shoppingList.js";
import { fetchIngredientsAndParse } from "./fetchIngredientsAndParse.js";
import { IGNORE_WORDS } from "./ignoreWords.js";
import { addToList } from "./addToList.js";
import dotenv from "dotenv";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === "production";

console.log("Envs:", process.env);

console.log("Connecting to Redis at:", process.env.REDIS_URL);

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
  },
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
await redisClient.connect();

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "sess:",
});

if (isProduction) {
  app.set("trust proxy", 1);
}

const allowedOrigins = isProduction
  ? ["https://reciplanr.onrender.com"]
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET || "default-fallback-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax", // Session ID is changing in prod — this is to allow cross-origin cookies
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
// Middleware to log session ID and shopping list for debugging
app.use((req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Shopping List in session:", req.session.shoppingList);
  next();
});

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

    const result = getShoppingListArray();
    console.log("Final shopping list to return:", result);

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

    console.log("Final shopping list to return:", getShoppingListArray());

    response.json({ shoppingList: getShoppingListArray() });
  } catch (error) {
    console.error("Error parsing recipe:", error);
    response.status(500).json({ error: "Failed to parse recipe" });
  }
});

// POST request to clear the shopping list
app.post("/clear-list", (req, res) => {
  console.log("Clearing shopping list");
  req.session.shoppingList = [];
  res.json({ success: true });
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

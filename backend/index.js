import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// send recipes to be handled by shoppingList.js

// GET request (app.get) to get the shopping_list
app.get("/shoppinglist", (request, response) => {
  // log out to test
  console.log(`you've reached the shopping list!`);
});

app.listen(port, () => {
  console.log(`ReciPlanr backend listening at http://localhost:${port}`);
});

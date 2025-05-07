import { useState, useEffect } from "react";
import InputIngredients from "./Input.js";
import ShoppingList from "./ShoppingList.js";
import "./Reciplanr.css";

function App() {
  const [shoppingList, setShoppingList] = useState([]);

  // reset list when page is first loaded
  useEffect(() => {
    setShoppingList([]);
  }, []);

  console.log(shoppingList);

  return (
    <div className="App">
      <h1>ReciPlanr</h1>

      <InputIngredients
        type="link"
        label="Input Ingredients via Link"
        placeholder={
          "Enter a recipe URL here to add ingredients to your shopping list"
        }
        setShoppingList={setShoppingList}
      />

      <br />

      <InputIngredients
        type="text"
        label="Input Ingredients Manually With Each Ingredient On A New Line"
        placeholder={"Enter your ingredients here directly"}
        setShoppingList={setShoppingList}
      />

      <br />

      <ShoppingList shoppingList={shoppingList} />
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";
import InputIngredients from "./Input.js";
import ShoppingList from "./ShoppingList.js";
import "./Reciplanr.css";
import logo from "./img/logo_v1_narrow-removebg.png";

function App() {
  const [shoppingList, setShoppingList] = useState([]);

  // reset list when page is first loaded
  useEffect(() => {
    setShoppingList([]);
  }, []);

  console.log(shoppingList);

  return (
    <div className="App">
      <img src={logo} alt="ReciPlanr" />
      {/* <h1>ReciPlanr</h1> */}
      <div className="reciPlanr">
        <div className="inputs">
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
        </div>

        <br />

        {shoppingList.length > 0 ? (
          <div className="fade-in">
            <ShoppingList shoppingList={shoppingList} />
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}

export default App;

import { UNIT_CONVERSIONS } from "./unitConversions.js";

// TO DO:

// create an Object to store the shopping list --> key:value being ingredient:amount
const shoppingList = {};

// standardize ingredient name (ie egg vs eggs)
function standardizeIngredientName(name) {
  name = name.toLowerCase().trim();
  console.log("Before standardization:", name);

  if (name.endsWith("es") && name.length > 3) {
    name = name.slice(0, -2);
  } else if (name.endsWith("s") && name.length > 2) {
    name = name.slice(0, -1);
  }

  console.log("After standardization:", name);
  return name;
}

// standardize measurements for the amount

function standardizeMeasurement(amount, fromUnit) {
  const normalizedUnit = fromUnit?.toLowerCase().trim();
  console.log("Before conversion:", amount, fromUnit);

  if (UNIT_CONVERSIONS[normalizedUnit]) {
    const toUnit = Object.keys(UNIT_CONVERSIONS[normalizedUnit])[0];
    const factor = UNIT_CONVERSIONS[normalizedUnit][toUnit];
    return {
      amount: amount * factor,
      unit: toUnit,
    };
  }

  // if unit is not recognized, just return it as is
  return { amount, unit: normalizedUnit };
}

// find or create ingredient (string)
// add amount to the value in the Object

function addIngredient(amount, unit, name) {
  name = standardizeIngredientName(name);
  const { amount: convertedAmount, unit: standardUnit } =
    standardizeMeasurement(amount, unit);

  if (shoppingList[name]) {
    shoppingList[name].quantity += Number(convertedAmount);
  } else {
    shoppingList[name] = {
      name,
      quantity: Number(convertedAmount),
      unit: standardUnit,
    };
  }
}

function addSingularIngredient(name) {
  name = name.toLowerCase().trim();
  if (!shoppingList[name]) {
    console.log("Not present yet:", name);
    shoppingList[name] = {
      name,
      quantity: "",
      unit: "",
    };
  } else {
    console.log(name, "already present");
  }
}

// when done, return the shopping list Object
function getShoppingListArray() {
  return Object.values(shoppingList);
}

export { addIngredient, addSingularIngredient, getShoppingListArray };

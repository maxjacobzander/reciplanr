import { UNIT_CONVERSIONS } from "./unitConversions.js";

// TO DO:

// create an Object to store the shopping list --> key:value being ingredient:amount
const shoppingList = {};

// standardize ingredient name (ie egg vs eggs)
function standardizeIngredientName(name) {
  name = name.toLowerCase().trim();

  if (name.endsWith("es") && name.length > 3) {
    name = name.slice(0, -2);
  } else if (name.endsWith("s") && name.length > 2) {
    name = name.slice(0, -1);
  }

  return name;
}

// standardize measurements for the amount

function standardizeMeasurement(amount, fromUnit) {
  const normalizedUnit = fromUnit.toLowerCase().trim();

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

function addIngredient(name, amount, unit) {
  name = standardizeIngredientName(name);
  const { amount: convertedAmount, unit: standardUnit } =
    standardizeMeasurement(amount, unit);

  if (shoppingList[name]) {
    shoppingList[name].quantity += convertedAmount;
  } else {
    shoppingList[name] = {
      name,
      quantity: convertedAmount,
      unit: standardUnit,
    };
  }
}

// when done, return the shopping list Object
function getShoppingListArray() {
  return Object.values(shoppingList);
}

export { addIngredient, getShoppingListArray };

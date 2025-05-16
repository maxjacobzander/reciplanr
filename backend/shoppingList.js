import {
  UNIT_HIERARCHY,
  normalizeUnit,
  convertToCanonicalUnit,
} from "./unitConversions.js";
import { IGNORE_WORDS } from "./ignoreWords.js";
import { cleanIngredientName } from "./cleanIngredientName.js";

// TO DO:

// create an Object to store the shopping list --> key:value being ingredient:amount

function createShoppingList(existingList = {}) {
  const shoppingList = JSON.parse(JSON.stringify(existingList));

  // add amount to the value in the Object
  // find or create ingredient (string)

  function addIngredient(amount, unit, name) {
    if (!name) return;

    name = cleanIngredientName(name);
    const normalizedUnit = normalizeUnit(unit);
    const { amount: convertedAmount, unit: finalUnit } = convertToCanonicalUnit(
      amount,
      normalizedUnit
    );

    console.log("ADDING INGREDIENT:", { amount, unit, name });

    if (!shoppingList[name]) {
      console.log("Hits line 32 in shoppingList.js");
      shoppingList[name] = {
        name,
        quantities: [],
      };
    }

    // Check if same unit already exists for this name
    console.log("checking for existing");
    console.log(
      "Current quantities for",
      name,
      ":",
      shoppingList[name].quantities
    );
    const existing = shoppingList[name].quantities.find(
      (entry) => entry.unit === finalUnit
    );
    if (existing) {
      console.log("existing:", existing);
      existing.amount += Number(convertedAmount);
    } else {
      console.log("else line 54");
      shoppingList[name].quantities.push({
        amount: Number(convertedAmount),
        unit: finalUnit,
      });
    }

    // Sort by unit hierarchy to show larger units first
    shoppingList[name].quantities.sort((a, b) => {
      const aRank = UNIT_HIERARCHY[a.unit] || 0;
      const bRank = UNIT_HIERARCHY[b.unit] || 0;
      return bRank - aRank;
    });
  }

  function addSingularIngredient(name) {
    const standardizedName = cleanIngredientName(name);
    if (!shoppingList[standardizedName]) {
      shoppingList[standardizedName] = {
        name: standardizedName,
        quantities: [],
      };
    }
  }

  // when done, return the shopping list Object
  function getShoppingListArray() {
    return Object.values(shoppingList).map((entry) => {
      const quantitiesString = entry.quantities
        .map((q) => (q.unit ? `${q.amount} ${q.unit}` : `${q.amount}`))
        .join(" + ");

      return {
        name: entry.name,
        quantity: quantitiesString || "",
        unit: "", // moved into quantity string
      };
    });
  }

  function rawData() {
    return shoppingList;
  }

  return {
    addIngredient,
    addSingularIngredient,
    getShoppingListArray,
    rawData,
  };
}

export { createShoppingList };

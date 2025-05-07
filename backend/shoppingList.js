import {
  UNIT_HIERARCHY,
  normalizeUnit,
  convertToCanonicalUnit,
} from "./unitConversions.js";
import { IGNORE_WORDS } from "./ignoreWords.js";

// TO DO:

// create an Object to store the shopping list --> key:value being ingredient:amount

const shoppingList = {};

// standardize ingredient name / take out filler words
function standardizeIngredientName(name) {
  name = name.toLowerCase().trim();
  console.log("Before standardization:", name);

  name = name.replace(/\(.*?\)/g, "").replace(/,/g, "");

  const words = name.split(/\s+/);
  const filteredWords = words.filter(
    (word) => !IGNORE_WORDS.includes(word.toLowerCase())
  );

  const singularWords = filteredWords.map((word) => {
    if (word.endsWith("es") && word.length > 3) return word.slice(0, -2);
    if (word.endsWith("s") && word.length > 2) return word.slice(0, -1);
    return word;
  });

  return singularWords.join(" ").trim();
}

// find or create ingredient (string)
// add amount to the value in the Object

function addIngredient(amount, unit, name) {
  if (!name) return;

  name = standardizeIngredientName(name);
  const normalizedUnit = normalizeUnit(unit);
  const { amount: convertedAmount, unit: finalUnit } = convertToCanonicalUnit(
    amount,
    normalizedUnit
  );

  if (!shoppingList[name]) {
    shoppingList[name] = {
      name,
      quantities: [],
    };
  }

  // Check if same unit already exists for this name
  const existing = shoppingList[name].quantities.find(
    (entry) => entry.unit === finalUnit
  );
  if (existing) {
    existing.amount += Number(convertedAmount);
  } else {
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
  const standardizedName = standardizeIngredientName(name);
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
      .map((q) => `${q.amount} ${q.unit}`.trim())
      .join(" + ");

    return {
      name: entry.name,
      quantity: quantitiesString || "",
      unit: "", // moved into quantity string
    };
  });
}

export { addIngredient, addSingularIngredient, getShoppingListArray };

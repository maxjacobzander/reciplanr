import { addIngredient, addSingularIngredient } from "./shoppingList.js";
import { cleanIngredientName } from "./cleanIngredientName.js";

export function addToList(array) {
  array.forEach((line) => {
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
}

import { IGNORE_WORDS } from "./ignoreWords.js";

export function cleanIngredientName(name) {
  if (!name || typeof name !== "string") return "";

  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/,/g, "")
    .split(/\s+/)
    .filter((word) => !IGNORE_WORDS.includes(word))
    .join(" ")
    .trim();
}

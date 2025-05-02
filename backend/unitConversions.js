// Starting with hardcoded metric units

export const UNIT_CONVERSIONS = {
  // Volume units
  cup: { ml: 240 },
  cups: { ml: 240 },
  tbsp: { ml: 15 },
  tbsps: { ml: 15 },
  tablespoon: { ml: 15 },
  tablespoons: { ml: 15 },
  tsp: { ml: 5 },
  tsps: { ml: 5 },
  teaspoon: { ml: 5 },
  teaspoons: { ml: 5 },
  ml: { ml: 1 },
  liter: { ml: 1000 },
  liters: { ml: 1000 },
  l: { ml: 1000 },

  // Weight units
  g: { g: 1 },
  gram: { g: 1 },
  grams: { g: 1 },
  kg: { g: 1000 },
  kilogram: { g: 1000 },
  kilograms: { g: 1000 },
  oz: { g: 28.35 },
  ounce: { g: 28.35 },
  ounces: { g: 28.35 },
  lb: { g: 453.592 },
  lbs: { g: 453.592 },
  pound: { g: 453.592 },
  pounds: { g: 453.592 },

  // Common unitless quantities (fallback to 1:1)
  unit: { unit: 1 },
  units: { unit: 1 },
  piece: { unit: 1 },
  pieces: { unit: 1 },
};

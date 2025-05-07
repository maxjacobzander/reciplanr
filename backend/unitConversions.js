const UNIT_CONVERSIONS = {
  tsp: { tbsp: 1 / 3 },
  tbsp: { cup: 1 / 16 },
  cup: { pint: 1 / 2 },
  pint: { quart: 1 / 2 },
  quart: { gallon: 1 / 4 },
  ml: { l: 1 / 1000 },
  g: { kg: 1 / 1000 },
};

const VOLUME_UNITS = ["tsp", "tbsp", "cup"];
const WEIGHT_UNITS = ["g", "kg"];
const UNIT_HIERARCHY = {
  tsp: 1,
  tbsp: 2,
  cup: 3,
  g: 1,
  kg: 2,
};

function normalizeUnit(unit) {
  if (!unit) return null;

  const normalized = unit.toLowerCase().trim();

  const unitMap = {
    tsp: "tsp",
    tsps: "tsp",
    teaspoon: "tsp",
    teaspoons: "tsp",
    tbsp: "tbsp",
    tbsps: "tbsp",
    tbl: "tbsp",
    tbls: "tbsp",
    tablespoon: "tbsp",
    tablespoons: "tbsp",
    cup: "cup",
    cups: "cup",
    oz: "oz",
    ozs: "oz",
    ounce: "oz",
    ounces: "oz",
    floz: "floz",
    "fl oz": "floz",
    lb: "lb",
    lbs: "lb",
    pound: "lb",
    pounds: "lb",
    g: "g",
    gs: "g",
    gram: "g",
    grams: "g",
    kg: "kg",
    kgs: "kg",
    kilogram: "kg",
    kilograms: "kg",
    ml: "ml",
    mls: "ml",
    milliliter: "ml",
    milliliters: "ml",
    l: "l",
    ls: "l",
    liter: "l",
    liters: "l",
    pinch: "pinch",
    pinches: "pinch",
    dash: "dash",
    dashes: "dash",
  };

  return unitMap[normalized] || normalized;
}

// convert to canonical/larger unit only within a logical unit group

function convertToCanonicalUnit(amount, unit) {
  unit = normalizeUnit(unit);
  if (!unit) return { amount, unit };

  let currentUnit = unit;
  let currentAmount = amount;

  const isVolume = VOLUME_UNITS.includes(currentUnit);
  const isWeight = WEIGHT_UNITS.includes(currentUnit);
  const unitsToConsider = isVolume
    ? VOLUME_UNITS
    : isWeight
    ? WEIGHT_UNITS
    : [];

  for (
    let i = unitsToConsider.indexOf(currentUnit);
    i < unitsToConsider.length - 1;
    i++
  ) {
    const from = unitsToConsider[i];
    const to = unitsToConsider[i + 1];

    const factor = UNIT_CONVERSIONS[from]?.[to];
    if (factor && currentAmount * factor >= 1) {
      currentAmount *= factor;
      currentUnit = to;
    } else {
      break;
    }
  }

  return { amount: currentAmount, unit: currentUnit };
}

export {
  UNIT_HIERARCHY,
  UNIT_CONVERSIONS,
  normalizeUnit,
  convertToCanonicalUnit,
};

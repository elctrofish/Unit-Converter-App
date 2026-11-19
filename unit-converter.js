const unitSets = {
  length: [
    { id: "mm", label: "Millimeters (mm)", symbol: "mm", factor: 0.001 },
    { id: "cm", label: "Centimeters (cm)", symbol: "cm", factor: 0.01 },
    { id: "m", label: "Meters (m)", symbol: "m", factor: 1 },
    { id: "km", label: "Kilometers (km)", symbol: "km", factor: 1000 },
    { id: "in", label: "Inches (in)", symbol: "in", factor: 0.0254 },
    { id: "ft", label: "Feet (ft)", symbol: "ft", factor: 0.3048 },
    { id: "mi", label: "Miles (mi)", symbol: "mi", factor: 1609.344 }
  ],
  mass: [
    { id: "mg", label: "Milligrams (mg)", symbol: "mg", factor: 0.000001 },
    { id: "g", label: "Grams (g)", symbol: "g", factor: 0.001 },
    { id: "kg", label: "Kilograms (kg)", symbol: "kg", factor: 1 },
    { id: "oz", label: "Ounces (oz)", symbol: "oz", factor: 0.028349523125 },
    { id: "lb", label: "Pounds (lb)", symbol: "lb", factor: 0.45359237 }
  ],
  temperature: [
    { id: "c", label: "Celsius (°C)", symbol: "°C" },
    { id: "f", label: "Fahrenheit (°F)", symbol: "°F" },
    { id: "k", label: "Kelvin (K)", symbol: "K" }
  ],
  volume: [
    { id: "ml", label: "Milliliters (mL)", symbol: "mL", factor: 0.001 },
    { id: "l", label: "Liters (L)", symbol: "L", factor: 1 },
    { id: "tsp", label: "Teaspoons (US)", symbol: "tsp", factor: 0.00492892159375 },
    { id: "tbsp", label: "Tablespoons (US)", symbol: "tbsp", factor: 0.01478676478125 },
    { id: "cup", label: "Cups (US)", symbol: "cup", factor: 0.2365882365 },
    { id: "gal", label: "Gallons (US)", symbol: "gal", factor: 3.785411784 }
  ],
  speed: [
    { id: "ms", label: "Meters per second (m/s)", symbol: "m/s", factor: 1 },
    { id: "kmh", label: "Kilometers per hour (km/h)", symbol: "km/h", factor: 1 / 3.6 },
    { id: "mph", label: "Miles per hour (mph)", symbol: "mph", factor: 0.44704 },
    { id: "fts", label: "Feet per second (ft/s)", symbol: "ft/s", factor: 0.3048 },
    { id: "kn", label: "Knots (kn)", symbol: "kn", factor: 1852 / 3600 }
  ],
  area: [
    { id: "mm2", label: "Square millimeters (mm²)", symbol: "mm²", factor: 0.000001 },
    { id: "cm2", label: "Square centimeters (cm²)", symbol: "cm²", factor: 0.0001 },
    { id: "m2", label: "Square meters (m²)", symbol: "m²", factor: 1 },
    { id: "km2", label: "Square kilometers (km²)", symbol: "km²", factor: 1000000 },
    { id: "in2", label: "Square inches (in²)", symbol: "in²", factor: 0.00064516 },
    { id: "ft2", label: "Square feet (ft²)", symbol: "ft²", factor: 0.09290304 },
    { id: "yd2", label: "Square yards (yd²)", symbol: "yd²", factor: 0.83612736 },
    { id: "acre", label: "Acres (ac)", symbol: "ac", factor: 4046.8564224 },
    { id: "ha", label: "Hectares (ha)", symbol: "ha", factor: 10000 },
    { id: "mi2", label: "Square miles (mi²)", symbol: "mi²", factor: 2589988.110336 }
  ],
  pressure: [
    { id: "pa", label: "Pascals (Pa)", symbol: "Pa", factor: 1 },
    { id: "kpa", label: "Kilopascals (kPa)", symbol: "kPa", factor: 1000 },
    { id: "mpa", label: "Megapascals (MPa)", symbol: "MPa", factor: 1000000 },
    { id: "bar", label: "Bars (bar)", symbol: "bar", factor: 100000 },
    { id: "atm", label: "Atmospheres (atm)", symbol: "atm", factor: 101325 },
    { id: "psi", label: "Pounds per square inch (psi)", symbol: "psi", factor: 6894.757293168 },
    { id: "mmhg", label: "Millimeters of mercury (mmHg)", symbol: "mmHg", factor: 133.322387415 },
    { id: "hpa", label: "Hectopascals (hPa)", symbol: "hPa", factor: 100 }
  ]
};

const categorySelect = document.querySelector("#category");
const amountInput = document.querySelector("#amount");
const fromSelect = document.querySelector("#from-unit");
const toSelect = document.querySelector("#to-unit");
const resultOutput = document.querySelector("#result");
const swapButton = document.querySelector("#swap");

function populateUnits(category, fromUnit, toUnit) {
  const units = unitSets[category];

  for (const select of [fromSelect, toSelect]) {
    select.replaceChildren(...units.map((unit) => {
      const option = document.createElement("option");
      option.value = unit.id;
      option.textContent = unit.label;
      return option;
    }));
  }

  fromSelect.value = fromUnit;
  toSelect.value = toUnit;
}

function convertTemperature(value, from, to) {
  let celsius;
  if (from === "f") celsius = (value - 32) * 5 / 9;
  else if (from === "k") celsius = value - 273.15;
  else celsius = value;

  if (to === "f") return celsius * 9 / 5 + 32;
  if (to === "k") return celsius + 273.15;
  return celsius;
}

function formatNumber(value) {
  return new Intl.NumberFormat(undefined, {
    maximumSignificantDigits: 8
  }).format(value);
}

function updateResult() {
  const amount = Number(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (amountInput.value.trim() === "" || !Number.isFinite(amount)) {
    resultOutput.textContent = "Enter a valid amount";
    return;
  }

  const units = unitSets[categorySelect.value];
  const converted = categorySelect.value === "temperature"
    ? convertTemperature(amount, from, to)
    : amount * units.find((unit) => unit.id === from).factor
      / units.find((unit) => unit.id === to).factor;

  if (!Number.isFinite(converted)) {
    resultOutput.textContent = "This conversion is out of range";
    return;
  }

  const fromSymbol = units.find((unit) => unit.id === from).symbol;
  const toSymbol = units.find((unit) => unit.id === to).symbol;
  resultOutput.textContent = `${formatNumber(amount)} ${fromSymbol} = ${formatNumber(converted)} ${toSymbol}`;
}

categorySelect.addEventListener("change", () => {
  const defaults = {
    length: ["cm", "m"],
    mass: ["kg", "lb"],
    temperature: ["c", "f"],
    volume: ["l", "ml"],
    speed: ["kmh", "mph"],
    area: ["m2", "ft2"],
    pressure: ["bar", "psi"]
  };
  populateUnits(categorySelect.value, ...defaults[categorySelect.value]);
  updateResult();
});

for (const control of [amountInput, fromSelect, toSelect]) {
  control.addEventListener("input", updateResult);
  control.addEventListener("change", updateResult);
}

swapButton.addEventListener("click", () => {
  const previousFrom = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = previousFrom;
  updateResult();
});

populateUnits("length", "cm", "m");
updateResult();

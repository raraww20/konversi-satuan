const units = {
  panjang: {
    label: "Panjang",
    base: "meter",
    items: {
      milimeter: { name: "Milimeter (mm)", toBase: 0.001 },
      sentimeter: { name: "Sentimeter (cm)", toBase: 0.01 },
      meter: { name: "Meter (m)", toBase: 1 },
      kilometer: { name: "Kilometer (km)", toBase: 1000 },
      inci: { name: "Inci (in)", toBase: 0.0254 },
      kaki: { name: "Kaki (ft)", toBase: 0.3048 },
      mil: { name: "Mil", toBase: 1609.34 },
    },
    default: ["meter", "kilometer"]
  },
  berat: {
    label: "Berat",
    base: "kilogram",
    items: {
      miligram: { name: "Miligram (mg)", toBase: 0.000001 },
      gram: { name: "Gram (g)", toBase: 0.001 },
      kilogram: { name: "Kilogram (kg)", toBase: 1 },
      ton: { name: "Ton", toBase: 1000 },
      ons: { name: "Ons", toBase: 0.1 },
      pon: { name: "Pon (lb)", toBase: 0.453592 },
    },
    default: ["kilogram", "gram"]
  },
  suhu: {
    label: "Suhu",
    items: {
      celsius: { name: "Celsius (°C)" },
      fahrenheit: { name: "Fahrenheit (°F)" },
      kelvin: { name: "Kelvin (K)" },
    },
    default: ["celsius", "fahrenheit"]
  }
};

const tabs = document.querySelectorAll('.tab');
const fromUnitEl = document.getElementById('fromUnit');
const toUnitEl = document.getElementById('toUnit');
const inputEl = document.getElementById('inputValue');
const outputEl = document.getElementById('outputValue');
const swapBtn = document.getElementById('swapBtn');
const noteEl = document.getElementById('note');

let currentCategory = 'panjang';

function populateSelects(){
  const cat = units[currentCategory];
  const keys = Object.keys(cat.items);

  fromUnitEl.innerHTML = '';
  toUnitEl.innerHTML = '';

  keys.forEach(key => {
    const opt1 = document.createElement('option');
    opt1.value = key;
    opt1.textContent = cat.items[key].name;
    fromUnitEl.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = key;
    opt2.textContent = cat.items[key].name;
    toUnitEl.appendChild(opt2);
  });

  fromUnitEl.value = cat.default[0];
  toUnitEl.value = cat.default[1];
}

function toCelsius(value, unit){
  if(unit === 'celsius') return value;
  if(unit === 'fahrenheit') return (value - 32) * 5/9;
  if(unit === 'kelvin') return value - 273.15;
}

function fromCelsius(value, unit){
  if(unit === 'celsius') return value;
  if(unit === 'fahrenheit') return value * 9/5 + 32;
  if(unit === 'kelvin') return value + 273.15;
}

function convert(){
  const value = parseFloat(inputEl.value);
  const from = fromUnitEl.value;
  const to = toUnitEl.value;

  if(isNaN(value)){
    outputEl.textContent = '0';
    noteEl.textContent = '';
    return;
  }

  let result;

  if(currentCategory === 'suhu'){
    const celsius = toCelsius(value, from);
    result = fromCelsius(celsius, to);
  } else {
    const cat = units[currentCategory];
    const baseValue = value * cat.items[from].toBase;
    result = baseValue / cat.items[to].toBase;
  }

  const rounded = Math.round(result * 100000) / 100000;
  outputEl.textContent = rounded.toLocaleString('id-ID', { maximumFractionDigits: 5 });

  noteEl.textContent = `1 ${units[currentCategory].items[from].name} = ${
    currentCategory === 'suhu'
      ? Math.round(fromCelsius(toCelsius(1, from), to) * 1000) / 1000
      : Math.round((units[currentCategory].items[from].toBase / units[currentCategory].items[to].toBase) * 100000) / 100000
  } ${units[currentCategory].items[to].name}`;
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentCategory = tab.dataset.cat;
    populateSelects();
    convert();
  });
});

swapBtn.addEventListener('click', () => {
  const temp = fromUnitEl.value;
  fromUnitEl.value = toUnitEl.value;
  toUnitEl.value = temp;
  convert();
});

inputEl.addEventListener('input', convert);
fromUnitEl.addEventListener('change', convert);
toUnitEl.addEventListener('change', convert);

populateSelects();
convert();
const BASE_URL = "https://api.exchangerate-api.com/v4/latest/EUR";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  const fromCurrency = fromCurr.value.toUpperCase();
  const toCurrency = toCurr.value.toUpperCase();

  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();

    if (!data.rates) {
      throw new Error(`Exchange rate data not available`);
    }

    const rate = data.rates[toCurrency];

    if (!rate) {
      throw new Error(`Exchange rate not available for selected currency`);
    }

    const convertedAmount = (amtVal / data.rates[fromCurrency]) * rate;
    msg.innerText = `${amtVal} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
  } catch (error) {
    msg.innerText = `Error: ${error.message}`;
  }
};

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});

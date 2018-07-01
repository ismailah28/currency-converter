if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('../sw.js');
  });
}

//const currencyUrl = '../testdata.json'; //offline data for testing when am not connected online
const currencyUrl = `https://free.currencyconverterapi.com/api/v5/currencies`;

// get the 2 select elements
const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");

//function for fetching currencies
async function fetchCurrency() {
	try {
		const response = await fetch(currencyUrl);
		const data = await response.json();

		for (const result of Object.values(data)) {
			//console.log("data", key);
			for (const currency of Object.values(result)) {
				let option1 = document.createElement('option');
				let option2 = document.createElement('option');
				option1.text = `${currency.currencyName}(${currency.id})`;
				option1.value = currency.id;
				option2.text = `${currency.currencyName}(${currency.id})`;
				option2.value = currency.id;

				toSelect.add(option1);
				fromSelect.add(option2);
			}
		}

	} catch (error) {
		console.log("Fetching currency failed", error);
	}
}

fetchCurrency();

// function for currency conversion
async function convertCurrency(fromCurrency, toCurrency, amount = 1) {
	fromCurrency = encodeURIComponent(fromCurrency);
	toCurrency = encodeURIComponent(toCurrency);

	let query = `${fromCurrency}_${toCurrency}`;
	let url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`;
	//let url = '../resultdata.json'; //for testing when theres no internet connectivity
	try {
		const response = await fetch(url);
		const json = await response.json();
		return json;
	} catch (error) {
		console.log("fetch failed", error);
	}
}

const convert = document.getElementById('convert')
convert.addEventListener('click', event => {
	event.preventDefault();
	// Get selected value from from-currency
	const fromCurrencyDropdown = document.getElementById('fromCurrency');

	const selectedFromCurrency = fromCurrencyDropdown.options[fromCurrencyDropdown.selectedIndex];
	const key1 = selectedFromCurrency.value;
	const label1 = selectedFromCurrency.textContent;

	// Get selected value from to-field
	const toCurrencyDropdown = document.getElementById('toCurrency');
	const selectedToCurrency = toCurrencyDropdown.options[toCurrencyDropdown.selectedIndex];
	const key2 = selectedToCurrency.value;
	const label2 = selectedToCurrency.textContent;

	// Get value from amount field
	const amountField = document.getElementById('amount');
	let amount = amountField.value;

	// Set converted value
	const converted = document.querySelector('#converted');
	converted.value = 'converting...';

	convertCurrency(key1, key2, amount).then(value => {
		let total = value[`${key1}_${key2}`] * amount;
		converted.value = `${key2} ${total}`;
	})
});
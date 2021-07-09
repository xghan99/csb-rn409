import axios from "axios";

function validate(type, obj) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  var todayDate = yyyy + "-" + mm + "-" + dd;

  if (obj.date > todayDate) {
    return "Please ensure that selected date is today or earlier!";
  } else if (
    ((type === "Expense" || type === "Income") &&
      obj.amount &&
      +obj.amount <= 0) ||
    (type === "Stock" &&
      obj.units &&
      obj.costPrice &&
      (+obj.units <= 0 || +obj.costPrice <= 0))
  ) {
    return "Amount cannot be zero or negative!";
  } else if (
    (type === "Expense" || type === "Income") &&
    obj.description &&
    obj.description == +obj.description
  ) {
    return "Please ensure that Description does not purely contain numbers!";
  } else if (
    type === "Expense" &&
    obj.description &&
    obj.isNeed != null &&
    obj.amount &&
    obj.category &&
    obj.date
  ) {
    return 1;
  } else if (
    type === "Income" &&
    obj.description &&
    obj.amount &&
    obj.category &&
    obj.date
  ) {
    return 1;
  } else if (
    type === "Stock" &&
    obj.date &&
    obj.ticker &&
    obj.units &&
    obj.costPrice
  ) {
    return 1;
  } else {
    return "Please ensure all fields are filled!";
  }
}

function revchrono(expenses) {
  expenses.sort(function (a, b) {
    if (a.date > b.date) {
      return -1;
    }
    if (a.date < b.date) {
      return 1;
    }
    return 0;
  });
  var id = 0;
  expenses.map((obj) => (obj.id = id++));
}

function daystillend() {
  var newDate1 = new Date();
  var newDate2 = new Date(newDate1.getTime());

  newDate2.setMonth(newDate1.getMonth() + 1);
  newDate2.setDate(0);

  var days = newDate2.getDate() - newDate1.getDate();
  return days;
}

function fetchStockPrice(apiKey, ticker) {
  const country = "US";
  let price = null;

  var options = {
    method: "GET",
    url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes",
    params: { region: country, symbols: ticker },
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com"
    }
  };

  axios
    .request(options)
    .then((response) => response.json())
    .then(
      (data) =>
        (price = data.quoteResponse.result[0].regularMarketPreviousClose)
    )
    .catch((error) => {
      console.error(error.message);
    });

  return price;
}

export { validate, revchrono, daystillend, fetchStockPrice };

import axios from "axios";
import firebase from "../Firebase";

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
  } else if (
    type === "Other" &&
    obj.date &&
    obj.rate &&
    obj.units &&
    obj.costPrice &&
    obj.ticker
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

async function fetchStockPrice(apiKey, ticker) {
  var price;

  var options = {
    method: "GET",
    url: "https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote/" + ticker,
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "yahoo-finance15.p.rapidapi.com"
    }
  };

  await axios
    .request(options)
    .then((response) => {
      price = response.data[0].regularMarketPreviousClose;
    })
    .catch((error) => {
      console.error(error.message);
    });
  if (!price) {
    return "Invalid Stock Ticker";
  }
  return +price.toFixed(2);
}

const db = firebase.firestore();

async function updateExisting(apiKey, arr, storedPrices) {
  console.log("updateExisting called");
  const today = new Date();
  var todaySeconds = today.getTime() / 1000;

  var daySeconds = 24 * 60 * 60;
  var storedPricesCopy = { ...storedPrices };
  for (const ticker in storedPricesCopy) {
    const lastUpdate = storedPricesCopy[ticker].date.seconds;

    for (var obj of arr) {
      if (ticker === obj.ticker && +todaySeconds - +lastUpdate > daySeconds) {
        await fetchStockPrice(apiKey, ticker).then((x) => {
          storedPricesCopy = {
            ...storedPricesCopy,
            [ticker]: {
              date: new Date(),
              price: x
            }
          };
        });
      }
    }
  }

  await db
    .collection("investment")
    .doc("stockInfo")
    .update({
      storedPrices: storedPricesCopy
    })
    .catch((err) => console.log(err.message));
}

function differenceInDays(date) {
  var todayDate = new Date();
  var prevDate = new Date(
    date.slice(0, 4),
    date.slice(5, 7) - 1,
    date.slice(8)
  );
  var timeDifference = todayDate.getTime() - prevDate.getTime();

  return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
}

export {
  validate,
  revchrono,
  daystillend,
  fetchStockPrice,
  updateExisting,
  differenceInDays
};

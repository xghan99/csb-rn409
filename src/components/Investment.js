import { React, useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import firebase from "../Firebase";
import {
  revchrono,
  validate,
  fetchStockPrice,
  updateExisting
} from "./Utilities";
import TopBar from "./TopBar";
import InvestmentModal from "./InvestmentFormsAndTables/InvestmentModal";
import InvestmentForm from "./InvestmentFormsAndTables/InvestmentForm";
import InvestmentTable from "./InvestmentFormsAndTables/InvestmentTable";
import { Button } from "react-bootstrap";
import { Hints, Steps } from "intro.js-react";
import "intro.js/introjs.css";

export default function Investment() {
  const [arr, setArr] = useState([]);
  const [date, setDate] = useState("");
  const [ticker, setTicker] = useState("");
  const [units, setUnits] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const { currentUser } = useAuth();
  const [modalOpen, toggleModal] = useState(false);
  const [edit, setEdit] = useState({
    id: null,
    date: "",
    ticker: null,
    units: null,
    costPrice: null
  });
  const [apiKey, setApiKey] = useState("");
  const [storedPrices, setStoredPrices] = useState({});

  const [type, setType] = useState("");
  const [isTicker, toggleTickerOther] = useState(true);
  const [rate, setRate] = useState("");
  const [stepsEnabled, toggleStepsEnabled] = useState(false);

  const db = firebase.firestore();

  function getInvestments() {
    db.collection("investment")
      .doc(currentUser.email)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const items = doc.data().stocks;
          setArr(items);
        } else {
          db.collection("investment")
            .doc(currentUser.email)
            .set({ stocks: [] });
        }
      });
  }

  function handleAddStock(event) {
    event.preventDefault();
    if (addStock() !== false) {
      event.target.reset();
      setDate("");
      setTicker("");
      setUnits("");
      setCostPrice("");
      setType("");
      setRate("");
    }
  }

  function addStock() {
    const newArr = [
      ...arr,
      {
        id: arr.length,
        date: date,
        ticker: ticker.toUpperCase(),
        units: units,
        costPrice: costPrice,
        type: type,
        rate: ""
      }
    ];

    if (validate("Ticker", newArr[newArr.length - 1]) === 1) {
      addNewStock(ticker.toUpperCase());
      revchrono(newArr);
      updateExisting(apiKey, newArr, storedPrices);
      db.collection("investment")
        .doc(currentUser.email)
        .update({
          stocks: newArr
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert(validate("Ticker", newArr[newArr.length - 1]));
      return false;
    }
  }

  function deleteItem(index) {
    const newTasks = arr
      .slice(0, index)
      .concat(arr.slice(index + 1, arr.length));
    revchrono(newTasks);
    db.collection("investment").doc(currentUser.email).update({
      stocks: newTasks
    });
  }

  function handleEdit(type, event) {
    event.preventDefault();
    if (validate(type, edit) === 1) {
      const newTasks = [...arr];
      newTasks[edit.id] = edit;
      if (!(edit.ticker in storedPrices) && edit.type === "Ticker") {
        addNewStock(edit.ticker);
      }
      updateExisting(apiKey, newTasks, storedPrices);
      revchrono(newTasks);
      db.collection("investment").doc(currentUser.email).update({
        stocks: newTasks
      });
      document.getElementById("form1").reset();
    } else {
      alert(validate(type, edit));
      toggleModal(true);
    }
  }

  function editItem(index) {
    setEdit(arr[index]);
    toggleModal(true);
  }

  function getApiKey() {
    db.collection("keys")
      .doc("apiKey")
      .onSnapshot((doc) => {
        setApiKey(doc.data().apiKey);
      });
  }

  // adds new UNPRECEDENTED ticker to firebase
  async function addNewStock(ticker) {
    var newStoredPrices;

    if (!(ticker in storedPrices)) {
      var fetchedPrice = fetchStockPrice(apiKey, ticker);
      await fetchedPrice.then((x) => {
        newStoredPrices = {
          ...storedPrices,
          [ticker]: {
            date: new Date(),
            price: x
          }
        };
      });
      db.collection("investment")
        .doc("stockInfo")
        .update({
          storedPrices: newStoredPrices
        })
        .catch((err) => console.log(err));
    }
  }
  function handleAddOther(event) {
    event.preventDefault();
    if (AddOther() !== false) {
      event.target.reset();
      setDate("");
      setUnits("");
      setCostPrice("");
      setRate("");
      setType("");
      setTicker("");
    }
  }

  function AddOther() {
    const newArr = [
      ...arr,
      {
        id: arr.length,
        date: date,
        units: units,
        costPrice: costPrice,
        rate: rate,
        type: type,
        ticker: ticker
      }
    ];
    console.log(units);

    if (validate("Other", newArr[newArr.length - 1]) === 1) {
      revchrono(newArr);

      db.collection("investment")
        .doc(currentUser.email)
        .update({
          stocks: newArr
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert(validate("Other", newArr[newArr.length - 1]));
      return false;
    }
  }
  //start of useEffect

  useEffect(() => {
    getInvestments();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    document.body.style.backgroundImage = "url(resources/soft_wallpaper.png)";
  }, []);

  //first setStoredPrices that is called after render
  useEffect(() => {
    getApiKey();
    db.collection("investment")
      .doc("stockInfo")
      .onSnapshot((doc) => {
        var newStoredPrices = doc.data().storedPrices;
        setStoredPrices(newStoredPrices);
      });
  }, []);

  //second updateExising() is called everytime storedPrices is updated and not on initial state
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    updateExisting(apiKey, arr, storedPrices);
  }, [storedPrices]);

  //end of useEffect
  const steps = [
    {
      element: ".info",
      intro:
        "Choose between adding a ticker or an alternative form of investment."
    },
    {
      element: ".step1",
      intro: "Fill in the investment date."
    },
    {
      element: ".step2",
      intro:
        "Fill in the ticker symbol or the description of the investment(if Other is selected)"
    },
    {
      element: ".step3",
      intro: "Fill in the number of units bought."
    },
    {
      element: ".step4",
      intro:
        "Fill in the cost price per unit (i.e. How much you bought the investment for?)."
    },
    {
      element: ".step5",
      intro:
        "Click to add it into the table. If 'Other' is selected, fill in the expected annual rate of return (usually found in factsheets)."
    },
    {
      element: ".step6",
      intro:
        "You can view your entries in the table below (sorted in reverse chronological order). You also have the option of deleting and editing your entries."
    }
  ];

  const initialStep = 0;

  return (
    <div>
      <Steps
        enabled={stepsEnabled}
        steps={steps}
        initialStep={initialStep}
        onExit={() => toggleStepsEnabled(false)}
      />
      <TopBar />
      <br />
      <Button onClick={() => toggleStepsEnabled(true)}>
        Need a walkthrough?
      </Button>
      <h1 className="add"> Add a Stock </h1>
      <InvestmentModal
        modalOpen={modalOpen}
        toggleModal={toggleModal}
        handleEdit={handleEdit}
        edit={edit}
        setEdit={setEdit}
      />
      <div>
        <InvestmentForm
          handleAddStock={handleAddStock}
          setDate={setDate}
          date={date}
          setTicker={setTicker}
          ticker={ticker}
          setUnits={setUnits}
          units={units}
          setCostPrice={setCostPrice}
          costPrice={costPrice}
          setType={setType}
          isTicker={isTicker}
          toggleTickerOther={toggleTickerOther}
          setRate={setRate}
          rate={rate}
          handleAddOther={handleAddOther}
        />
      </div>
      <h1 className="expenseHeadings"> My Stocks </h1>
      <div className="step6">
        <InvestmentTable
          arr={arr}
          storedPrices={storedPrices}
          deleteItem={deleteItem}
          editItem={editItem}
        />
      </div>
    </div>
  );
}

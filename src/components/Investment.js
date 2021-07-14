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

export default function Investment() {
  const [arr, setArr] = useState([]);
  const [date, setDate] = useState("");
  const [ticker, setTicker] = useState("");
  const [units, setUnits] = useState(0);
  const [costPrice, setCostPrice] = useState(0.0);
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

  const db = firebase.firestore();

  function getInvestments() {
    console.log("getInvestmentCalled");
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
    console.log("handleAddStockCalled");
    event.preventDefault();
    if (addStock() !== false) {
      event.target.reset();
      setDate("");
      setTicker("");
      setUnits();
      setCostPrice(0.0);
    }
  }

  function addStock() {
    console.log("AddStockCalled");
    addNewStock(ticker.toUpperCase());
    const newArr = [
      ...arr,
      {
        id: arr.length,
        date: date,
        ticker: ticker.toUpperCase(),
        units: units,
        costPrice: costPrice
      }
    ];
    console.log(newArr);

    if (validate("Stock", newArr[newArr.length - 1]) === 1) {
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
      alert(validate("Stock", newArr[newArr.length - 1]));
      return false;
    }
  }

  function deleteItem(index) {
    console.log("deleteitemCalled");
    const newTasks = arr
      .slice(0, index)
      .concat(arr.slice(index + 1, arr.length));
    revchrono(newTasks);
    db.collection("investment").doc(currentUser.email).update({
      stocks: newTasks
    });
  }

  function handleEdit(type, event) {
    console.log("handleeditCalled");
    event.preventDefault();
    if (validate(type, edit) === 1) {
      const newTasks = [...arr];
      newTasks[edit.id] = edit;
      if (!(edit.ticker in storedPrices)) {
        addNewStock(edit.ticker);
      }
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
    console.log("edititemCalled");
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
    console.log("call");
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
  function handleRefresh() {
    console.log("handleRefreshcalled");
    updateExisting(apiKey, arr, storedPrices);
  }
  return (
    <div>
      <TopBar />
      <br />
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
          setTicker={setTicker}
          setUnits={setUnits}
          setCostPrice={setCostPrice}
        />
      </div>
      <h1 className="expenseHeadings"> My Stocks </h1>
      <div>
        <InvestmentTable
          arr={arr}
          storedPrices={storedPrices}
          deleteItem={deleteItem}
          editItem={editItem}
          handleRefresh={handleRefresh}
        />
      </div>
    </div>
  );
}

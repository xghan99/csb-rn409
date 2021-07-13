import { React, useState, useEffect, useRef } from "react";
import { Form, Col, Button, Table, Modal } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import firebase from "../Firebase";
import {
  revchrono,
  validate,
  fetchStockPrice,
  updateExisting
} from "./Utilities";
import TopBar from "./TopBar";

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
    //console.log("getInvestmentCalled")
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

  useEffect(() => {
    getInvestments();
    // eslint-disable-next-line
  }, []);

  function handleAddStock(event) {
    //console.log("handleAddStockCalled")
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
    //console.log("AddStockCalled")
    addNewStock(ticker);
    const newArr = [
      ...arr,
      {
        id: arr.length,
        date: date,
        ticker: ticker,
        units: units,
        costPrice: costPrice
      }
    ];
    console.log(newArr);

    if (validate("Stock", newArr[newArr.length - 1]) === 1) {
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
      alert(validate("Stock", newArr[newArr.length - 1]));
      return false;
    }
  }

  function deleteItem(index) {
    //console.log("deleteitemCalled")
    const newTasks = arr
      .slice(0, index)
      .concat(arr.slice(index + 1, arr.length));
    revchrono(newTasks);
    db.collection("investment").doc(currentUser.email).update({
      stocks: newTasks
    });
  }

  function handleEdit(type, event) {
    //console.log("handleeditCalled")
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
    //console.log("edititemCalled")
    setEdit(arr[index]);
    toggleModal(true);
  }

  useEffect(() => {
    document.body.style.backgroundImage = "url(resources/soft_wallpaper.png)";
  }, []);

  function getApiKey() {
    //console.log("getAPIkeyCalled")
    db.collection("keys")
      .doc("apiKey")
      .onSnapshot((doc) => {
        setApiKey(doc.data().apiKey);
      });
  }
  //update existing stocks in the database before stock info

  /*
  async function updateExisting(apiKey, arr, storedPrices) {
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
  */

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

      //console.log(newStoredPrices);
    }
  }

  function investmentTable() {
    //console.log(storedPrices);
    return (
      <>
        <Table
          responsive
          style={{ margin: "0 auto", width: "100%" }}
          className="addMarg"
        >
          <thead>
            <tr>
              <th className="tableHeadings">Date</th>
              <th className="tableHeadings">Ticker</th>
              <th className="tableHeadings">Units</th>
              <th className="tableHeadings">Cost Price</th>
              <th className="tableHeadings">Current Price</th>
            </tr>
          </thead>
          <tbody>
            {arr.map((task, index) => (
              <tr key={task.id}>
                <td className="tableValues">{task.date}</td>
                <td className="tableValues">{task.ticker}</td>
                <td className="tableValues">{task.units}</td>
                <td className="tableValues">{task.costPrice}</td>
                <td className="tableValues">
                  {storedPrices[task.ticker]
                    ? storedPrices[task.ticker]["price"]
                    : ""}
                </td>

                <td>
                  <Button onClick={() => deleteItem(index)}>Delete</Button>
                </td>
                <td>
                  <Button onClick={() => editItem(index)}>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  }

  function tickerForm() {
    return (
      <>
        <Form onSubmit={(e) => handleAddStock(e)} className="info" id="form1">
          <Form.Group as={Col} xs={12} md="auto">
            <Form.Control
              type="date"
              placeholder="Date"
              onInput={(event) => setDate(event.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} xs={12} md="auto">
            <Form.Control
              type="text"
              placeholder="Stock Ticker"
              onChange={(event) => setTicker(event.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} xs={12} md="auto">
            <Form.Control
              type="number"
              step="any"
              placeholder="Units"
              onChange={(event) => setUnits(event.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} xs={12} md="auto">
            <Form.Control
              type="number"
              step="any"
              placeholder="Cost Price"
              onChange={(event) => setCostPrice(event.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} xs={12} md="auto">
            <Button type="submit">Add</Button>
          </Form.Group>
        </Form>
      </>
    );
  }

  function investmentModal() {
    //console.log("investmentmodalCalled")
    return (
      <Modal show={modalOpen} onHide={() => toggleModal(!modalOpen)}>
        <Modal.Header closeButton>Edit</Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => handleEdit("Stock", e)} id="edit">
            <Form.Group>
              <Form.Label> Date </Form.Label>
              <Form.Control
                type="date"
                defaultValue={edit.date}
                onChange={(event) =>
                  setEdit({
                    ...edit,
                    date: event.target.value
                  })
                }
              />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label> Stock Ticker </Form.Label>
              <Form.Control
                type="text"
                defaultValue={edit.ticker}
                onChange={(event) =>
                  setEdit({
                    ...edit,
                    ticker: event.target.value
                  })
                }
              />
              <br />
            </Form.Group>
            <Form.Group>
              <Form.Label> Units </Form.Label>
              <Form.Control
                type="number"
                defaultValue={edit.units}
                onChange={(event) =>
                  setEdit({
                    ...edit,
                    units: event.target.value
                  })
                }
              />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label> Cost Price </Form.Label>
              <Form.Control
                type="number"
                defaultValue={edit.costPrice}
                onChange={(event) =>
                  setEdit({
                    ...edit,
                    costPrice: event.target.value
                  })
                }
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              onClick={() => toggleModal(false)}
            >
              Save changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <div>
      {TopBar()}
      <br />
      <h1 className="add"> Add a Stock </h1>
      {investmentModal()}
      <div>{tickerForm()}</div>
      <h1 className="expenseHeadings"> My Stocks </h1>
      <div>{investmentTable()}</div>
    </div>
  );
}

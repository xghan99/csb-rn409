import { React, useState, useEffect } from "react";
import { Form, Col } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import firebase from "../Firebase";

export default function Investment() {
  const [arr, setArr] = useState([]);
  const [date, setDate] = useState("");
  const [ticker, setTicker] = useState("");
  const [units, setUnits] = useState(0);
  const [costPrice, setCostPrice] = useState(0.0);
  const { currentUser } = useAuth();

  const db = firebase.firestore();

  function getExpenses() {
    db.collection("investment")
      .doc(currentUser.email)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const items = doc.data().expensesAndIncome;
          setArr(items);
        } else {
          db.collection("investment")
            .doc(currentUser.email)
            .set({ expensesAndIncome: [], goal: 0 });
        }
      });
  }

  useEffect(() => {
    getExpenses();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    document.body.style.backgroundImage = "url(resources/soft_wallpaper.png)";
  }, []);

  function tickerForm() {
    return (
      <>
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
            placeholder="Amount"
            onChange={(event) => setUnits(event.target.value)}
          />
        </Form.Group>
        <Form.Group as={Col} xs={12} md="auto">
          <Form.Control
            type="number"
            step="any"
            placeholder="Amount"
            onChange={(event) => setCostPrice(event.target.value)}
          />
        </Form.Group>
      </>
    );
  }
  return (
    <div>
      <h1>test</h1>
    </div>
  );
}

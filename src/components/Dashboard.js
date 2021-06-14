import React, { useState, useEffect } from "react";
import { ProgressBar, Form, Col, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import firebase from "../Firebase";
import Visualisation from "./Visualisation";
import { datediff } from "./Utilities";

function Dashboard() {
  const { currentUser } = useAuth();
  const db = firebase.firestore();
  const expensesDoc = db.collection("expenses").doc(currentUser.email);
  const [stats, setStats] = useState({
    totalAmount: null,
    wantAmount: null,
    needAmount: null
  });
  const [goal, setGoal] = useState(0);
  const [filteredAmount, setFilteredAmount] = useState(0);

  today = new Date();
  var currentMonth = String(today.getMonth() + 1).padStart(2, "0");

  const income = 3000;
  function getExpensesSummary() {
    //helper
    const amountAddFunc = (seed, currObj) =>
      Number(seed) + Number(currObj.amount);

    const totalAmount = (tasks) => tasks.reduce(amountAddFunc, 0).toFixed(2);
    // const amountTilDate=
    const wantAmount = (tasks) =>
      tasks
        .filter((task) => !task.isNeed)
        .reduce(amountAddFunc, 0)
        .toFixed(2);

    const needAmount = (tasks) =>
      tasks
        .filter((task) => task.isNeed)
        .reduce(amountAddFunc, 0)
        .toFixed(2);

    const filteredAmount = (tasks) =>
      tasks
        .filter((task) => task.date.slice(5, 7) === currentMonth)
        .reduce(amountAddFunc, 0)
        .toFixed(2);

    const obj = expensesDoc.get().then((doc) => {
      if (doc.exists) {
        const arr = doc.data().Expenses;
        setStats({
          totalAmount: totalAmount(arr),
          wantAmount: wantAmount(arr),
          needAmount: needAmount(arr)
        });
        setFilteredAmount(filteredAmount(arr));
      } else {
        return null;
      }
    });

    return obj;
  }

  function handleSaving(event) {
    event.preventDefault();
    expensesDoc.update({ Goal: goal });
  }

  useEffect(() => {
    getExpensesSummary();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div>
        <Form
          className="info"
          id="form1"
          onSubmit={(event) => handleSaving(event)}
        >
          <Form.Row>
            <Form.Group as={Col} xs={12} md="auto">
              <Form.Control
                type="number"
                placeholder="Savings Goal"
                onInput={(event) => setGoal(event.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} xs={12} md="auto">
              <Button type="submit">Set</Button>
            </Form.Group>
          </Form.Row>
        </Form>
      </div>
      <br />

      <div>
        <h1>You can potentially save ${income - filteredAmount}!</h1>
      </div>
      <br />
      <div>
        <div className="splitExpense">
          <div>
            <h3 id="want">Want Expenses: ${stats.wantAmount}</h3>
            <h3 id="need">Need Expenses: ${stats.needAmount}</h3>
          </div>
          <div>
            <h3 className="addMarg" id="total">
              Total Expenses: ${stats.totalAmount}
            </h3>
          </div>
        </div>
        <div>
          <Visualisation stats={stats} />
        </div>
      </div>
    </>
  );
}

export default Dashboard;

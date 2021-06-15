import React, { useState, useEffect } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import firebase from "../Firebase";
import Visualisation from "./Visualisation";
import TopBar from "./TopBar";
import { daystillend } from "./Utilities";

function Dashboard() {
  const { currentUser } = useAuth();
  const db = firebase.firestore();
  const expensesDoc = db
    .collection("expenses-and-income")
    .doc(currentUser.email);
  const [stats, setStats] = useState({
    totalExpense: null,
    wantExpense: null,
    needExpense: null
  });
  const [goal, setGoal] = useState(0);
  const [monthlyExp, setMonthlyExp] = useState(0);
  const [income, setIncome] = useState(0);

  const today = new Date();
  var currentMonth = String(today.getMonth() + 1).padStart(2, "0");
  var currentDate = today.getDate();

  //const income = 3000;
  function getExpensesSummary() {
    //helper
    const amountAddFunc = (seed, currObj) =>
      Number(seed) + Number(currObj.amount);
    const incomePred = (task) => task.type === "Income";
    const expensePred = (task) => task.type === "Expense";

    const wantExpense = (tasks) =>
      tasks
        .filter((task) => task.isNeed === false)
        .filter((task) => task.date.slice(5, 7) === currentMonth)
        .reduce(amountAddFunc, 0)
        .toFixed(2);

    const needExpense = (tasks) =>
      tasks
        .filter((task) => task.isNeed === true)
        .filter((task) => task.date.slice(5, 7) === currentMonth)
        .reduce(amountAddFunc, 0)
        .toFixed(2);

    const incomeForCurrMonth = (tasks) =>
      tasks
        .filter(incomePred)
        .filter((task) => task.date.slice(5, 7) === currentMonth)
        .reduce(amountAddFunc, 0)
        .toFixed(2);

    const expenseForCurrMonth = (tasks) =>
      tasks
        .filter(expensePred)
        .filter((task) => task.date.slice(5, 7) === currentMonth)
        .reduce(amountAddFunc, 0)
        .toFixed(2);

    const obj = expensesDoc.get().then((doc) => {
      if (doc.exists) {
        const arr = doc.data().expensesAndIncome
          ? doc.data().expensesAndIncome
          : [];
        setStats({
          totalExpense: expenseForCurrMonth(arr),
          wantExpense: wantExpense(arr),
          needExpense: needExpense(arr)
        });
        setMonthlyExp(expenseForCurrMonth(arr));
        const goalobj = doc.data().Goal;
        setGoal(goalobj);
        setIncome(incomeForCurrMonth(arr));
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
      <TopBar />
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
        <h1>
          {" "}
          You can spend up to $
          {(income - monthlyExp - goal) / daystillend() >= 0
            ? ((income - monthlyExp - goal) / daystillend()).toFixed(2)
            : 0}{" "}
          daily till the end of the month!
        </h1>
      </div>
      <div>
        <h2>
          Current Average Daily Spending: $
          {monthlyExp / currentDate >= 0
            ? (monthlyExp / currentDate).toFixed(2)
            : 0}
        </h2>
      </div>
      <br />
      <div>
        <div className="splitExpense">
          <div>
            <h3 id="want">Want Expenses: ${stats.wantExpense}</h3>
            <h3 id="need">Need Expenses: ${stats.needExpense}</h3>
          </div>
          <div>
            <h3 className="addMarg" id="total">
              Total Expenses: ${stats.totalExpense}
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

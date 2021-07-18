import React, { useState, useEffect, useRef } from "react";
import { Card, Row, Container, Form, Col, ListGroup } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import firebase from "../Firebase";
import Visualisation from "./Visualisation";
import TopBar from "./TopBar";
import { daystillend, updateExisting, differenceInDays } from "./Utilities";
import { CircleFill } from "react-bootstrap-icons";
import StockProfitLossCard from "./DashboardCards/StockProfitLossCard";
import AnalysisCard from "./DashboardCards/AnalysisCard";
import BreakdownCard from "./DashboardCards/BreakdownCard";
import SavingGoalCard from "./DashboardCards/SavingGoalCard";
import OtherInvestmentCard from "./DashboardCards/OtherInvestmentCard";
import Plot from "react-plotly.js";

function Dashboard() {
  const { currentUser } = useAuth();
  const db = firebase.firestore();
  const expensesDoc = db
    .collection("expenses-and-income")
    .doc(currentUser.email);

  //investment states
  const [stocks, setStocks] = useState([]);
  const [storedPrices, setStoredPrices] = useState({});
  const [apiKey, setApiKey] = useState("");
  const [stocksSummary, setStocksSummary] = useState({});
  const [otherSummary, setOtherSummary] = useState({});
  const [other, setOther] = useState("");

  //expenditure states
  const [stats, setStats] = useState({
    totalExpense: null,
    wantExpense: null,
    needExpense: null
  });
  const [goal, setGoal] = useState(0);
  const [tempGoal, setTempGoal] = useState(0);
  const [monthlyExp, setMonthlyExp] = useState(0);
  const [income, setIncome] = useState(0);
  const [quote, setQuote] = useState("");
  const [person, setPerson] = useState("");

  //date helpers
  const today = new Date();
  var currentMonth = String(today.getMonth() + 1).padStart(2, "0");
  var currentDate = today.getDate();

  // investment stuff
  function getApiKey() {
    db.collection("keys")
      .doc("apiKey")
      .onSnapshot((doc) => {
        setApiKey(doc.data().apiKey);
      });
  }

  useEffect(() => {
    db.collection("investment")
      .doc(currentUser.email)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const items = doc.data().stocks;
          setStocks(items);
        } else {
          db.collection("investment")
            .doc(currentUser.email)
            .set({ stocks: [] });
        }
      });
    // eslint-disable-next-line
  }, []);

  //first setStoredPrices, setStocks, setApiKey that is called after render
  useEffect(() => {
    getApiKey();
    db.collection("investment")
      .doc("stockInfo")
      .onSnapshot((doc) => {
        var newStoredPrices = doc.data().storedPrices;
        setStoredPrices(newStoredPrices);
      });
    // eslint-disable-next-line
  }, []);

  //second updateExising() is called everytime storedPrices is updated and not on initial state
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    updateExisting(apiKey, stocks, storedPrices);
    setStocksSummary(summariseStocks(stocks, storedPrices));
    setOtherSummary(summariseOther(stocks));
    // eslint-disable-next-line
  }, [storedPrices]);

  function summariseStocks(arr, storedPrices) {
    var summaryObj = {};
    for (const transaction of arr) {
      if (transaction.type === "Other") {
        continue;
      }
      var cost = +transaction.costPrice;
      var current = +storedPrices[transaction.ticker].price
        ? +storedPrices[transaction.ticker].price
        : +transaction.costPrice;
      var units = +transaction.units;
      if (transaction.ticker in summaryObj) {
        summaryObj[transaction.ticker] += (current - cost) * units;
      } else {
        summaryObj[transaction.ticker] = (current - cost) * units;
      }
    }
    for (const ticker of Object.keys(summaryObj)) {
      summaryObj[ticker] = summaryObj[ticker].toFixed(2);
    }
    return summaryObj;
  }

  function summariseOther(arr) {
    var summaryObj = {};
    for (const transaction of arr) {
      if (transaction.type === "Ticker") {
        continue;
      }
      var currentPrice =
        +transaction.units *
        +transaction.costPrice *
        Math.pow(
          1 + +transaction.rate / 100 / 365,
          differenceInDays(transaction.date)
        );

      var pricesArr = [currentPrice];

      for (let i = 0; i < 30; i++) {
        pricesArr.push(
          currentPrice * Math.pow(1 + +transaction.rate / 36500, (i + 1) * 365)
        );
      }

      if (transaction.ticker in summaryObj) {
        summaryObj[transaction.ticker] = arrMatrixAddition(
          pricesArr,
          summaryObj[transaction.ticker]
        );
      } else {
        summaryObj[transaction.ticker] = pricesArr;
      }
    }
    for (const ticker of Object.keys(summaryObj)) {
      summaryObj[ticker] = summaryObj[ticker].map((value) => value.toFixed(2));
    }
    return summaryObj;
  }

  function arrMatrixAddition(arr1, arr2) {
    for (let i = 0; i < arr2.length; i++) {
      arr2[i] += arr1[i];
    }
    return arr2;
  }

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

        setIncome(incomeForCurrMonth(arr));
      } else {
        db.collection("expenses-and-income")
          .doc(currentUser.email)
          .set({ expensesAndIncome: [], goal: 0 });
      }
    });

    return obj;
  }

  function handleSaving(event) {
    event.preventDefault();
    if (tempGoal >= 0) {
      expensesDoc.update({ goal: tempGoal });
    } else {
      alert("Savings Goal cannot be negative!");
    }
  }

  useEffect(() => {
    document.body.style.backgroundImage = "url(resources/soft_wallpaper.png)";
  }, []);

  useEffect(() => {
    getExpensesSummary();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    motivationalQuote();
    // eslint-disable-next-line
  }, []);

  function getGoal() {
    expensesDoc.onSnapshot((doc) => {
      if (doc.exists) {
        const goalobj = doc.data().goal;
        setGoal(goalobj);
      } else {
        return null;
      }
    });
  }

  useEffect(() => {
    getGoal();
    // eslint-disable-next-line
  }, []);

  async function motivationalQuote() {
    var int = Math.floor(Math.random() * 10.9);

    var docRef = db.collection("Finance Quotes").doc("Finance Quotes");
    try {
      const doc = await docRef.get();
      if (doc.exists) {
        setQuote(doc.data().quotes[int].quote);
        setPerson(doc.data().quotes[int].name);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log("Error getting document");
    }
  }

  function motivationCard() {
    return (
      <Card.Body>
        <Card.Title>Random Financial Quote</Card.Title>
        <Card.Text className="cardText">
          "{quote}" ~{person}
        </Card.Text>
      </Card.Body>
    );
  }

  function getRecMessage() {
    if (dailyExpense == 0 && dailyBudget == 0) {
      return "";
    } else if (+dailyExpense == +dailyBudget) {
      return "We recommend that you watch your expenses closely so as not to exceed your budget.";
    } else if (+dailyExpense >= +dailyBudget) {
      if (dailyBudget <= 0) {
        return "We recommend that you start earning some additional income to offset your expenses";
      }
      if (+stats.wantExpense > 0) {
        return "We recommend that you spend less on wants to better achieve your savings goal";
      } else {
        return "Looks like there are much needed expenses that are hindering your savings goal, consider earning some additional income to offset these important expenses to achieve your savings goal!";
      }
    } else {
      return (
        "Keep up the good work! You can afford to spend " +
        dailyBudget +
        " daily and still be able to achieve your savings goal!"
      );
    }
  }

  var dailyBudget = (
    (income - monthlyExp - goal) /
    (daystillend() + 1)
  ).toFixed(2);

  var dailyExpense = (monthlyExp / currentDate).toFixed(2);

  var financialStatus =
    +dailyExpense == +dailyBudget ? (
      <CircleFill color="orange" />
    ) : +dailyExpense <= +dailyBudget ? (
      <CircleFill color="green" />
    ) : (
      <CircleFill color="red" />
    );

  function visualisationCard() {
    return (
      <>
        <div>
          <Visualisation stats={stats} />
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar />
      <br />
      <Container>
        <div aria-live="polite" aria-atomic="true">
          <Row className="d-flex justify-content-lg-center">
            <Card style={{ width: "60rem" }}>{motivationCard()}</Card>
          </Row>
          <Row className="d-flex justify-content-lg-center">
            <Card style={{ width: "30rem" }}>
              <SavingGoalCard
                handleSaving={handleSaving}
                setTempGoal={setTempGoal}
                goal={goal}
              />
            </Card>
            <Card style={{ width: "30rem" }}>
              <AnalysisCard
                financialStatus={financialStatus}
                getRecMessage={getRecMessage}
                dailyBudget={dailyBudget}
                dailyExpense={dailyExpense}
              />
            </Card>
          </Row>
          <Row className="d-flex justify-content-lg-center">
            <Card style={{ width: "30rem" }}>
              <BreakdownCard
                totalExpense={stats.totalExpense}
                needExpense={stats.needExpense}
                wantExpense={stats.wantExpense}
              />
            </Card>
            <Card style={{ width: "30rem" }}>{visualisationCard()}</Card>
          </Row>
          <Row className="d-flex justify-content-lg-center">
            <Card style={{ width: "30rem" }}>
              <StockProfitLossCard stocksSummary={stocksSummary} />
            </Card>
            <Card style={{ width: "30rem" }}>
              <OtherInvestmentCard
                setOther={setOther}
                other={other}
                otherSummary={otherSummary}
              />
            </Card>
          </Row>
        </div>
      </Container>
    </>
  );
}

export default Dashboard;

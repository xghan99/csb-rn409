import React, { useState, useEffect } from "react";
import {
  Form,
  Col,
  Button,
  Card,
  Row,
  Container,
  ListGroup
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import firebase from "../Firebase";
import Visualisation from "./Visualisation";
import TopBar from "./TopBar";
import { daystillend } from "./Utilities";
import { CircleFill } from "react-bootstrap-icons";

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
  const [tempGoal, setTempGoal] = useState(0);
  const [monthlyExp, setMonthlyExp] = useState(0);
  const [income, setIncome] = useState(0);
  const [quote, setQuote] = useState("");
  const [person, setPerson] = useState("");
  const today = new Date();
  var currentMonth = String(today.getMonth() + 1).padStart(2, "0");
  var currentDate = today.getDate();
  var fill =
    (100 * (monthlyExp / currentDate)) /
    ((income - monthlyExp - goal) / daystillend());

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
        return null;
      }
    });

    return obj;
  }

  function handleSaving(event) {
    event.preventDefault();
    if (tempGoal >= 0) {
      expensesDoc.update({ Goal: tempGoal });
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
        const goalobj = doc.data().Goal;
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
        <Card.Title>Quote of the day</Card.Title>
        <Card.Text className="cardText">
          "{quote}" ~{person}
        </Card.Text>
      </Card.Body>
    );
  }

  function savingGoalCard() {
    return (
      <>
        <Card.Body>
          <Card.Title>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0
                }}
              >
                <img
                  variant="top"
                  src="resources/piggybank.png"
                  height="30px"
                  width="30px"
                  alt=""
                />
              </div>
            </div>
            <div className="cardHeadings">Saving Goal</div>
          </Card.Title>
          <Card.Text className="cardText">
            <Form className="info" id="form1" onSubmit={handleSaving}>
              <Form.Row>
                <Form.Group as={Col} xs={12} md="auto">
                  <Form.Control
                    type="number"
                    placeholder="Savings Goal"
                    onChange={(event) => setTempGoal(event.target.value)}
                  />
                </Form.Group>
                <Form.Group as={Col} xs={12} md="auto">
                  <Button type="submit">Set</Button>
                </Form.Group>
              </Form.Row>
            </Form>
            <br />
            <div className="text-center">
              {" "}
              <b>Current goal:</b> ${goal}{" "}
            </div>
          </Card.Text>
        </Card.Body>
      </>
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
  function analysisCard() {
    return (
      <>
        <Card.Body>
          <Card.Title className="cardHeadings">
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0
                }}
              >
                <img
                  variant="top"
                  src="resources/dollarnote.png"
                  height="30px"
                  width="30px"
                  alt=""
                />
              </div>
            </div>
            <div className="cardHeadings"> Analysis </div>
          </Card.Title>
          <Card.Text className="cardText">
            {" "}
            <ListGroup>
              <ListGroup.Item>
                <div>
                  {" "}
                  <b> Financial status: </b> {financialStatus}{" "}
                </div>
                <br />
                <div> {getRecMessage()} </div>
              </ListGroup.Item>
              <ListGroup.Item>
                {" "}
                <b>Max Daily Budget:</b> ${dailyBudget}{" "}
              </ListGroup.Item>
              <ListGroup.Item>
                <b> Average Daily Spending: </b> $ {dailyExpense}{" "}
              </ListGroup.Item>
            </ListGroup>
          </Card.Text>
        </Card.Body>
      </>
    );
  }

  function breakDownCard() {
    return (
      <>
        <Card.Body>
          <Card.Title>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0
                }}
              >
                <img
                  variant="top"
                  src="resources/piechart.png"
                  height="30px"
                  width="30px"
                  alt=""
                />
              </div>
            </div>
            <div className="cardHeadings">Breakdown</div>
          </Card.Title>
          <div>
            <Row>
              <Col lg={6}>
                <Card
                  className="m-1"
                  border="danger"
                  style={{ width: "13rem" }}
                >
                  <Card.Body>
                    <Card.Title className="cardSubheading">
                      Want Expenses
                    </Card.Title>
                    <Card.Text className="cardText">
                      ${stats.wantExpense}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6}>
                <Card className="m-1" border="success">
                  <Card.Body>
                    <Card.Title className="cardSubheading">
                      Need Expenses
                    </Card.Title>
                    <Card.Text className="cardText">
                      ${stats.needExpense}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Card className="m-1" border="info">
                  <Card.Body>
                    <Card.Title className="cardSubheading">
                      Total Expenses
                    </Card.Title>
                    <Card.Text className="cardText">
                      ${stats.totalExpense}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </Card.Body>
      </>
    );
  }

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
            <Card style={{ width: "30rem" }}>{savingGoalCard()}</Card>
            <Card style={{ width: "30rem" }}>{analysisCard()}</Card>
          </Row>
          <Row className="d-flex justify-content-lg-center">
            <Card style={{ width: "30rem" }}>{breakDownCard()}</Card>
            <Card style={{ width: "30rem" }}>{visualisationCard()}</Card>
          </Row>
        </div>
      </Container>
    </>
  );
}

export default Dashboard;

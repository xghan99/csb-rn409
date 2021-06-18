import React, { useState, useEffect } from "react";
import {
  Form,
  Col,
  Button,
  ProgressBar,
  Toast,
  Card,
  Row,
  Container
} from "react-bootstrap";
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
  var now =
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

  const [showA, setShowA] = useState(true);
  const [showB, setShowB] = useState(true);

  const handleCloseA = () => setShowA(!showA);
  const handleCloseB = () => setShowB(!showB);

  function userGuideToast() {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0
        }}
      >
        <Toast show={showA} onClose={handleCloseA} animation={true}>
          <Toast.Header>
            <img
              src="resources/pig.png"
              width="30"
              height="30"
              className="rounded mr-2"
              alt=""
            />
            <strong className="mr-auto">Goalie Admin</strong>
            <small>just now</small>
          </Toast.Header>
          <Toast.Body>
            First time here? Check out our user guide here!
          </Toast.Body>
        </Toast>
        <Toast show={showB} onClose={handleCloseB} animation={true}>
          <Toast.Header>
            <img
              src="resources/pig.png"
              width="30"
              height="30"
              className="rounded mr-2"
              alt=""
            />
            <strong className="mr-auto">Goalie Admin</strong>
            <small>2 seconds ago</small>
          </Toast.Header>
          <Toast.Body>
            <a href="/guide"> guide </a>
          </Toast.Body>
        </Toast>
      </div>
    );
  }

  function bottom() {
    return (
      <>
        <Row className="d-flex justify-content-lg-center">
          <Card style={{ width: "30rem" }}>
            <Card.Body>
              <Card.Title>
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
                <div className="cardHeadings">Expenditure Breakdown</div>
              </Card.Title>
              <div>
                <Row>
                  <Col lg={6}>
                    <Card className="m-1" border="danger">
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
          </Card>

          <Card style={{ width: "30rem" }}>
            <div>
              <Visualisation stats={stats} />
            </div>
          </Card>
        </Row>
      </>
    );
  }

  useEffect(() => {
    getExpensesSummary();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <TopBar />
      <br />
      <Container>
        <div aria-live="polite" aria-atomic="true">
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
          <Row className="d-flex justify-content-lg-center">
            <Card style={{ width: "30rem" }}>
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
                <Card.Text className="cardText">${goal}</Card.Text>
              </Card.Body>
            </Card>
            <Card style={{ width: "30rem" }}>
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
                  <div className="cardHeadings">
                    Daily Budget: $
                    {(income - monthlyExp - goal) / daystillend() >= 0
                      ? ((income - monthlyExp - goal) / daystillend()).toFixed(
                          2
                        )
                      : 0}
                  </div>
                </Card.Title>
                <ProgressBar
                  animated
                  now={now}
                  variant={now < 100 ? "success" : "danger"}
                />
                <Card.Text className="cardText">{`Current Average Daily Spending: $
          ${(monthlyExp / currentDate).toFixed(2)}`}</Card.Text>
              </Card.Body>
            </Card>
          </Row>
        </div>
        {bottom()}
      </Container>
    </>
  );
}

export default Dashboard;

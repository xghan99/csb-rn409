import React, { useState, useEffect } from "react";
import {
  Form,
  Modal,
  Button,
  ButtonGroup,
  Col,
  Table,
  ToggleButton
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import firebase from "../Firebase";
import { validate, revchrono } from "./Utilities";
import ExpensesForm from "./ExpensesForm";
import IncomeForm from "./IncomeForm";

function TaskManager() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [isNeed, setNeedWant] = useState(null);
  const [amount, setAmount] = useState();
  const [category, setCat] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, toggleModal] = useState(false);
  const [edit, setEdit] = useState({
    id: null,
    description: "",
    isNeed: null,
    amount: null,
    category: null,
    date: ""
  });
  const [filters, setFilters] = useState({
    isNeed: "default",
    category: "default"
  });
  const [isExpense, toggleExpenseIncome] = useState(false);

  const expFilter = (task) => {
    if (filters.isNeed !== "default" && filters.isNeed !== task.isNeed) {
      return false;
    }
    if (filters.category !== "default" && filters.category !== task.category) {
      return false;
    }
    return true;
  };

  //ref
  const db = firebase.firestore();

  function getExpenses() {
    setLoading(true);
    db.collection("expenses")
      .doc(currentUser.email)
      .onSnapshot((doc) => {
        if (doc.exists) {
          //console.log(doc);
          const items = doc.data().Expenses;
          setTasks(items);
          setLoading(false);
        } else {
          const newObj = {
            Expenses: []
          };
          db.collection("expenses").doc(currentUser.email).set(newObj);
          setLoading(false);
        }
      });
  }

  useEffect(() => {
    getExpenses();
    // eslint-disable-next-line
  }, []);

  function handleAddExpense(event) {
    event.preventDefault();
    if (addExpense(newTaskText) !== false) {
      event.target.reset();
      setNewTaskText("");
      setNeedWant(null);
      setAmount();
      setCat("");
      setDate("");
    }
  }

  function addExpense(description) {
    const newTasks = [
      ...tasks,
      {
        id: tasks.length,
        description: description,
        isNeed: isNeed,
        amount: amount,
        category: category,
        date: date
      }
    ];

    if (validate("Expense", newTasks[newTasks.length - 1]) === 1) {
      revchrono(newTasks);
      const newObj = {
        Expenses: newTasks
      };
      db.collection("expenses")
        .doc(currentUser.email)
        .set(newObj)
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert(validate("expense", newTasks[newTasks.length - 1]));
      return false;
    }
  }

  function handleAddIncome(event) {
    event.preventDefault();
    if (addIncome(newTaskText) !== false) {
      event.target.reset();
      setNewTaskText("");
      setNeedWant(null);
      setAmount();
      setCat("");
      setDate("");
    }
  }

  function addIncome(description) {
    const newTasks = [
      ...tasks,
      {
        id: tasks.length,
        description: description,
        isNeed: "-",
        amount: amount,
        category: category,
        date: date
      }
    ];

    if (validate("Income", newTasks[newTasks.length - 1]) === 1) {
      revchrono(newTasks);
      const newObj = {
        Expenses: newTasks
      };
      db.collection("expenses")
        .doc(currentUser.email)
        .set(newObj)
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert(validate("Income", newTasks[newTasks.length - 1]));
      return false;
    }
  }

  function deleteItem(index) {
    const newTasks = tasks
      .slice(0, index)
      .concat(tasks.slice(index + 1, tasks.length));
    revchrono(newTasks);
    //console.log(newTasks);
    const newObj = {
      Expenses: newTasks
    };
    db.collection("expenses").doc(currentUser.email).set(newObj);
  }

  function handleEdit(event) {
    event.preventDefault();
    if (validate(edit) === 1) {
      const newTasks = [...tasks];
      newTasks[edit.id] = edit;

      //console.log(edit);
      revchrono(newTasks);
      const newObj = {
        Expenses: newTasks
      };
      db.collection("expenses").doc(currentUser.email).set(newObj);
      document.getElementById("form1").reset();
    } else {
      alert(validate(edit));
      toggleModal(true);
    }
  }

  function editItem(index) {
    setEdit(tasks[index]);
    toggleModal(true);
  }

  function handleIsNeedFilter(e) {
    let isNeedFilterValue = false;
    if (e.target.value === "Need") {
      isNeedFilterValue = true;
    } else if (e.target.value === "Need/Want") {
      isNeedFilterValue = "default";
    }
    setFilters({ ...filters, isNeed: isNeedFilterValue });
  }

  function handleCatFilter(e) {
    let catFilterValue = "default";
    if (e.target.value !== "Category") {
      catFilterValue = e.target.value;
    }
    setFilters({ ...filters, category: catFilterValue });
  }

  return (
    <main>
      <div>
        <h2>Add {isExpense ? "Expense" : "Income"} </h2>
        {loading ? <h2> loading... </h2> : null}
        <ButtonGroup toggle className="mb-2">
          <ToggleButton
            type="radio"
            checked={isExpense}
            onChange={(e) => toggleExpenseIncome(true)}
          >
            Expense
          </ToggleButton>
          <ToggleButton
            type="radio"
            checked={!isExpense}
            onChange={(e) => toggleExpenseIncome(false)}
          >
            Income
          </ToggleButton>
        </ButtonGroup>
        {isExpense && (
          <ExpensesForm
            handleAddTask={handleAddExpense}
            setDate={setDate}
            setNewTaskText={setNewTaskText}
            setAmount={setAmount}
            setCat={setCat}
            setNeedWant={setNeedWant}
          />
        )}
        {!isExpense && (
          <IncomeForm
            handleAddTask={handleAddIncome}
            setDate={setDate}
            setNewTaskText={setNewTaskText}
            setAmount={setAmount}
            setCat={setCat}
          />
        )}
      </div>

      <div className="addMarg">
        <h3> Filter expenses by </h3>
      </div>

      <div>
        <Form className="info">
          <Form.Row>
            <Form.Group as={Col} xs={12} md="auto">
              <Form.Control as="select" onChange={(e) => handleIsNeedFilter(e)}>
                <option> Need/Want </option>
                <option> Need </option>
                <option> Want </option>
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} xs={12} md="auto">
              <Form.Control as="select" onChange={(e) => handleCatFilter(e)}>
                <option> Category </option>
                <option> Food & Drink </option>
                <option> Entertainment </option>
                <option> Others </option>
              </Form.Control>
            </Form.Group>
          </Form.Row>
        </Form>
      </div>
      <div>
        <div>
          <h2> My Expenses Table </h2>
        </div>
        <Table
          responsive
          style={{ margin: "0 auto", width: "100%" }}
          className="addMarg"
        >
          <thead>
            <tr>
              <th>No.</th>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Need/Want</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {tasks.filter(expFilter).map((task, index) => (
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td>{task.date}</td>
                <td>{task.description}</td>
                <td>${task.amount}</td>
                <td style={{ color: task.isNeed ? "green" : "red" }}>
                  {task.isNeed === "-" ? "-" : task.isNeed ? "Need" : "Want"}
                </td>
                <td>{task.category}</td>
                <td>
                  <button onClick={() => deleteItem(index)}>Delete</button>
                </td>
                <td>
                  <button onClick={() => editItem(index)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Modal show={modalOpen} onHide={() => toggleModal(!modalOpen)}>
        <Modal.Header closeButton>Edit</Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => handleEdit(e)} id="edit">
            <Form.Group>
              <Form.Label> Date </Form.Label>
              <Form.Control
                type="date"
                defaultValue={edit.date}
                onChange={(event) =>
                  setEdit({ ...edit, date: event.target.value })
                }
              />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label> Amount </Form.Label>
              <Form.Control
                type="number"
                defaultValue={edit.amount}
                onChange={(event) =>
                  setEdit({ ...edit, amount: event.target.value })
                }
              />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label> Category </Form.Label>
              <Form.Control
                as="select"
                defaultValue={edit.category}
                onChange={(event) =>
                  setEdit({ ...edit, category: event.target.value })
                }
              >
                <option> Food & Drink </option>
                <option> Entertainment </option>
                <option> Others </option>
              </Form.Control>
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label> Description </Form.Label>
              <Form.Control
                type="text"
                defaultValue={edit.description}
                onChange={(event) =>
                  setEdit({ ...edit, description: event.target.value })
                }
              />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Check
                type="radio"
                label="Need"
                name="formHorizontolRadios"
                id="formHorizontalRadios1"
                defaultChecked={edit.isNeed}
                onChange={(event) => setEdit({ ...edit, isNeed: true })}
              />
              <Form.Check
                type="radio"
                label="Want"
                name="formHorizontolRadios"
                id="formHorizontalRadios2"
                defaultChecked={!edit.isNeed}
                onChange={(event) => setEdit({ ...edit, isNeed: false })}
              />
            </Form.Group>
            <br />
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
    </main>
  );
}

export default TaskManager;

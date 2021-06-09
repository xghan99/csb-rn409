import React, { useState, useEffect } from "react";
import { Form, Modal, Button, Col, Table, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import firebase from "../Firebase";
import validate from "./validate";

function TaskManager() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [isNeed, setNeedWant] = useState(false);
  const [amount, setAmount] = useState();
  const [category, setCat] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, toggleModal] = useState(false);
  const [edit, setEdit] = useState({
    id: null,
    description: "",
    isNeed: null,
    amount: null,
    category: null
  });

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

  function handleAddTask(event) {
    event.preventDefault();
    addTask(newTaskText);
  }

  function addTask(description) {
    const newTasks = [
      ...tasks,
      {
        id: tasks.length,
        description: description,
        isNeed: isNeed,
        amount: amount,
        category: category
      }
    ];

    if (validate(newTasks[newTasks.length - 1])) {
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
      alert("Please ensure all fields are filled!");
    }
  }

  function deleteItem(index) {
    const newTasks = tasks
      .slice(0, index)
      .concat(tasks.slice(index + 1, tasks.length));
    //console.log(newTasks);
    const newObj = {
      Expenses: newTasks
    };
    db.collection("expenses").doc(currentUser.email).set(newObj);
  }

  function handleEdit(index) {
    const newTasks = [...tasks];
    newTasks[index] = edit;

    //console.log(edit);

    const newObj = {
      Expenses: newTasks
    };
    db.collection("expenses").doc(currentUser.email).set(newObj);
  }

  function editItem(index) {
    setEdit(tasks[index]);
    toggleModal(true);
  }

  return (
    <main>
      <div className="addMarg">
        <h2>Add Expenses</h2>
        {loading ? <h2> loading... </h2> : null}
        <Form onSubmit={handleAddTask} className="info">
          <Form.Row>
            <Form.Group as={Col} xs={12} md="auto">
              <Form.Control
                type="text"
                placeholder="Description"
                onChange={(event) => setNewTaskText(event.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} xs={12} md="auto">
              <Form.Control
                type="number"
                step="any"
                placeholder="Amount"
                onChange={(event) => setAmount(event.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} xs={12} xs={12} md="auto">
              <Form.Control
                as="select"
                onChange={(e) => setCat(e.target.value)}
              >
                <option value="NIL">--Category--</option>
                <option value="Food & Drink">Food & Drinks </option>
                <option value="Entertainment">Entertainment</option>
                <option value="Others">Others</option>
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} xs={6} md="auto">
              <Form.Check
                type="radio"
                label="Need"
                id="formHorizontalRadios3"
                style={{ color: "green" }}
                //checked={isNeed}
                onChange={(event) => setNeedWant(true)}
                name="need-want"
                className="mt-2"
              />
            </Form.Group>
            <Form.Group as={Col} xs={6} md="auto">
              <Form.Check
                type="radio"
                label="Want"
                id="formHorizontalRadios4"
                style={{ color: "red" }}
                //checked={!isNeed}
                onChange={(event) => setNeedWant(false)}
                name="need-want"
                className="mt-2"
              />
            </Form.Group>
            <Form.Group as={Col} xs={12} md="auto">
              <Button type="submit">Add</Button>
            </Form.Group>
          </Form.Row>
        </Form>
      </div>
      <div>
        <Table responsive style={{ margin: "0 auto", width: "100%" }}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Need/Want</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td>{task.description}</td>
                <td>${task.amount}</td>
                <td style={{ color: task.isNeed ? "green" : "red" }}>
                  {task.isNeed ? "Need" : "Want"}
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
          <Form onSubmit={() => handleEdit(edit.id)} id="edit">
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

import React, { useState } from "react";
//import { DropdownButton, Dropdown } from "react-bootstrap";
import CategoryDropdown from "./CategoryDropdown.js";
import { Form } from "react-bootstrap";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [isNeed, setNeedWant] = useState(false);
  const [amount, setAmount] = useState();
  const [category, setCat] = useState("");

  const amountAddFunc = (seed, currObj) =>
    Number(seed) + Number(currObj.amount);
  const totalAmount = tasks.reduce(amountAddFunc, 0);
  const wantAmount = tasks
    .filter((task) => !task.isNeed)
    .reduce(amountAddFunc, 0);
  const needAmount = tasks
    .filter((task) => task.isNeed)
    .reduce(amountAddFunc, 0);

  //const total=document.querySelector(".total")
  //total.textContent = totalamount
  function handleAddTask(event) {
    // React honours default browser behavior and the
    // default behaviour for a form submission is to
    // submit AND refresh the page. So we override the
    // default behaviour here as we don't want to refresh
    event.preventDefault();
    addTask(newTaskText);
  }

  function addTask(description) {
    const newTasks = [
      // the ... operator is called the spread operator
      // what we are doing is creating a brand new array of
      // tasks, that is different from the previous array
      // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
      ...tasks,
      {
        description: description,
        isNeed: isNeed,
        amount: amount,
        category: category
      }
    ];
    setTasks(newTasks);
    console.log(newTasks);
  }

  return (
    <>
      <div className="addMarg">
        <h2>Add Expenses</h2>
        <form onSubmit={handleAddTask}>
          <label>
            Expense:
            <input
              style={{ margin: "0 1rem" }}
              type="text"
              value={newTaskText}
              placeholder="Description"
              // how do you know it's event.target.value? it just is.
              // search it up on MDN, and view react code samples
              // See: https://reactjs.org/docs/forms.html
              onChange={(event) => setNewTaskText(event.target.value)}
            />
            <input
              style={{ margin: "0 1rem" }}
              type="text"
              value={amount}
              placeholder="Amount"
              // how do you know it's event.target.value? it just is.
              // search it up on MDN, and view react code samples
              // See: https://reactjs.org/docs/forms.html
              onChange={(event) => setAmount(event.target.value)}
            />
          </label>
          <Form inline>
            <Form.Control
              as="select"
              className="my-1 mr-sm-2"
              id="inlineFormCustomSelectPref"
              custom
              onChange={(e) => setCat(e.target.value)}
            >
              <option value="NIL">Choose...</option>
              <option value="Food & Drink">Food & Drinks</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Others">Others</option>
            </Form.Control>
          </Form>

          <label>
            Need
            <input
              style={{ margin: "0 1rem" }}
              type="radio"
              value={isNeed}
              onChange={(event) => setNeedWant(true)}
              name="need-want"
              // how do you know it's event.target.value? it just is.
              // search it up on MDN, and view react code samples
              // See: https://reactjs.org/docs/forms.html
            />
          </label>
          <label>
            Want
            <input
              style={{ margin: "0 1rem" }}
              type="radio"
              value={isNeed}
              name="need-want"
              onChange={(event) => setNeedWant(false)}
              // how do you know it's event.target.value? it just is.
              // search it up on MDN, and view react code samples
              // See: https://reactjs.org/docs/forms.html
            />
          </label>
          <input type="submit" value="Add" />
        </form>
      </div>

      <div>
        <h3 className="addMarg">
          Total Expenses: ${totalAmount}, Want Expenses: ${wantAmount}, Need
          Expenses: ${needAmount}
        </h3>
        <table style={{ margin: "0 auto", width: "100%" }}>
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
              // We should specify key here to help react identify
              // what has updated
              // https://reactjs.org/docs/lists-and-keys.html#keys
              <tr key={task.description}>
                <td>{index + 1}</td>
                <td>{task.description}</td>
                <td>${task.amount}</td>
                <td>{task.isNeed ? "Need" : "Want"}</td>
                <td>{task.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default TaskManager;

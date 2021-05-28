import React, { useState } from "react";
import { Form } from "react-bootstrap";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [isNeed, setNeedWant] = useState(false);
  const [amount, setAmount] = useState();
  const [category, setCat] = useState("");

  const amountAddFunc = (seed, currObj) =>
    Number(seed) + Number(currObj.amount);
  const totalAmount = tasks.reduce(amountAddFunc, 0).toFixed(2);
  const wantAmount = tasks
    .filter((task) => !task.isNeed)
    .reduce(amountAddFunc, 0)
    .toFixed(2);
  const needAmount = tasks
    .filter((task) => task.isNeed)
    .reduce(amountAddFunc, 0)
    .toFixed(2);

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
        id: tasks.length,
        description: description,
        isNeed: isNeed,
        amount: amount,
        category: category
      }
    ];
    setTasks(newTasks);
    console.log(newTasks);
  }
  function deleteItem(index) {
    const newTasks = tasks
      .slice(0, index)
      .concat(tasks.slice(index + 1, tasks.length));
    console.log(newTasks);
    setTasks(newTasks);
  }
  return (
    <main>
      <div className="addMarg">
        <h2>Add Expenses</h2>
        <form onSubmit={handleAddTask} className="info">
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
              type="number"
              step="any"
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
              <option value="NIL">--Category--</option>
              <option value="Food & Drink">Food & Drinks </option>
              <option value="Entertainment">Entertainment</option>
              <option value="Others">Others</option>
            </Form.Control>
          </Form>

          <div>
            <label style={{ color: "green" }}>
              Need
              <input
                style={{ margin: "0 1rem" }}
                type="radio"
                value={isNeed}
                checked={isNeed}
                onChange={(event) => setNeedWant(true)}
                name="need-want"
                // how do you know it's event.target.value? it just is.
                // search it up on MDN, and view react code samples
                // See: https://reactjs.org/docs/forms.html
              />
            </label>
            <label style={{ color: "red" }}>
              Want
              <input
                style={{ margin: "0 1rem" }}
                type="radio"
                value={isNeed}
                checked={!isNeed}
                name="need-want"
                onChange={(event) => setNeedWant(false)}
                // how do you know it's event.target.value? it just is.
                // search it up on MDN, and view react code samples
                // See: https://reactjs.org/docs/forms.html
              />
            </label>
          </div>
          <input type="submit" value="Add" />
        </form>
      </div>

      <div>
        <div className="splitExpense">
          <div>
            <h3 id="want">Want Expenses: ${wantAmount}</h3>
            <h3 id="need">Need Expenses: ${needAmount}</h3>
          </div>
          <div>
            <h3 className="addMarg" id="total">
              Total Expenses: ${totalAmount}
            </h3>
          </div>
        </div>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default TaskManager;

import React, { useState } from "react";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [needwant, setNeedWant] = useState("");
  const [amount, setAmount] = useState();
  const additionFunc = (seed, current) => Number(seed) + Number(current);
  const totalAmount = tasks.reduce(additionFunc, 0);

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
        needwant: needwant,
        amount: amount
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
          <label>
            Need
            <input
              style={{ margin: "0 1rem" }}
              type="radio"
              value={needwant}
              onChange={(event) => setNeedWant("Need")}
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
              value={needwant}
              name="need-want"
              onChange={(event) => setNeedWant("Want")}
              // how do you know it's event.target.value? it just is.
              // search it up on MDN, and view react code samples
              // See: https://reactjs.org/docs/forms.html
            />
          </label>
          <input type="submit" value="Add" />
        </form>
      </div>

      <div>
        <h3>Total Expenses: ${totalAmount}</h3>
        <table style={{ margin: "0 auto", width: "100%" }}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Need/Want</th>
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
                <td>{task.needwant}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default TaskManager;

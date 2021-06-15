import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import firebase from "../Firebase";
import { validate, revchrono } from "./Utilities";
import ExpensesForm from "./ExpensesForm";
import IncomeForm from "./IncomeForm";
import TopBar from "./TopBar";
import ExpenseEditModal from "./ExpenseEditModal";
import IncomeEditModal from "./IncomeEditModal";
import ExpenseIncomeTable from "./ExpenseIncomeTable";
import FilterForm from "./FilterForm";
import ExpenseIncomeToggle from "./ExpenseIncomeToggle";

function TaskManager() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);

  const [newTaskText, setNewTaskText] = useState("");
  const [isNeed, setNeedWant] = useState(null);
  const [amount, setAmount] = useState();
  const [category, setCat] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");

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

  const db = firebase.firestore();

  function getExpenses() {
    setLoading(true);
    db.collection("expenses-and-income")
      .doc(currentUser.email)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const items = doc.data().expensesAndIncome;
          setTasks(items);
          setLoading(false);
        } else {
          db.collection("expenses-and-income")
            .doc(currentUser.email)
            .update({ expensesAndIncome: [], goal: 0 });
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
      setType("");
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
        date: date,
        type: type
      }
    ];

    if (validate("Expense", newTasks[newTasks.length - 1]) === 1) {
      revchrono(newTasks);
      db.collection("expenses-and-income")
        .doc(currentUser.email)
        .update({
          expensesAndIncome: newTasks
        })
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
      setType("");
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
        date: date,
        type: type
      }
    ];

    if (validate("Income", newTasks[newTasks.length - 1]) === 1) {
      revchrono(newTasks);
      db.collection("expenses-and-income")
        .doc(currentUser.email)
        .update({
          expensesAndIncome: newTasks
        })
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
    db.collection("expenses-and-income").doc(currentUser.email).update({
      expensesAndIncome: newTasks
    });
  }

  function handleEdit(type, event) {
    event.preventDefault();
    if (validate(type, edit) === 1) {
      const newTasks = [...tasks];
      newTasks[edit.id] = edit;
      revchrono(newTasks);
      db.collection("expenses-and-income").doc(currentUser.email).update({
        expensesAndIncome: newTasks
      });
      document.getElementById("form1").reset();
    } else {
      alert(validate(type, edit));
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
    <>
      <TopBar />
      <main>
        <div>
          <h2>Add {isExpense ? "Expense" : "Income"} </h2>
          {loading ? <h2> loading... </h2> : null}
          <br />
          <ExpenseIncomeToggle
            isExpense={isExpense}
            toggleExpenseIncome={toggleExpenseIncome}
          />

          {isExpense && (
            <ExpensesForm
              handleAddTask={handleAddExpense}
              setDate={setDate}
              setNewTaskText={setNewTaskText}
              setAmount={setAmount}
              setCat={setCat}
              setNeedWant={setNeedWant}
              setType={setType}
            />
          )}
          {!isExpense && (
            <IncomeForm
              handleAddTask={handleAddIncome}
              setDate={setDate}
              setNewTaskText={setNewTaskText}
              setAmount={setAmount}
              setCat={setCat}
              setType={setType}
            />
          )}
        </div>

        <div className="addMarg">
          <h2> Filter by </h2>
        </div>

        <div>
          <FilterForm
            handleIsNeedFilter={handleIsNeedFilter}
            handleCatFilter={handleCatFilter}
          />
        </div>
        <div>
          <div>
            <h2> My Expenses and Income Table </h2>
          </div>
          <ExpenseIncomeTable
            tasks={tasks}
            expFilter={expFilter}
            deleteItem={deleteItem}
            editItem={editItem}
          />
        </div>
        {edit.type === "Expense" && (
          <ExpenseEditModal
            modalOpen={modalOpen}
            toggleModal={toggleModal}
            handleEdit={handleEdit}
            edit={edit}
            setEdit={setEdit}
          />
        )}
        {edit.type === "Income" && (
          <IncomeEditModal
            modalOpen={modalOpen}
            toggleModal={toggleModal}
            handleEdit={handleEdit}
            edit={edit}
            setEdit={setEdit}
          />
        )}
      </main>
    </>
  );
}

export default TaskManager;

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import firebase from "../Firebase";
import { validate, revchrono } from "./Utilities";
import TopBar from "./TopBar";
import ExpenseIncomeForm from "./ExpenseIncomeFormsAndTables/ExpenseIncomeForm";
import ExpenseIncomeTable from "./ExpenseIncomeFormsAndTables/ExpenseIncomeTable";
import ExpenseIncomeEditModal from "./ExpenseIncomeFormsAndTables/ExpenseIncomeEditModal";
import ExpenseIncomeFilterForm from "./ExpenseIncomeFormsAndTables/ExpenseIncomeFilterForm";
import { Button } from "react-bootstrap";
import { Hints, Steps } from "intro.js-react";
import "intro.js/introjs.css";

function TaskManager() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);

  const [newTaskText, setNewTaskText] = useState("");
  const [isNeed, setNeedWant] = useState(null);
  const [amount, setAmount] = useState("");
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
    category: "default",
    type: "default",
    month: "default"
  });
  const [isExpense, toggleExpenseIncome] = useState(true);
  const [stepsEnabled, toggleStepsEnabled] = useState(false);
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
            .set({ expensesAndIncome: [], goal: 0 });
          setLoading(false);
        }
      });
  }

  useEffect(() => {
    getExpenses();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    document.body.style.backgroundImage = "url(resources/soft_wallpaper.png)";
  }, []);

  function handleAddExpense(event) {
    event.preventDefault();
    if (addExpense(newTaskText) !== false) {
      event.target.reset();
      setNewTaskText("");
      setNeedWant(null);
      setAmount("");
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
      alert(validate("Expense", newTasks[newTasks.length - 1]));
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

  const expFilter = (task) => {
    if (filters.isNeed !== "default" && filters.isNeed !== task.isNeed) {
      return false;
    }
    if (filters.category !== "default" && filters.category !== task.category) {
      return false;
    }
    if (filters.type !== "default" && filters.type !== task.type) {
      return false;
    }
    if (
      filters.month !== "default" &&
      filters.month !== task.date.slice(5, 7)
    ) {
      return false;
    }
    return true;
  };

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

  function handleTypeFilter(val) {
    let typeFilterValue = "default";
    if (val !== "Expense/Income") {
      typeFilterValue = val;
    }
    setFilters({
      isNeed: "default",
      category: "default",
      type: typeFilterValue,
      month: "default"
    });
  }

  function handleMonthFilter(e) {
    let monthFilterValue = "default";
    if (e.target.value !== "Month") {
      monthFilterValue = e.target.value;
    }
    setFilters({ ...filters, month: monthFilterValue });
  }
  const initialStep = 0;
  const steps = [
    {
      element: ".info",
      intro: "Choose between adding an expense or an income."
    },
    {
      element: ".step1",
      intro: "Fill in the transaction date."
    },
    {
      element: ".step2",
      intro: "Fill in the description."
    },
    {
      element: ".step3",
      intro: "Fill in the amount."
    },
    {
      element: ".step4",
      intro:
        "Select the Category. For expenses, it is necessary to classify it as a need or want."
    },
    {
      element: ".step5",
      intro: "Click to add it into the table."
    },
    {
      element: ".step6",
      intro:
        "You can view your entries in the table below (sorted in reverse chronological order). You also have the option of deleting and editing your entries."
    },
    {
      element: ".step7",
      intro: "Click to filter by expenses or income."
    },
    {
      element: ".step8",
      intro: "Filter by month, category or need/want using the drop down menu."
    }
  ];
  return (
    <>
      <Steps
        enabled={stepsEnabled}
        steps={steps}
        initialStep={initialStep}
        onExit={() => toggleStepsEnabled(false)}
      />
      <TopBar />
      <Button onClick={() => toggleStepsEnabled(true)}>
        Need a walkthrough?
      </Button>
      <main className="mt-5">
        <div>
          <h2 className="add">Add {isExpense ? "Expense" : "Income"} </h2>
          {loading ? <h2 className="add"> loading... </h2> : null}
          <br />
          <ExpenseIncomeForm
            toggleExpenseIncome={toggleExpenseIncome}
            handleAddExpense={handleAddExpense}
            handleAddIncome={handleAddIncome}
            setDate={setDate}
            setNewTaskText={setNewTaskText}
            setAmount={setAmount}
            setCat={setCat}
            setNeedWant={setNeedWant}
            setType={setType}
            isExpense={isExpense}
            amount={amount}
            category={category}
            newTaskText={newTaskText}
          />
        </div>
        <div className="addMarg">
          <h2 className="add"> Filter by </h2>
        </div>
        <div>
          <ExpenseIncomeFilterForm
            expenseIncome={filters.type}
            months={[...new Set(tasks.map((task) => task.date.slice(5, 7)))]}
            handleIsNeedFilter={handleIsNeedFilter}
            handleCatFilter={handleCatFilter}
            handleTypeFilter={handleTypeFilter}
            handleMonthFilter={handleMonthFilter}
          />
        </div>
        <div>
          <div>
            <h2 className="expenseHeadings"> My Expenses and Income Table </h2>
          </div>
          <div className="step6">
            <ExpenseIncomeTable
              tasks={tasks}
              expFilter={expFilter}
              deleteItem={deleteItem}
              editItem={editItem}
            />
          </div>
        </div>
        <ExpenseIncomeEditModal
          modalOpen={modalOpen}
          toggleModal={toggleModal}
          handleEdit={handleEdit}
          edit={edit}
          setEdit={setEdit}
        />
      </main>
    </>
  );
}

export default TaskManager;

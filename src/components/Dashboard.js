import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import firebase from "../Firebase";
import Visualisation from "./Visualisation";

function Dashboard() {
  const { currentUser } = useAuth();
  const db = firebase.firestore();
  const expensesDoc = db.collection("expenses").doc(currentUser.email);
  const [stats, setStats] = useState({
    totalAmount: null,
    wantAmount: null,
    needAmount: null
  });

  function getExpensesSummary() {
    //helper
    const amountAddFunc = (seed, currObj) =>
      Number(seed) + Number(currObj.amount);

    const totalAmount = (tasks) => tasks.reduce(amountAddFunc, 0).toFixed(2);

    const wantAmount = (tasks) =>
      tasks
        .filter((task) => !task.isNeed)
        .reduce(amountAddFunc, 0)
        .toFixed(2);

    const needAmount = (tasks) =>
      tasks
        .filter((task) => task.isNeed)
        .reduce(amountAddFunc, 0)
        .toFixed(2);

    const obj = expensesDoc.get().then((doc) => {
      if (doc.exists) {
        const arr = doc.data().Expenses;
        setStats({
          totalAmount: totalAmount(arr),
          wantAmount: wantAmount(arr),
          needAmount: needAmount(arr)
        });
      } else {
        return null;
      }
    });

    return obj;
  }

  useEffect(() => {
    getExpensesSummary();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div>
        <div className="splitExpense">
          <div>
            <h3 id="want">Want Expenses: ${stats.wantAmount}</h3>
            <h3 id="need">Need Expenses: ${stats.needAmount}</h3>
          </div>
          <div>
            <h3 className="addMarg" id="total">
              Total Expenses: ${stats.totalAmount}
            </h3>
          </div>
        </div>
        <div>
          <Visualisation stats={stats} />
        </div>
      </div>
    </>
  );
}

export default Dashboard;

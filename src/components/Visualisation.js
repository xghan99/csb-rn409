import { PieChart } from "react-minimal-pie-chart";
import React from "react";

function Visualisation(props) {
  var data = [];
  if (+props.stats.needExpense === 0 && +props.stats.wantExpense === 0) {
    return (
      <>
        <h1> You have no expenses! </h1>
        <a href="/expenses"> Add expenses here </a>
      </>
    );
  } else if (+props.stats.needExpense === 0 && +props.stats.wantExpense !== 0) {
    data = [
      { title: "Want", value: +props.stats.wantExpense, color: "#f50d00" }
    ];
  } else if (+props.stats.needExpense !== 0 && +props.stats.wantExpense === 0) {
    data = [
      { title: "Need", value: +props.stats.needExpense, color: "#277f00" }
    ];
  } else {
    data = [
      { title: "Want", value: +props.stats.wantExpense, color: "#f50d00" },
      { title: "Need", value: +props.stats.needExpense, color: "#277f00" }
    ];
  }
  return (
    <PieChart
      data={data}
      lineWidth={15}
      label={({ dataEntry }) => dataEntry.title}
      labelPosition={112}
      labelStyle={{ fontSize: "8px" }}
      style={{ height: "500px", paddingTop: "20px" }}
    />
  );
}

export default Visualisation;

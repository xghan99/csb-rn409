import { PieChart } from "react-minimal-pie-chart";
import React from "react";
import { Card } from "react-bootstrap";

function Visualisation(props) {
  var data = [];
  var hundred = true;
  if (+props.stats.needExpense === 0 && +props.stats.wantExpense === 0) {
    return (
      <>
        <Card.Body>
          <Card.Title>
            {" "}
            <div className="cardHeadings"> You have no expenses! </div>{" "}
          </Card.Title>
          <Card.Text>
            <a href="/expenses-income-tracking"> Add expenses here </a>
          </Card.Text>
        </Card.Body>
      </>
    );
  } else if (+props.stats.needExpense === 0 && +props.stats.wantExpense !== 0) {
    data = [
      { title: "Want", value: +props.stats.wantExpense, color: "#dc3545" }
    ];
    hundred = true;
  } else if (+props.stats.needExpense !== 0 && +props.stats.wantExpense === 0) {
    data = [
      { title: "Need", value: +props.stats.needExpense, color: "#28a745" }
    ];
    hundred = true;
  } else {
    data = [
      { title: "Want", value: +props.stats.wantExpense, color: "#dc3545" },
      { title: "Need", value: +props.stats.needExpense, color: "#28a745" }
    ];
    hundred = false;
  }
  return (
    <PieChart
      data={data}
      lineWidth={15}
      label={({ dataEntry }) => dataEntry.title}
      labelPosition={hundred ? 0 : 72}
      labelStyle={{ fontSize: "6px" }}
      style={{ height: "500px", padding: "30px" }}
      startAngle={90}
    />
  );
}

export default Visualisation;

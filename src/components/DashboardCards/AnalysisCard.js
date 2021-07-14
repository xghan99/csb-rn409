import React from "react";

import { Card, ListGroup } from "react-bootstrap";

export default function AnalysisCard(props) {
  return (
    <Card.Body>
      <Card.Title className="cardHeadings">
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0
            }}
          >
            <img
              variant="top"
              src="resources/dollarnote.png"
              height="30px"
              width="30px"
              alt=""
            />
          </div>
        </div>
        <div className="cardHeadings"> Analysis </div>
      </Card.Title>
      <Card.Text className="cardText">
        {" "}
        <ListGroup>
          <ListGroup.Item>
            <div>
              {" "}
              <b> Financial status: </b> {props.financialStatus}{" "}
            </div>
            <br />
            <div> {props.getRecMessage()} </div>
          </ListGroup.Item>
          <ListGroup.Item>
            {" "}
            <b>Max Daily Budget:</b> ${props.dailyBudget}{" "}
          </ListGroup.Item>
          <ListGroup.Item>
            <b> Average Daily Spending: </b> $ {props.dailyExpense}{" "}
          </ListGroup.Item>
        </ListGroup>
      </Card.Text>
    </Card.Body>
  );
}

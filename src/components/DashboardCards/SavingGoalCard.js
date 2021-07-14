import React from "react";

import { Card, Col, Form, Button } from "react-bootstrap";

export default function savingGoalCard(props) {
  return (
    <>
      <Card.Body>
        <Card.Title>
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
                src="resources/piggybank.png"
                height="30px"
                width="30px"
                alt=""
              />
            </div>
          </div>
          <div className="cardHeadings">Saving Goal</div>
        </Card.Title>
        <Card.Text className="cardText">
          <Form className="info" id="form1" onSubmit={props.handleSaving}>
            <Form.Row>
              <Form.Group as={Col} xs={12} md="auto">
                <Form.Control
                  type="number"
                  placeholder="Savings Goal"
                  onChange={(event) => props.setTempGoal(event.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} xs={12} md="auto">
                <Button type="submit">Set</Button>
              </Form.Group>
            </Form.Row>
          </Form>
          <br />
          <div className="text-center">
            {" "}
            <b>Current goal:</b> ${props.goal}{" "}
          </div>
        </Card.Text>
      </Card.Body>
    </>
  );
}

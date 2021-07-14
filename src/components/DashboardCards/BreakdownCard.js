import React from "react";

import { Card, Row, Col } from "react-bootstrap";

export default function BreakdownCard(props) {
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
                src="resources/piechart.png"
                height="30px"
                width="30px"
                alt=""
              />
            </div>
          </div>
          <div className="cardHeadings">Breakdown</div>
        </Card.Title>
        <div>
          <Row>
            <Col lg={6}>
              <Card className="m-1" border="danger" style={{ width: "13rem" }}>
                <Card.Body>
                  <Card.Title className="cardSubheading">
                    Want Expenses
                  </Card.Title>
                  <Card.Text className="cardText">
                    ${props.wantExpense}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="m-1" border="success">
                <Card.Body>
                  <Card.Title className="cardSubheading">
                    Need Expenses
                  </Card.Title>
                  <Card.Text className="cardText">
                    ${props.needExpense}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Card className="m-1" border="info">
                <Card.Body>
                  <Card.Title className="cardSubheading">
                    Total Expenses
                  </Card.Title>
                  <Card.Text className="cardText">
                    ${props.totalExpense}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Card.Body>
    </>
  );
}

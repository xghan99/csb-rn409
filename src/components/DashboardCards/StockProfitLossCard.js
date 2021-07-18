import React from "react";
import { Card, ListGroup, Row, Col } from "react-bootstrap";

export default function StockProfitLossCard(props) {
  if (Object.keys(props.stocksSummary).length === 0) {
    return (
      <Card.Body>
        <Card.Title className="cardHeadings"> You have no stocks!</Card.Title>
        <Card.Text>
          <a href="/investments"> Add investments here </a>
        </Card.Text>
      </Card.Body>
    );
  }
  return (
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
              src="resources/stonks.png"
              height="30px"
              width="30px"
              alt=""
            />
          </div>
        </div>
        <div className="cardHeadings">My Stocks</div>
      </Card.Title>
      <ListGroup>
        <ListGroup.Item>
          <Row>
            <Col className="cardText">
              <b>Net Profit and Loss:</b>
            </Col>
            <Col
              className="d-flex justify-content-end"
              style={{
                color:
                  Object.keys(props.stocksSummary).reduce(
                    (seed, next) => seed + +props.stocksSummary[next],
                    0
                  ) < 0
                    ? "red"
                    : "green"
              }}
            >
              $
              {Object.keys(props.stocksSummary)
                .reduce((seed, next) => seed + +props.stocksSummary[next], 0)
                .toFixed(2)}
            </Col>
          </Row>
        </ListGroup.Item>
        {Object.keys(props.stocksSummary).map((ticker) => (
          <ListGroup.Item>
            <Row>
              <Col className="d-flex justify-content-between">{ticker}:</Col>
              <Col
                className="d-flex justify-content-end"
                style={{
                  color: +props.stocksSummary[ticker] < 0 ? "red" : "green"
                }}
              >
                ${props.stocksSummary[ticker]}
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card.Body>
  );
}

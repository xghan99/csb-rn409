import { Card, ListGroup, Row, Col, Form } from "react-bootstrap";
import Plot from "react-plotly.js";

export default function OtherInvestmentCard(props) {
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
                AccordionCollapseProps
                src="resources/stonks.png"
                height="30px"
                width="30px"
                alt=""
              />
            </div>
          </div>
          <div className="cardHeadings">My Other Investments</div>
        </Card.Title>

        <Form>
          Choose investment
          <Form.Group controlId="formBasicSelect">
            <Form.Control
              as="select"
              placeholder="Choose"
              onChange={(e) => {
                props.setOther(e.target.value);
              }}
            >
              <option> </option>
              {Object.keys(props.otherSummary).map((name) => (
                <option value={name}>{name}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>

        {props.other ? (
          <>
            <ListGroup>
              <ListGroup.Item className="cardText">
                Current Value: ${props.otherSummary[props.other][0]}
              </ListGroup.Item>
              <ListGroup.Item className="cardText">
                5 Year Value: ${props.otherSummary[props.other][5]}
              </ListGroup.Item>
              <ListGroup.Item className="cardText">
                10 Year Value: ${props.otherSummary[props.other][10]}
              </ListGroup.Item>
              <ListGroup.Item className="cardText">
                30 Year Value: ${props.otherSummary[props.other][30]}
              </ListGroup.Item>
            </ListGroup>
          </>
        ) : (
          ""
        )}

        {props.other ? (
          <>
            <Plot
              data={[
                {
                  x: [...Array(31).keys()],
                  y: [...props.otherSummary[props.other]],
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: "green" }
                }
              ]}
              useResizeHandler={true}
              style={{ width: "100%", height: "100%" }}
            />
          </>
        ) : (
          ""
        )}
      </Card.Body>
    </>
  );
}

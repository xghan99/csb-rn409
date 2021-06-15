import { Form, Col, Button } from "react-bootstrap";

function IncomeForm(props) {
  return (
    <>
      <Form onSubmit={props.handleAddTask} className="info" id="form1">
        <Form.Row>
          <Form.Group as={Col} xs={12} md="auto">
            <Form.Control
              type="date"
              placeholder="Date"
              onInput={(event) => props.setDate(event.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} xs={12} md="auto">
            <Form.Control
              type="text"
              placeholder="Description"
              onChange={(event) => props.setNewTaskText(event.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} xs={12} md="auto">
            <Form.Control
              type="number"
              step="any"
              placeholder="Amount"
              onChange={(event) => props.setAmount(event.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} xs={12} md="auto">
            <Form.Control
              as="select"
              onChange={(e) => props.setCat(e.target.value)}
            >
              <option value="NIL">--Category--</option>
              <option value="Allowance">Allowance </option>
              <option value="Salary">Salary</option>
              <option value="Others">Others</option>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} xs={12} md="auto">
            <Button type="submit" onClick={(e) => props.setType("Income")}>
              Add
            </Button>
          </Form.Group>
        </Form.Row>
      </Form>
    </>
  );
}

export default IncomeForm;

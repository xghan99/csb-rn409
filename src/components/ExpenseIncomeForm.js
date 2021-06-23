import { Form, Col, Button, ButtonGroup, ToggleButton } from "react-bootstrap";

export default function ExpenseIncomeForm(props) {
  const type = props.isExpense ? "Expense" : "Income";
  const handleFunc = props.isExpense
    ? props.handleAddExpense
    : props.handleAddIncome;

  function expenseIncomeToggle() {
    return (
      <>
        <Form className="info">
          <ButtonGroup toggle>
            <ToggleButton
              type="radio"
              checked={props.isExpense}
              onChange={(e) => props.toggleExpenseIncome(true)}
            >
              Expense
            </ToggleButton>
            <ToggleButton
              type="radio"
              checked={!props.isExpense}
              onChange={(e) => props.toggleExpenseIncome(false)}
            >
              Income
            </ToggleButton>
          </ButtonGroup>
        </Form>
      </>
    );
  }

  function commonFormGroups() {
    return (
      <>
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
      </>
    );
  }

  function expenseFormGroups() {
    return (
      <>
        <Form.Group as={Col} xs={12} md="auto">
          <Form.Control
            as="select"
            onChange={(e) => props.setCat(e.target.value)}
          >
            <option value="">--Category--</option>
            <option value="Food & Drink">Food & Drinks </option>
            <option value="Entertainment">Entertainment</option>
            <option value="Others">Others</option>
          </Form.Control>
        </Form.Group>
        <Form.Group as={Col} xs={6} md="auto">
          <Form.Check
            type="radio"
            label="Need"
            style={{ color: "green" }}
            onInput={(event) => props.setNeedWant(true)}
            name="need-want"
            className="mt-2"
          />
        </Form.Group>
        <Form.Group as={Col} xs={6} md="auto">
          <Form.Check
            type="radio"
            label="Want"
            id="formHorizontalRadios4"
            style={{ color: "red" }}
            onInput={(event) => props.setNeedWant(false)}
            name="need-want"
            className="mt-2"
          />
        </Form.Group>
      </>
    );
  }

  function incomeFormGroups() {
    return (
      <>
        <Form.Group as={Col} xs={12} md="auto">
          <Form.Control
            as="select"
            onChange={(e) => props.setCat(e.target.value)}
          >
            <option value="">--Category--</option>
            <option value="Allowance">Allowance </option>
            <option value="Salary">Salary</option>
            <option value="Others">Others</option>
          </Form.Control>
        </Form.Group>
      </>
    );
  }

  return (
    <>
      {expenseIncomeToggle()}
      <Form onSubmit={handleFunc} className="info" id="form1">
        <Form.Row>
          {commonFormGroups()}
          {type === "Income" && incomeFormGroups()}
          {type === "Expense" && expenseFormGroups()}
          <Form.Group as={Col} xs={12} md="auto">
            <Button type="submit" onClick={(e) => props.setType(type)}>
              Add
            </Button>
          </Form.Group>
        </Form.Row>
      </Form>
    </>
  );
}

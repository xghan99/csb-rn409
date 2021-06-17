import {
  Form,
  Col,
  ButtonGroup,
  ToggleButton,
  Container
} from "react-bootstrap";

export default function ExpenseIncomeFilterForm(props) {
  function toggleButton() {
    return (
      <ButtonGroup toggle className="mb-2">
        <ToggleButton
          type="radio"
          checked={props.expenseIncome === "default"}
          onChange={(e) => props.handleTypeFilter("Expense/Income")}
        >
          All
        </ToggleButton>
        <ToggleButton
          type="radio"
          checked={props.expenseIncome === "Expense"}
          onChange={(e) => props.handleTypeFilter("Expense")}
        >
          Expense
        </ToggleButton>
        <ToggleButton
          type="radio"
          checked={props.expenseIncome === "Income"}
          onChange={(e) => props.handleTypeFilter("Income")}
        >
          Income
        </ToggleButton>
      </ButtonGroup>
    );
  }

  function expenseIncomeFilters() {
    return (
      <Form className="info">
        <Form.Row>
          <Form.Group as={Col} xs={12} md="auto">
            <Form.Control
              as="select"
              onChange={(e) => props.handleMonthFilter(e)}
            >
              <option> Month </option>
              {props.months.map((month) => (
                <option> {month} </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form.Row>
      </Form>
    );
  }

  function incomeFilters() {
    return (
      <Form className="info">
        <Form.Row>
          <Form.Group as={Col} xs={12} md="auto">
            <Form.Control
              as="select"
              onChange={(e) => props.handleMonthFilter(e)}
            >
              <option> Month </option>
              {props.months.map((month) => (
                <option> {month} </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} xs={12} md="auto">
            <Form.Control
              as="select"
              onChange={(e) => props.handleCatFilter(e)}
            >
              <option> Category </option>
              <option> Allowance </option>
              <option> Salary </option>
              <option> Others </option>
            </Form.Control>
          </Form.Group>
        </Form.Row>
      </Form>
    );
  }

  function expenseFilters() {
    return (
      <Form className="info">
        <Form.Row>
          <Form.Group as={Col} xs={12} md="auto">
            <Form.Control
              as="select"
              onChange={(e) => props.handleMonthFilter(e)}
            >
              <option> Month </option>
              {props.months.map((month) => (
                <option> {month} </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} xs={12} md="auto">
            <Form.Control
              as="select"
              onChange={(e) => props.handleIsNeedFilter(e)}
            >
              <option> Need/Want </option>
              <option> Need </option>
              <option> Want </option>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} xs={12} md="auto">
            <Form.Control
              as="select"
              onChange={(e) => props.handleCatFilter(e)}
            >
              <option> Category </option>
              <option> Food & Drink </option>
              <option> Entertainment </option>
              <option> Others </option>
            </Form.Control>
          </Form.Group>
        </Form.Row>
      </Form>
    );
  }

  return (
    <>
      <Container>
        {toggleButton()}
        <div>
          {props.expenseIncome === "default" && expenseIncomeFilters()}
          {props.expenseIncome === "Expense" && expenseFilters()}
          {props.expenseIncome === "Income" && incomeFilters()}
        </div>
      </Container>
    </>
  );
}

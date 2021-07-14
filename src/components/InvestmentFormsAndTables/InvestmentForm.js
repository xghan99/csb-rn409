import { Form, Col, Button } from "react-bootstrap";

export default function InvestmentForm(props) {
  return (
    <>
      <Form
        onSubmit={(e) => props.handleAddStock(e)}
        className="info"
        id="form1"
      >
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
            placeholder="Stock Ticker"
            onChange={(event) => props.setTicker(event.target.value)}
          />
        </Form.Group>
        <Form.Group as={Col} xs={12} md="auto">
          <Form.Control
            type="number"
            step="any"
            placeholder="Units"
            onChange={(event) => props.setUnits(event.target.value)}
          />
        </Form.Group>
        <Form.Group as={Col} xs={12} md="auto">
          <Form.Control
            type="number"
            step="any"
            placeholder="Cost Price"
            onChange={(event) => props.setCostPrice(event.target.value)}
          />
        </Form.Group>
        <Form.Group as={Col} xs={12} md="auto">
          <Button type="submit">Add</Button>
        </Form.Group>
      </Form>
    </>
  );
}

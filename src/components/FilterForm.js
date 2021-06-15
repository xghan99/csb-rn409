import { Form, Col } from "react-bootstrap";

export default function FilterForm(props) {
  return (
    <Form className="info">
      <Form.Row>
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
          <Form.Control as="select" onChange={(e) => props.handleCatFilter(e)}>
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

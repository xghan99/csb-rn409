import { Form, Col, Button, ButtonGroup, ToggleButton } from "react-bootstrap";

export default function InvestmentForm(props) {
  const type = props.isTicker ? "Ticker" : "Other";
  const handleFunc = props.isTicker
    ? props.handleAddStock
    : props.handleAddOther;

  function tickerOtherToggle() {
    return (
      <>
        <Form className="info">
          <ButtonGroup toggle>
            <ToggleButton
              type="radio"
              checked={props.isTicker}
              onChange={(e) => props.toggleTickerOther(true)}
            >
              Ticker
            </ToggleButton>
            <ToggleButton
              type="radio"
              checked={!props.isTicker}
              onChange={(e) => props.toggleTickerOther(false)}
            >
              Other
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
            value={props.date}
            onInput={(event) => props.setDate(event.target.value)}
          />
        </Form.Group>
        <Form.Group as={Col} xs={12} md="auto">
          <Form.Control
            type="text"
            value={props.ticker}
            placeholder={type === "Ticker" ? "Ticker" : "Description"}
            onChange={(event) => props.setTicker(event.target.value)}
          />
        </Form.Group>
        <Form.Group as={Col} xs={12} md="auto">
          <Form.Control
            type="number"
            step="any"
            placeholder="Units"
            value={props.units}
            onChange={(event) => {
              props.setUnits(event.target.value);
              console.log(event.target.value);
            }}
          />
        </Form.Group>
        <Form.Group as={Col} xs={12} md="auto">
          <Form.Control
            type="number"
            step="any"
            placeholder="Cost Price Per Unit"
            value={props.costPrice}
            onChange={(event) => props.setCostPrice(event.target.value)}
          />
        </Form.Group>
      </>
    );
  }

  function otherFormGroups() {
    return (
      <>
        <Form.Group as={Col} xs={12} md="auto">
          <Form.Control
            type="number"
            step="any"
            placeholder="Expected Rate of Return"
            value={props.rate}
            onChange={(event) => props.setRate(event.target.value)}
          />
        </Form.Group>
      </>
    );
  }
  return (
    <>
      {tickerOtherToggle()}
      <Form onSubmit={handleFunc} className="info" id="form1">
        <Form.Row>
          {commonFormGroups()}

          {type === "Other" && otherFormGroups()}
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

import { Modal, Form, Button } from "react-bootstrap";

export default function InvestmentModal(props) {
  function commonFormGroups() {
    return (
      <>
        <Form.Group>
          <Form.Label> Date </Form.Label>
          <Form.Control
            type="date"
            defaultValue={props.edit.date}
            value={props.edit.date}
            onChange={(event) =>
              props.setEdit({
                ...props.edit,
                date: event.target.value
              })
            }
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>
            {" "}
            {props.edit.type === "Ticker" ? "Ticker" : "Description"}{" "}
          </Form.Label>
          <Form.Control
            type="text"
            defaultValue={props.edit.ticker}
            value={props.edit.ticker}
            onChange={(event) =>
              props.setEdit({
                ...props.edit,
                ticker: event.target.value
              })
            }
          />
          <br />
        </Form.Group>
        <Form.Group>
          <Form.Label> Units </Form.Label>
          <Form.Control
            type="number"
            defaultValue={props.edit.units}
            value={props.edit.units}
            onChange={(event) =>
              props.setEdit({
                ...props.edit,
                units: event.target.value
              })
            }
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label> Cost Price </Form.Label>
          <Form.Control
            type="number"
            defaultValue={props.edit.costPrice}
            value={props.edit.costPrice}
            onChange={(event) =>
              props.setEdit({
                ...props.edit,
                costPrice: event.target.value
              })
            }
          />
        </Form.Group>
      </>
    );
  }

  function otherFormGroups() {
    return (
      <>
        <Form.Group>
          <Form.Label> Rate of Return </Form.Label>
          <Form.Control
            type="number"
            defaultValue={props.edit.rate}
            value={props.edit.rate}
            onChange={(event) =>
              props.setEdit({
                ...props.edit,
                rate: event.target.value
              })
            }
          />
        </Form.Group>
      </>
    );
  }

  return (
    <Modal
      show={props.modalOpen}
      onHide={() => props.toggleModal(!props.modalOpen)}
    >
      <Modal.Header closeButton>Edit</Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => props.handleEdit(props.edit.type, e)} id="edit">
          {commonFormGroups()}
          {props.edit.type === "Other" && otherFormGroups()}
          <Button
            variant="primary"
            type="submit"
            onClick={() => props.toggleModal(false)}
          >
            Save changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

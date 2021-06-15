import { Modal, Form, Button } from "react-bootstrap";

export default function IncomeEditModal(props) {
  return (
    <Modal
      show={props.modalOpen}
      onHide={() => props.toggleModal(!props.modalOpen)}
    >
      <Modal.Header closeButton>Edit</Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => props.handleEdit("Income", e)} id="edit">
          <Form.Group>
            <Form.Label> Date </Form.Label>
            <Form.Control
              type="date"
              defaultValue={props.edit.date}
              onChange={(event) =>
                props.setEdit({ ...props.edit, date: event.target.value })
              }
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label> Amount </Form.Label>
            <Form.Control
              type="number"
              defaultValue={props.edit.amount}
              onChange={(event) =>
                props.setEdit({ ...props.edit, amount: event.target.value })
              }
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label> Category </Form.Label>
            <Form.Control
              as="select"
              defaultValue={props.edit.category}
              onChange={(event) =>
                props.setEdit({ ...props.edit, category: event.target.value })
              }
            >
              <option> Allowance </option>
              <option> Salary </option>
              <option> Others </option>
            </Form.Control>
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label> Description </Form.Label>
            <Form.Control
              type="text"
              defaultValue={props.edit.description}
              onChange={(event) =>
                props.setEdit({
                  ...props.edit,
                  description: event.target.value
                })
              }
            />
          </Form.Group>
          <br />
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

export default function ExpenseEditModal() {
  return (
    <Modal show={modalOpen} onHide={() => toggleModal(!modalOpen)}>
      <Modal.Header closeButton>Edit</Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => handleEdit(e)} id="edit">
          <Form.Group>
            <Form.Label> Date </Form.Label>
            <Form.Control
              type="date"
              defaultValue={edit.date}
              onChange={(event) =>
                setEdit({ ...edit, date: event.target.value })
              }
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label> Amount </Form.Label>
            <Form.Control
              type="number"
              defaultValue={edit.amount}
              onChange={(event) =>
                setEdit({ ...edit, amount: event.target.value })
              }
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label> Category </Form.Label>
            <Form.Control
              as="select"
              defaultValue={edit.category}
              onChange={(event) =>
                setEdit({ ...edit, category: event.target.value })
              }
            >
              <option> Food & Drink </option>
              <option> Entertainment </option>
              <option> Others </option>
            </Form.Control>
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label> Description </Form.Label>
            <Form.Control
              type="text"
              defaultValue={edit.description}
              onChange={(event) =>
                setEdit({ ...edit, description: event.target.value })
              }
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Check
              type="radio"
              label="Need"
              name="formHorizontolRadios"
              id="formHorizontalRadios1"
              defaultChecked={edit.isNeed}
              onChange={(event) => setEdit({ ...edit, isNeed: true })}
            />
            <Form.Check
              type="radio"
              label="Want"
              name="formHorizontolRadios"
              id="formHorizontalRadios2"
              defaultChecked={!edit.isNeed}
              onChange={(event) => setEdit({ ...edit, isNeed: false })}
            />
          </Form.Group>
          <br />
          <Button
            variant="primary"
            type="submit"
            onClick={() => toggleModal(false)}
          >
            Save changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

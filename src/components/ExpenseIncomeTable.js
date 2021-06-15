import { Table } from "react-bootstrap";

export default function ExpenseIncomeTable(props) {
  return (
    <Table
      responsive
      style={{ margin: "0 auto", width: "100%" }}
      className="addMarg"
    >
      <thead>
        <tr>
          <th>No.</th>
          <th>Date</th>
          <th>Type</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Need/Want</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        {props.tasks.filter(props.expFilter).map((task, index) => (
          <tr key={task.id}>
            <td>{index + 1}</td>
            <td>{task.date}</td>
            <td>{task.type}</td>
            <td>{task.description}</td>
            <td style={{ color: task.type === "Expense" ? "red" : "green" }}>
              ${task.amount}
            </td>
            <td>{task.isNeed === "-" ? "-" : task.isNeed ? "Need" : "Want"}</td>
            <td>{task.category}</td>
            <td>
              <button onClick={() => props.deleteItem(index)}>Delete</button>
            </td>
            <td>
              <button onClick={() => props.editItem(index)}>Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

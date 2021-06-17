import { Button, Table } from "react-bootstrap";

export default function ExpenseIncomeTable(props) {
  return (
    <Table
      responsive
      style={{ margin: "0 auto", width: "100%" }}
      className="addMarg"
    >
      <thead>
        <tr>
          <th className="tableHeadings">Date</th>
          <th className="tableHeadings">Type</th>
          <th className="tableHeadings">Description</th>
          <th className="tableHeadings">Amount</th>
          <th className="tableHeadings">Need/Want</th>
          <th className="tableHeadings">Category</th>
        </tr>
      </thead>
      <tbody>
        {props.tasks.filter(props.expFilter).map((task, index) => (
          <tr key={task.id}>
            <td className="tableValues">{task.date}</td>
            <td className="tableValues">{task.type}</td>
            <td className="tableValues">{task.description}</td>
            <td
              className="tableValues"
              style={{ color: task.type === "Expense" ? "red" : "green" }}
            >
              ${task.amount}
            </td>
            <td className="tableValues">
              {task.isNeed === "-" ? "-" : task.isNeed ? "Need" : "Want"}
            </td>
            <td className="tableValues">{task.category}</td>
            <td>
              <Button onClick={() => props.deleteItem(index)}>Delete</Button>
            </td>
            <td>
              <Button onClick={() => props.editItem(index)}>Edit</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

import { Table, Button } from "react-bootstrap";

export default function InvestmentTable(props) {
  return (
    <>
      <Table
        responsive
        style={{ margin: "0 auto", width: "100%" }}
        className="addMarg"
      >
        <thead>
          <tr>
            <th className="tableHeadings">Date</th>
            <th className="tableHeadings">Ticker</th>
            <th className="tableHeadings">Units</th>
            <th className="tableHeadings">Cost Price</th>
            <th className="tableHeadings">Current Price</th>
            <th>
              <Button onClick={() => props.handleRefresh()}>Refresh</Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {props.arr.map((task, index) => (
            <tr key={task.id}>
              <td className="tableValues">{task.date}</td>
              <td className="tableValues">{task.ticker}</td>
              <td className="tableValues">{task.units}</td>
              <td className="tableValues">{task.costPrice}</td>
              <td className="tableValues">
                {props.storedPrices[task.ticker]
                  ? props.storedPrices[task.ticker]["price"]
                  : ""}
              </td>

              <td>
                <Button onClick={() => props.deleteItem(task.id)}>
                  Delete
                </Button>
              </td>
              <td>
                <Button onClick={() => props.editItem(task.id)}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

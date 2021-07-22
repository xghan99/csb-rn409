import { Table, Button } from "react-bootstrap";
import { differenceInDays } from "../Utilities";

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
            <th className="tableHeadings">Ticker/Description</th>
            <th className="tableHeadings">Units</th>
            <th className="tableHeadings">Cost Price Per Unit</th>
            <th className="tableHeadings">Current Price Per Unit</th>
            <th className="tableHeadings">
              Expected Rate of Return (Per Annum)
            </th>
          </tr>
        </thead>
        <tbody>
          {props.arr.map((task, index) => (
            <tr key={task.id}>
              <td className="tableValues">{task.date}</td>
              <td className="tableValues">{task.ticker}</td>
              <td className="tableValues">{task.units}</td>
              <td className="tableValues">
                {Number(task.costPrice).toFixed(2)}
              </td>
              <td className="tableValues">
                {task.type === "Ticker"
                  ? props.storedPrices[task.ticker]
                    ? props.storedPrices[task.ticker]["price"]
                    : ""
                  : (
                      task.units *
                      task.costPrice *
                      Math.pow(
                        1 + task.rate / 100 / 365,
                        differenceInDays(task.date)
                      )
                    ).toFixed(2)}
              </td>
              <td className="tableValues">
                {task.rate ? `${task.rate}%` : "-"}
              </td>

              <td className="step7">
                <Button
                  onClick={() => props.deleteItem(task.id)}
                  className="step7"
                >
                  Delete
                </Button>
              </td>
              <td className="step8">
                <Button onClick={() => props.editItem(task.id)}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

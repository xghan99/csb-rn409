import React from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";

function ExpenseIncomeToggle(props) {
  return (
    <>
      <ButtonGroup toggle className="mb-2">
        <ToggleButton
          type="radio"
          checked={props.isExpense}
          onChange={(e) => props.toggleExpenseIncome(true)}
        >
          Expense
        </ToggleButton>
        <ToggleButton
          type="radio"
          checked={!props.isExpense}
          onChange={(e) => props.toggleExpenseIncome(false)}
        >
          Income
        </ToggleButton>
      </ButtonGroup>
    </>
  );
}

export default ExpenseIncomeToggle;

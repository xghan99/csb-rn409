function validate(type, obj) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  var todayDate = yyyy + "-" + mm + "-" + dd;
  if (obj.amount && +obj.amount <= 0) {
    return "Amount cannot be negative!";
  } else if (obj.description && obj.description == +obj.description) {
    return "Please ensure that Description does not purely contain numbers!";
  } else if (obj.date > todayDate) {
    return "Please ensure that selected date is today or earlier!";
  } else if (
    type === "Expense" &&
    obj.description &&
    obj.isNeed != null &&
    obj.amount &&
    obj.category &&
    obj.date
  ) {
    return 1;
  } else if (
    type === "Income" &&
    obj.description &&
    obj.amount &&
    obj.category &&
    obj.date
  ) {
    return 1;
  } else {
    return "Please ensure all fields are filled!";
  }
}

function revchrono(expenses) {
  expenses.sort(function (a, b) {
    if (a.date > b.date) {
      return -1;
    }
    if (a.date < b.date) {
      return 1;
    }
    return 0;
  });
  var id = 0;
  expenses.map((obj) => (obj.id = id++));
}

function daystillend() {
  var newDate1 = new Date();
  var newDate2 = new Date(newDate1.getTime());

  newDate2.setMonth(newDate1.getMonth() + 1);
  newDate2.setDate(0);

  var days = newDate2.getDate() - newDate1.getDate();
  return days;
}

export { validate, revchrono, daystillend };

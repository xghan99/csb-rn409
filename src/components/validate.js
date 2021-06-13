function validate(obj) {
  if (obj.amount <= 0) {
    return "Amount cannot be negative!";
  } else if (obj.description == +obj.description) {
    return "Please ensure that Description does not purely contain numbers!";
  } else if (
    obj.description &&
    obj.isNeed != null &&
    obj.amount &&
    obj.category
  ) {
    return 1;
  } else {
    return "Please ensure all fields are filled!";
  }
}

export default validate;

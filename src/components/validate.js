function validate(obj) {
  if (obj.description && obj.isNeed && obj.amount && obj.category) {
    return true;
  } else {
    return false;
  }
}

export default validate;

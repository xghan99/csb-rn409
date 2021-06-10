function validate(obj) {
  if (obj.description && obj.isNeed != null && obj.amount && obj.category) {
    return true;
  } else {
    return false;
  }
}

export default validate;

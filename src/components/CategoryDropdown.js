import React from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";

class CategoryDropdown extends React.Component {
  constructor() {
    super();
    this.state = { category: "Category" };
  }

  handleInputChange(e) {
    //const lst = ["Food & Drinks", "Entertainment", "Others"];
    //if (!(e in lst)) { return }
    this.setState({ category: e });
  }

  render() {
    return (
      <DropdownButton
        alignRight
        title={this.state.category}
        id="dropdown-menu-align-right"
        onSelect={(e) => this.handleInputChange(e)}
      >
        <Dropdown.Item eventKey="Food & Drinks">Food & Drinks</Dropdown.Item>
        <Dropdown.Item eventKey="Entertainment">Entertainment</Dropdown.Item>
        <Dropdown.Item eventKey="Others">Others</Dropdown.Item>
      </DropdownButton>
    );
  }
}

export default CategoryDropdown;

import { Nav, Navbar } from "react-bootstrap";
import { Fragment, Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default class TopBar extends Component {
  render() {
    return (
      <Fragment>
        <Navbar className="color-nav" expand="lg">
          <Navbar.Brand href="#home">
            <img
              alt="h"
              width="60"
              height="60"
              src="resources/pig.png"
              className="d-inline-block-align-top"
            />{" "}
            Goalie
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#home">My Dashboard</Nav.Link>
              <Nav.Link href="#link">Expenses Tracking</Nav.Link>
              <Nav.Link href="#link">My Investments</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Fragment>
    );
  }
}

import { Nav, Navbar, Alert } from "react-bootstrap";
import { Fragment, useState } from "react";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../contexts/AuthContext";

function TopBar() {
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState("");
  const history = useHistory();

  async function handleLogout() {
    console.log("Logging out");

    try {
      await logout();
      history.push("/login");
    } catch {
      console.log("Failed to log out");
    }
  }

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
          Welcome back,{" "}
          {currentUser.email.slice(0, currentUser.email.indexOf("@"))}!
          {error && <Alert variant="danger">{error}</Alert>}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">My Dashboard</Nav.Link>
            <Nav.Link href="/">Expenses Tracking</Nav.Link>
            <Nav.Link href="/">My Investments</Nav.Link>
            <Nav.Link href="#" onClick={handleLogout}>
              Log out
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Fragment>
  );
}
export default TopBar;

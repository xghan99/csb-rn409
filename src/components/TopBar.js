import { Nav, Navbar } from "react-bootstrap";
import { Fragment } from "react";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../contexts/AuthContext";

function TopBar() {
  const { currentUser, logout } = useAuth();
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
      <Navbar bg="light" expand="lg" fixed="top">
        <Navbar.Brand href="#home" className="welcomeMsg">
          <img
            alt="h"
            width="60"
            height="60"
            src="resources/pig.png"
            className="d-inline-block-align-top"
          />{" "}
          Welcome back,{" "}
          {currentUser
            ? currentUser.email.slice(0, currentUser.email.indexOf("@"))
            : ""}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link className="landingMenu" href="/dashboard">
              Dashboard
            </Nav.Link>
            <Nav.Link className="landingMenu" href="/expenses-income-tracking">
              Income & Expenditure
            </Nav.Link>
            <Nav.Link className="landingMenu" href="/investments">
              Investments
            </Nav.Link>
            <Nav.Link className="landingMenu" href="#" onClick={handleLogout}>
              Log out
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="mt-5">Hello</div>
    </Fragment>
  );
}
export default TopBar;

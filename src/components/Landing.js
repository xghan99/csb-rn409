import { Navbar, Container, Jumbotron, Button } from "react-bootstrap";

export default function Landing() {
  return (
    <>
      <Navbar bg="light" sticky="top">
        <Navbar.Brand>
          <img alt="" width="60" height="60" src="resources/pig.png" /> Goalie
        </Navbar.Brand>
      </Navbar>
      <br />
      <div>
        <Container>
          <Jumbotron className="mt-auto body">
            <h1> Hello World! </h1>
            <p>Ever wondered why it is so difficult to save money?</p>
            <p>
              <Button variant="primary" href="/signup">
                {" "}
                Sign up for a free acount{" "}
              </Button>
            </p>
          </Jumbotron>
          <Jumbotron>
            <h1> Hello World! </h1>
            <p> Lorem ipsum </p>
          </Jumbotron>
        </Container>
      </div>
    </>
  );
}

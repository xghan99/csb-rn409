import {
  Nav,
  Navbar,
  Container,
  Button,
  Card,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Carousel
} from "react-bootstrap";

import { useState } from "react";

export default function Landing() {
  const [index, setIndex] = useState(0);
  const handleSelectCarousel = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  const handleClickList = (idx) => {
    setIndex(idx);
  };

  function top() {
    return (
      <>
        <Row>
          <Col className="justify-content-center">
            <Card className="mt-5">
              <Card.Body>
                <Card.Title>
                  {" "}
                  Find it difficult to manage your finances as a student?{" "}
                </Card.Title>
                <p>Goalie is your solution.</p>
                <p>
                  <Button variant="primary" href="/signup">
                    {" "}
                    Sign up for a free acount{" "}
                  </Button>
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col className="d-none d-lg-block">
            <div className="poor"></div>
          </Col>
        </Row>
        <br />
      </>
    );
  }

  function mid() {
    return (
      <>
        <Row>
          <Col lg={3}>
            <Card>
              <Card.Body>
                <Card.Title>
                  <p>How Goalie works</p>
                </Card.Title>
                <ListGroup className="list-group-flush">
                  <ListGroupItem
                    action
                    variant="light"
                    onClick={(e) => handleClickList(0)}
                  >
                    Set a savings goal for the month
                  </ListGroupItem>
                  <ListGroupItem
                    action
                    variant="light"
                    onClick={(e) => handleClickList(1)}
                  >
                    Keep track of your income and expenses throughout the month
                  </ListGroupItem>
                  <ListGroupItem
                    action
                    variant="light"
                    onClick={(e) => handleClickList(2)}
                  >
                    Keep track of your investments
                  </ListGroupItem>
                  <ListGroupItem
                    action
                    variant="light"
                    onClick={(e) => handleClickList(3)}
                  >
                    Goalie will help you achieve your savings goals
                  </ListGroupItem>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={7}>{carousel()}</Col>
        </Row>
      </>
    );
  }

  function carousel() {
    return (
      <>
        <Carousel activeIndex={index} onSelect={handleSelectCarousel}>
          <Carousel.Item>
            <img src="resources/pig.png" alt="first" />
            <Carousel.Caption>
              <h3>Set a savings goal for the month</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src="resources/pig.png" alt="second" />
            <Carousel.Caption>
              <h3>
                Keep track of your income and expenses throughout the month
              </h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src="resources/pig.png" alt="third" />
            <Carousel.Caption>
              <h3>Keep track of your investments</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src="resources/pig.png" alt="fourth" />
            <Carousel.Caption>
              <h3>Goalie will help you achieve your savings goals</h3>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </>
    );
  }

  return (
    <>
      <Navbar bg="light" fixed="top">
        <Navbar.Brand className="pageName">
          <img alt="" width="60" height="60" src="resources/pig.png" /> Goalie
        </Navbar.Brand>
        <Nav className="justify-content-end">
          <Nav.Link href="/login" className="landingMenu">
            Log in
          </Nav.Link>
          <Nav.Link href="/signup" className="landingMenu">
            Sign up
          </Nav.Link>
        </Nav>
      </Navbar>
      <br />
      <div>
        <div>Hello</div>
        <Container className="mt-5">
          {top()}
          {mid()}
          <div className="rich d-none d-lg-block"></div>
        </Container>
      </div>
    </>
  );
}

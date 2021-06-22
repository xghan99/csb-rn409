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
          <Col lg={4}>
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
          <Col lg={7} className="ml-auto mt-5 mt-md-1">
            {carousel()}
          </Col>
        </Row>
      </>
    );
  }

  function carousel() {
    return (
      <>
        <Carousel activeIndex={index} onSelect={handleSelectCarousel}>
          <Carousel.Item>
            <div className="text-center">
              <img
                src="resources/1.png"
                alt="first"
                height="300"
                width="500"
                className="landingImage img-fluid"
              />
              <Carousel.Caption></Carousel.Caption>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="text-center">
              <img
                src="resources/2.png"
                alt="second"
                height="300"
                width="500"
                className="landingImage img-fluid"
              />
              <Carousel.Caption></Carousel.Caption>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="text-center">
              <img
                src="resources/pig.png"
                alt="third"
                height="300"
                className="landingImage"
              />
              <Carousel.Caption>
                <h3
                  style={{
                    color: "black",
                    position: "relative",
                    top: "-90px",
                    left: "182px",
                    paddingRight: "350px"
                  }}
                >
                  Stay Tuned!
                </h3>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="text-center">
              <img
                src="resources/4.png"
                alt="fourth"
                height="300"
                width="500"
                className="landingImage img-fluid"
              />
            </div>
            <Carousel.Caption></Carousel.Caption>
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

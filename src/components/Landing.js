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
                    Sign up for an account
                  </ListGroupItem>
                  <ListGroupItem
                    action
                    variant="light"
                    onClick={(e) => handleClickList(1)}
                  >
                    Set a savings goal for the month
                  </ListGroupItem>
                  <ListGroupItem
                    action
                    variant="light"
                    onClick={(e) => handleClickList(2)}
                  >
                    Keep track of your income and expenses throughout the month
                  </ListGroupItem>
                  <ListGroupItem
                    action
                    variant="light"
                    onClick={(e) => handleClickList(3)}
                  >
                    Delete or edit your income and expenses as you wish
                  </ListGroupItem>
                  <ListGroupItem
                    action
                    variant="light"
                    onClick={(e) => handleClickList(4)}
                  >
                    Keep track of your stock tickers
                  </ListGroupItem>
                  <ListGroupItem
                    action
                    variant="light"
                    onClick={(e) => handleClickList(5)}
                  >
                    Project your returns with Goalie
                  </ListGroupItem>
                  <ListGroupItem
                    action
                    variant="light"
                    onClick={(e) => handleClickList(6)}
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
        <Carousel
          activeIndex={index}
          onSelect={handleSelectCarousel}
          interval={null}
        >
          <Carousel.Item>
            <div className="text-center">
              <div class="embed-responsive embed-responsive-16by9">
                <iframe
                  title="Sign up"
                  class="embed-responsive-item"
                  src="https://www.youtube.com/embed/XUPNtcKvU9I?start=0&end=13;color=ffffff"
                  allowFullScreen="allowFullScreen"
                ></iframe>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="text-center">
              <div class="embed-responsive embed-responsive-16by9">
                <iframe
                  title="Save"
                  class="embed-responsive-item"
                  src="https://www.youtube.com/embed/XUPNtcKvU9I?start=14&end=19;color=ffffff"
                  allowFullScreen="allowFullScreen"
                ></iframe>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="text-center">
              <div class="embed-responsive embed-responsive-16by9">
                <iframe
                  title="Add"
                  class="embed-responsive-item"
                  src="https://www.youtube.com/embed/XUPNtcKvU9I?start=20&end=99;color=ffffff"
                  allowFullScreen="allowFullScreen"
                ></iframe>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="text-center">
              <div class="embed-responsive embed-responsive-16by9">
                <iframe
                  title="Delete Edit"
                  class="embed-responsive-item"
                  src="https://www.youtube.com/embed/XUPNtcKvU9I?start=99&end=111;color=ffffff"
                  allowFullScreen="allowFullScreen"
                ></iframe>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="text-center">
              <div class="embed-responsive embed-responsive-16by9">
                <iframe
                  title="dashboard"
                  class="embed-responsive-item"
                  src="https://www.youtube.com/embed/XUPNtcKvU9I?start=111&end=147;color=ffffff"
                  allowFullScreen="allowFullScreen"
                ></iframe>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="text-center">
              <div class="embed-responsive embed-responsive-16by9">
                <iframe
                  title="dashboard"
                  class="embed-responsive-item"
                  src="https://www.youtube.com/embed/AyyKbRZYto8;color=ffffff"
                  allowFullScreen="allowFullScreen"
                ></iframe>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="text-center">
              <div class="embed-responsive embed-responsive-16by9">
                <iframe
                  title="dashboard"
                  class="embed-responsive-item"
                  src="https://www.youtube.com/embed/XUPNtcKvU9I?start=147;color=ffffff"
                  allowFullScreen="allowFullScreen"
                ></iframe>
              </div>
            </div>
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

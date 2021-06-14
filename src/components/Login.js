import "bootstrap/dist/css/bootstrap.min.css";
import React, { useRef, useState } from "react";
import {
  Form,
  Button,
  Card,
  Alert,
  Container,
  Row,
  Col
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      setLoading(false);
      history.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <Container className="px-1 px-md-5 px-lg-1 px-x1-5 py-5 mx-auto">
      <Card className="border-0">
        <Row>
          <Col lg="6" className="d-none d-xl-block">
            <div className="pb-5">
              <img src="resources/login.png" alt="logo" className="image" />
            </div>
          </Col>
          <Col lg="6">
            <h2 className="text-center mb-4">Log In</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <br />
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <br />
              <Button disabled={loading} className="w-100" type="submit">
                Log In
              </Button>
            </Form>
            <div className="w-100 text-center mt-2">
              Need an account? <Link to="/signup">Sign Up</Link>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

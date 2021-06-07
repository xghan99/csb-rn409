import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Container } from "react-bootstrap";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import { AuthProvider } from "./contexts/AuthContext";
import TaskManager from "./components/TaskManager";
import Dashboard from "./components/Dashboard";
import TopBar from "./components/TopBar";
import PrivateRoute from "./components/PrivateRoute";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "./styles.css";

export default function App() {
  return (
    <Container
      className="d-flex justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100">
        <Router>
          <AuthProvider>
            <Switch>
              <Route path="/signup" component={SignUp} />
              <Route path="/login" component={Login} />
              <div>
                <TopBar />
                <PrivateRoute exact path="/" component={TaskManager} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </div>
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  );
}

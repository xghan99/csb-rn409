import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Container } from "react-bootstrap";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Landing from "./components/Landing";
import { AuthProvider } from "./contexts/AuthContext";
import TaskManager from "./components/TaskManager";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
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
              <Route exact path="/" component={Landing} />
              <Route path="/signup" component={SignUp} />
              <Route path="/login" component={Login} />
              <PrivateRoute
                exact
                path="/expenses-income-tracking"
                component={TaskManager}
              />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  );
}

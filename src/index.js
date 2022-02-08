import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import Routing from "./router/Routing";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routing />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LoginAndRegister from "../pages/LoginAndRegister";
import Home from "../pages/Home";
import logo from "../assets/logo.png";
import "../styles/loader.css";

import { AuthContext } from "../helpers/AuthContext";
import { auth } from "../firebase-config/config";
import { motion } from "framer-motion";
import { pageLoadVariants } from "../constants/animationVariants";

const Routing = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
  }, [currentUser]);

  setTimeout(() => setPending(false), 2000);

  if (pending) {
    return (
      <motion.div
      variants={pageLoadVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="centered"
      >
        <img alt="logo" src={logo} style={{ height: "100px" }} />

        <div className="loader">
          <span className="dot"></span>
          <div className="dots">
            <div className="span"></div>
            <div className="span"></div>
            <div className="span"></div>
          </div>{" "}
        </div>
        <h6
          style={{ textAlign: "center", letterSpacing: 3, marginTop: "20px" }}
        >
          loading, please wait...
        </h6>
      </motion.div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={currentUser ? <Home /> : <LoginAndRegister />}
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default Routing;

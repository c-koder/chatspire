import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import logo from "../assets/logo.png";
import "../styles/loader.css";
import { motion } from "framer-motion";

import { AuthContext } from "../helpers/AuthContext";
import { auth } from "../firebase-config/config";
import LoginAndRegister from "../pages/LoginAndRegister";
import { pageLoadVariants } from "../utils/animationVariants";
import ResetPassword from "../pages/ResetPassword";

const UserService = require("../services/UserService");
const MessageService = require("../services/MessageService");

const Routing = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const [chatFriends, setChatFriends] = useState([]);
  const [messages, setMessages] = useState([]);

  const [pending, setPending] = useState(true);
  const [loadingText, setLoadingText] = useState("loading, please wait...");

  /**
   * Observing user's sign in state.
   * When a user logs in, getUserFriends() method will be fired and the friend will be fetched.
   */
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setLoadingText("authorizing...");
      setCurrentUser(user);

      UserService.getUserFriends()
        .then((response) => {
          if (response !== null) {
            setLoadingText("getting users...");
            setChatFriends(response);
          }
        })
        .catch((err) => {});

      MessageService.getUserMessages()
        .then((response) => {
          if (response !== null) {
            setMessages(response);
          }
        })
        .catch((err) => {});
    });
    // const message = {
    //   sender_id: "RLZr45zUznfdUNjdNl7fS0YjZ4O2",
    //   receiver_id: "rYmOae5MqLZI3L6jdlqSPA7Uy912",
    //   context: "Wasap!",
    //   timestamp: "2022-02-08 20:05:34",
    // };
    // MessageService.sendMessage(message)
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, []);

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
          </div>
        </div>
        <h6
          style={{ textAlign: "center", letterSpacing: 3, marginTop: "20px" }}
        >
          {loadingText}
        </h6>
      </motion.div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      <Routes>
        <Route
          exact
          path="/"
          element={
            currentUser !== null && !pending ? (
              <Home
                chatFriends={chatFriends}
                setChatFriends={setChatFriends}
                messages={messages}
                setMessages={setMessages}
              />
            ) : (
              <LoginAndRegister />
            )
          }
        />
        <Route exact path="/resetpassword" element={<ResetPassword />} />
      </Routes>
    </AuthContext.Provider>
  );
};

export default Routing;

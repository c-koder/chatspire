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
import ChangeAvatar from "../components/ChangeAvatar";
import SendFriendRequests from "../components/SendFriendRequests";

const UserService = require("../services/UserService");
const MessageService = require("../services/MessageService");

const Routing = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const [chatFriends, setChatFriends] = useState([]);

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
        .catch((err) => {
          console.log(err);
        });
    });
  }, []);

  useEffect(() => {
    chatFriends.map((friend) =>
      MessageService.getUserLastMessage(friend.id)
        .then((response) => {
          if (response !== null && response !== undefined) {
            friend.lastMessage = response.context;
          }
        })
        .catch((err) => {
          console.log(err);
        })
    );
  }, [chatFriends]);

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
              // <Home chatFriends={chatFriends} setChatFriends={setChatFriends} />
              <SendFriendRequests />
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

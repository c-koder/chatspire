import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import logo from "../assets/logo.png";
import "../styles/loader.css";
import { motion } from "framer-motion";

import { AuthContext } from "../helpers/AuthContext";
import { auth, db } from "../firebase-config/config";
import LoginAndRegister from "../pages/LoginAndRegister";
import { pageLoadVariants } from "../utils/animationVariants";
import ResetPassword from "../pages/ResetPassword";
import { onChildAdded, onChildChanged, query, ref } from "firebase/database";

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
    });
  }, []);

  useEffect(() => {
    onChildAdded(query(ref(db, "user_friends/")), (snapshot) => {
      populateFriends();
    });
  }, []);

  useEffect(() => {
    onChildAdded(query(ref(db, "messages/")), (snapshot) => {
      populateFriends();
    });
  }, []);

  useEffect(() => {
    onChildChanged(query(ref(db, "messages/")), (snapshot) => {
      populateFriends();
    });
  }, []);

  const populateFriends = () => {
    UserService.getUserFriends()
      .then(async (response) => {
        if (response !== null) {
          setLoadingText("getting users...");
          let friends = [];
          for (let index = 0; index < response.length; index++) {
            let friend = response[index];
            let lastMsgResponse = await MessageService.getUserLastMessage(
              friend.id
            );
            friends[index] = {
              ...friend,
              lastMessage: lastMsgResponse.context,
            };
          }
          setChatFriends(friends);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
              <Home chatFriends={chatFriends} setChatFriends={setChatFriends} />
            ) : (
              // <SendFriendRequests />
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

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import "../styles/login.css";
import "../styles/loader.css";
import { pageLoadVariants2 } from "../utils/animationVariants";
import SendRequestTo from "./SendRequestTo";

const UserService = require("../services/UserService");

const SendFriendRequests = ({ setShowPane, setFindingFriends }) => {
  const [chatFriends, setChatFriends] = useState([]);

  useEffect(() => {
    UserService.getUsersToSendRequests()
      .then((response) => {
        if (response !== null) {
          setChatFriends(response);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <motion.div
      className="main centered"
      style={{ boxShadow: "none", height: "100%" }}
      variants={pageLoadVariants2}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <label style={{ cursor: "default" }}>Find New Friends</label>
      <div
        className="people-list"
        style={{ position: "relative", width: "100%" }}
      >
        <ul className="list-unstyled chat-list mt-2 mb-0">
          {chatFriends.map((chatFriend) => {
            return (
              <SendRequestTo
                key={chatFriend.id}
                chatFriend={chatFriend}
                setShowPane={setShowPane}
                setFindingFriends={setFindingFriends}
              />
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
};

export default SendFriendRequests;

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import "../styles/login.css";
import "../styles/loader.css";
import { pageLoadVariants } from "../utils/animationVariants";
import SendRequestTo from "./SendRequestTo";

const UserService = require("../services/UserService");

const SendFriendRequests = () => {
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
      variants={pageLoadVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <label>Find New Friends</label>
      <div className="people-list">
        <ul className="list-unstyled chat-list mt-2 mb-0">
          {chatFriends.map((chatFriend) => {
            return (
              <SendRequestTo key={chatFriend.id} chatFriend={chatFriend} />
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
};

export default SendFriendRequests;

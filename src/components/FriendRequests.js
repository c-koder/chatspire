import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import "../styles/login.css";
import "../styles/loader.css";
import { pageLoadVariants2 } from "../utils/animationVariants";
import FriendRequest from "./FriendRequest";

const UserService = require("../services/UserService");

const FriendRequests = ({ setShowPane, setFindingFriends }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    UserService.fetchFriendRequests()
      .then((response) => {
        if (response !== null) {
          setRequests(response);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = (id) => {
    setRequests(requests.filter((request) => request.request_id !== id));
  };

  return (
    <motion.div
      className="main centered"
      style={{ boxShadow: "none", height: "100%" }}
      variants={pageLoadVariants2}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <label style={{ cursor: "default" }}>Requests</label>
      <div
        className="people-list"
        style={{ position: "relative", width: "100%" }}
      >
        <ul className="list-unstyled chat-list mt-2 mb-0">
          {requests.map((request) => {
            return (
              <FriendRequest
                key={request.id}
                request={request}
                handleDelete={handleDelete}
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

export default FriendRequests;

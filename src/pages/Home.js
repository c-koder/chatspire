import { motion } from "framer-motion";
import "bootstrap-icons/font/bootstrap-icons.css";
import { onChildAdded, onChildChanged, query, ref } from "firebase/database";
import { useEffect, useState } from "react";

import { pageLoadVariants } from "../utils/animationVariants";
import ChatContainer from "../components/ChatContainer";
import ChatFriends from "../components/ChatFriends";
import { auth, db } from "../firebase-config/config";

const UserService = require("../services/UserService");

const Home = ({ chatFriends, setChatFriends, messages, setMessages }) => {
  const [chattingWithUser, setChattingWithUser] = useState(null);

  /**
   * Handling the logout using the firebase signout function.
   * In success, results in resetting the chatFriends, Messages, etc.
   */
  const handleLogout = () => {
    UserService.logoutUser();
  };

  /**
   * User online/last seen listener
   * Dependencies are not really required - used to clear out some warnings
   * It works since onChildChange observer listens for any child change within the users parent.
   * It results in changes within the chatFriends object array.
   */
  useEffect(() => {
    onChildChanged(query(ref(db, "users/")), (snapshot) => {
      setChatFriends(
        chatFriends.map((friend) =>
          friend.id === snapshot.val().id
            ? { ...friend, onlineOrLastSeen: snapshot.val().onlineOrLastSeen }
            : friend
        )
      );
    });
  }, [chatFriends, setChatFriends]);

  /* TODO */
  useEffect(() => {
    onChildAdded(query(ref(db, "messages/")), (snapshot) => {
      let filteredMessage = messages.filter(
        (message) => message.id !== snapshot.val().id
      );
      setMessages([...filteredMessage, snapshot.val()]);
    });
  }, []);

  return (
    <motion.div
      className="centered"
      variants={pageLoadVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <button onClick={handleLogout}>Logout</button>
      <div className="container">
        <div className="clearfix">
          <div className="col-lg-12">
            <div className="card chat-app">
              <div className="chat">
                <ChatContainer
                  messages={messages}
                  chattingWithUser={chattingWithUser}
                />
              </div>
              <div id="plist" className="people-list">
                <ChatFriends
                  chatFriends={chatFriends}
                  chattingWithUser={chattingWithUser}
                  setChattingWithUser={setChattingWithUser}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;

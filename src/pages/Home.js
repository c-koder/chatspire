import { motion } from "framer-motion";
import "bootstrap-icons/font/bootstrap-icons.css";
import { onChildChanged, query, ref } from "firebase/database";
import { useEffect, useState } from "react";

import Settings from "../components/Settings";
import { pageLoadVariants } from "../utils/animationVariants";
import ChatContainer from "../components/ChatContainer";
import ChatFriends from "../components/ChatFriends";
import { db } from "../firebase-config/config";

const Home = ({ chatFriends, setChatFriends }) => {
  const [chattingWithUser, setChattingWithUser] = useState(null);
  const [showPane, setShowPane] = useState("")
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
          friend.id === snapshot.val().id ? snapshot.val() : friend
        )
      );
    });
  }, [chatFriends, setChatFriends]);

  return (
    <motion.div
      className="centered"
      variants={pageLoadVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="container">
        <div className="clearfix">
          <div className="col-lg-12">
            <div className="card chat-app">
              <div className="chat">
                <ChatContainer
                  chatFriends={chatFriends}
                  chattingWithUser={chattingWithUser}
                  showPane={showPane}
                />
              </div>
              <div id="plist" className="people-list">
                <div
                  style={{
                    display: "flex",
                    position: "fixed",
                    backgroundColor: "var(--light)",
                    paddingBottom: 13,
                    boxShadow: "0 5px 50px 1px rgb(0 0 0 / 5%)",
                    width: "fit-content",
                  }}
                >
                  <div
                    className="input-group mb-0 message-outer-box"
                    style={{ margin: 14, marginTop: 10, width: "75%" }}
                  >
                    <div className="input-group-prepend">
                      <button
                        className="btn shadow-none btn-send"
                        type="button"
                      >
                        <i className="fa fa-search"></i>
                      </button>
                    </div>
                    <input
                      type="text"
                      className="form-control shadow-none message-box"
                      style={{ padding: "8px" }}
                      placeholder="Search..."
                      rows={1}
                    />
                  </div>
                  <Settings setShowPane={setShowPane} />
                </div>
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

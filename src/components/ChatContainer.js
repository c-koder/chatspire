import { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { onChildAdded, onChildChanged, query, ref } from "firebase/database";
import CryptoAES from "crypto-js/aes";

import Messages from "../components/Messages";
import logo from "../assets/logo.png";
import moment from "moment";
import { auth, db } from "../firebase-config/config";
import FriendRequests from "./FriendRequests";
import SendFriendRequests from "./SendFriendRequests";
import Profile from "./Profile";

const MessageService = require("../services/MessageService");

const ChatContainer = ({
  chatFriends,
  chattingWithUser,
  showPane,
  setShowPane,
  isFindingFriends,
  setFindingFriends,
}) => {
  const emojiRef = useRef(null);

  const [showEmojis, setShowEmojis] = useState(false);

  const [messageBox, setMessageBox] = useState(null);
  const [message, setMessage] = useState(null);
  const [messages, setMessages] = useState([]);

  const onEmojiClick = (event, emojiObject) => {
    setMessage(message + emojiObject.emoji);
    messageBox.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojis(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  useEffect(() => {
    onChildAdded(query(ref(db, "messages/")), (snapshot) => {
      populateMessages();
    });
  }, []);

  useEffect(() => {
    onChildChanged(query(ref(db, "messages/")), (snapshot) => {
      populateMessages();
    });
  }, []);

  useEffect(() => {
    MessageService.getUserMessages()
      .then((response) => {
        if (response !== null) {
          setMessages(
            response.filter(
              (message) =>
                message.receiver_id === chattingWithUser.id ||
                message.sender_id === chattingWithUser.id
            )
          );
        }
      })
      .catch((err) => {});
  }, [chattingWithUser]);

  const populateMessages = () => {
    MessageService.getUserMessages()
      .then((response) => {
        if (response !== null) {
          setMessages(response);
        }
      })
      .catch((err) => {});
  };

  const handleSendMessage = () => {
    if (message !== "") {
      const encryptedMessage = CryptoAES.encrypt(message, "eripstahc");
      const obj = {
        sender_id: auth.currentUser.uid,
        receiver_id: chattingWithUser.id,
        context: encryptedMessage.toString(),
        timestamp: moment().format("YYYY-MM-DD HH:mm:ss").toString(),
      };
      MessageService.sendMessage(obj)
        .then((response) => {
          if (response !== null) {
            setMessage("");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  if (showPane === "messages") {
    return (
      <div>
        <div
          className="chat-header clearfix"
          onClick={(e) => {
            setShowPane("profile");
            setFindingFriends({
              id: chattingWithUser.id,
              is_friend: true,
              viewing_friend: false,
              friend_request: false,
            });
          }}
        >
          <div className="row">
            <div className="col-lg-6">
              <img src={chattingWithUser.avatar} alt="avatar" />
              <div className="chat-about">
                <h6 className="mb-0" style={{ fontWeight: "bold" }}>
                  {chattingWithUser.username}
                </h6>
                <div className="status">
                  <small>
                    <i
                      className={
                        chattingWithUser.onlineOrLastSeen === "online"
                          ? "fa fa-circle online"
                          : "fa fa-circle offline"
                      }
                    ></i>
                    <span>
                      {chattingWithUser.onlineOrLastSeen !== "online"
                        ? " " +
                          moment(chattingWithUser.onlineOrLastSeen)
                            .local()
                            .fromNow()
                        : " online"}
                    </span>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Messages
          messages={messages}
          chatFriend={chatFriends}
          chattingWithUser={chattingWithUser}
        />

        <div className="chat-message clearfix">
          <div className="input-group mb-0">
            <div ref={emojiRef} className="input-group-prepend">
              <button
                className="btn shadow-none btn-send"
                type="button"
                onClick={() => setShowEmojis((oldState) => !oldState)}
              >
                <i className="bi bi-emoji-smile"></i>
              </button>
              {showEmojis && (
                <div
                  style={{
                    position: "absolute",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    bottom: "58px",
                  }}
                >
                  <Picker
                    onEmojiClick={onEmojiClick}
                    disableAutoFocus={true}
                    groupVisibility={{
                      animals_nature: false,
                      objects: false,
                      flags: false,
                    }}
                    native={true}
                  />
                </div>
              )}
            </div>
            <div className="input-group-prepend">
              <button className="btn shadow-none btn-send" type="button">
                <i className="fa fa-paperclip"></i>
              </button>
            </div>
            <textarea
              ref={(msgBox) => setMessageBox(msgBox)}
              className="form-control shadow-none message-box txtarea"
              placeholder="Type your message..."
              value={message || ""}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              style={{ fontSize: 16 }}
              rows={1}
            />
            <div className="input-group-prepend" style={{ marginRight: "8px" }}>
              <button
                className="btn shadow-none btn-send float-right"
                type="button"
                onClick={handleSendMessage}
              >
                <i className="fa fa-send"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (showPane === "requests") {
    return (
      <div className="right-pane">
        <FriendRequests
          setShowPane={setShowPane}
          setFindingFriends={setFindingFriends}
        />
      </div>
    );
  } else if (showPane === "find_friends") {
    return (
      <div className="right-pane">
        <SendFriendRequests
          setShowPane={setShowPane}
          setFindingFriends={setFindingFriends}
        />
      </div>
    );
  } else if (showPane === "profile") {
    return (
      <div className="right-pane">
        <Profile
          setShowPane={setShowPane}
          isFindingFriends={isFindingFriends}
        />
      </div>
    );
  } else {
    return (
      <div className="right-pane">
        <img
          alt="logo"
          src={logo}
          style={{
            height: "60px",
            position: "absolute",
            right: 0,
            left: 0,
            top: 0,
            bottom: 0,
            margin: "auto auto",
          }}
        />
      </div>
    );
  }
};

export default ChatContainer;

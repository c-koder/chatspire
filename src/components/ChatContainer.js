import { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { onChildAdded, query, ref } from "firebase/database";
import CryptoAES from "crypto-js/aes";
import { debounce } from "lodash";

import Messages from "../components/Messages";
import logo from "../assets/logo.png";
import moment from "moment";
import { auth, db } from "../firebase-config/config";

const MessageService = require("../services/MessageService");
const UserService = require("../services/UserService");

const ChatContainer = ({ chatFriends, chattingWithUser }) => {
  const emojiRef = useRef(null);

  const [showEmojis, setShowEmojis] = useState(false);
  const [messageBox, setMessageBox] = useState(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setMessage(message + emojiObject.emoji);
    messageBox.focus();
  };

  const handleIsTyping = debounce(function () {
    setIsTyping(false);
  }, 2000);

  useEffect(() => {
    UserService.setUserIsTyping(isTyping).catch((err) => console.log(err));
  }, [isTyping]);

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
      MessageService.getUserMessages()
        .then((response) => {
          if (response !== null) {
            setMessages(response);
          }
        })
        .catch((err) => {});
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
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

  return (
    <>
      {chattingWithUser !== null ? (
        <div>
          <div className="chat-header clearfix">
            <div className="row">
              <div className="col-lg-6">
                <img
                  src="https://bootdey.com/img/Content/avatar/avatar2.png"
                  alt="avatar"
                />
                <div className="chat-about">
                  <h6 className="mb-0">{chattingWithUser.username}</h6>
                  <div className="status">
                    <small>
                      <i
                        className={
                          chattingWithUser.onlineOrLastSeen === "online"
                            ? "fa fa-circle online"
                            : "fa fa-circle offline"
                        }
                      ></i>{" "}
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

          <Messages messages={messages} chatFriend={chatFriends} chattingWithUser={chattingWithUser} />

          {/* message box */}
          <div className="chat-message clearfix">
            <div className="input-group mb-0">
              <div
                ref={emojiRef}
                className="input-group-prepend"
                style={{
                  marginRight: "8px",
                }}
              >
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
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setIsTyping(true);
                  handleIsTyping();
                }}
                rows={1}
              />
              <div
                className="input-group-prepend"
                style={{ marginRight: "8px" }}
              >
                <button
                  className="btn shadow-none btn-send float-right"
                  type="button"
                  onClick={sendMessage}
                >
                  <i className="fa fa-send"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="chat-history"
          style={{
            height: "74vh",
            border: "none",
            position: "relative",
          }}
        >
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
      )}
    </>
  );
};

export default ChatContainer;

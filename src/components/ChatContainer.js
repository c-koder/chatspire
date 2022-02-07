import { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import "bootstrap-icons/font/bootstrap-icons.css";

import Messages from "../components/Messages";
import logo from "../assets/logo.png";
import moment from "moment";

const ChatContainer = ({ messages, chattingWithUser }) => {
  const ref = useRef(null);

  const [showEmojis, setShowEmojis] = useState(false);
  const [messageBox, setMessageBox] = useState(null);
  const [message, setMessage] = useState("");

  const onEmojiClick = (event, emojiObject) => {
    setMessage(message + emojiObject.emoji);
    messageBox.focus();
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowEmojis(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <>
      {chattingWithUser != null ? (
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

          <Messages messages={messages} />

          {/* message box */}
          <div className="chat-message clearfix">
            <div className="input-group mb-0 message-outer-box">
              <div
                className="input-group-prepend"
                style={{ marginRight: "8px" }}
              >
                <button className="btn shadow-none btn-send" type="button">
                  <i className="fa fa-send"></i>
                </button>
              </div>
              <div ref={ref} className="input-group-prepend">
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
              <textarea
                ref={(msgBox) => setMessageBox(msgBox)}
                className="form-control shadow-none message-box"
                placeholder="Enter your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={1}
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          className="chat-history"
          style={{
            height: "79.35vh",
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

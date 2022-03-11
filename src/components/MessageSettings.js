import { useEffect, useRef, useState } from "react";

const MessageService = require("../services/MessageService");

const MessageSettings = ({ msg_id, isSender }) => {
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        setShowSettings(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const settingsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingsRef]);

  const handleDelete = async () => {
    await MessageService.deleteMessage(msg_id);
  };

  return (
    <div
      style={{
        position: "absolute",
        marginTop: -7,
        marginRight: -5,
        top: 0,
        right: 0,
      }}
    >
      <div className="dropdown" ref={settingsRef}>
        <button
          className="btn shadow-none"
          type="button"
          id="message-settings"
          data-bs-toggle="dropdown"
          data-bs-auto-close="false"
          aria-expanded="false"
          onClick={() => setShowSettings(!showSettings)}
        >
          <i
            className={`bi bi-chevron-down opt ${showSettings && " fixed"}`}
          ></i>
        </button>
        <ul
          className={`dropdown-menu ${showSettings && "show"}`}
          aria-labelledby="message-settings"
          style={{
            padding: 10,
            boxShadow: "0 0px 50px 10px rgb(0 0 0 / 3%)",
            border: "none",
          }}
        >
          <button className="dropdown-item settings-item">
            <i className="bi bi-reply-fill"></i>Reply
          </button>
          <button className="dropdown-item settings-item">
            <i className="bi bi-send-plus-fill"></i>Forward
          </button>
          {isSender && (
            <button
              className="dropdown-item settings-item"
              onClick={handleDelete}
            >
              <i className="bi bi-trash3-fill"></i>Delete
            </button>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MessageSettings;

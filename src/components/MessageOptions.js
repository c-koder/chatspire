import { useEffect, useRef, useState } from "react";

const MessageService = require("../services/MessageService");

const MessageSettings = ({ msg_id, isSender }) => {
  const [showSettings, setShowSettings] = useState(false);
  const toggleOpen = () => setShowSettings(!showSettings);

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
      ref={settingsRef}
      style={{
        position: "absolute",
        marginTop: -7,
        marginRight: -5,
        top: 0,
        right: 0,
      }}
    >
      <div className="dropdown">
        <button
          className="btn shadow-none"
          type="button"
          data-bs-toggle="dropdown"
          onClick={toggleOpen}
        >
          <i
            className={`bi bi-chevron-down opt ${showSettings && " fixed"}`}
          ></i>
        </button>
        <div
          className={`dropdown-menu ${showSettings ? "show" : ""}`}
          style={{
            position: "absolute",
            right: 0,
            marginRight: 5,
            padding: 10,
            boxShadow: "0 0px 50px 10px rgb(0 0 0 / 3%)",
            border: "none",
            zIndex: 99,
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
        </div>
      </div>
    </div>
  );
};

export default MessageSettings;

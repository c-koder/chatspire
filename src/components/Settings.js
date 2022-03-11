import { useEffect, useRef, useState } from "react";
import { auth } from "../firebase-config/config";

const UserService = require("../services/UserService");

const Settings = ({ setShowPane, setFindingFriends }) => {
  const [showSettings, setShowSettings] = useState(false);

  /**
   * Handling the logout using the firebase signout function.
   * In success, results in resetting the chatFriends, Messages, etc.
   */
  const handleLogout = (e) => {
    e.preventDefault();
    setShowSettings(false);
    UserService.logoutUser();
  };

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

  return (
    <div
      className="input-group-prepend"
      style={{
        position: "absolute",
        right: 0,
        margin: "17px 0px 0px 0px",
      }}
    >
      <div className="dropdown" ref={settingsRef}>
        <button
          className="btn shadow-none btn-send"
          type="button"
          id="settings"
          data-bs-toggle="dropdown"
          data-bs-auto-close="true"
          aria-expanded="false"
          onClick={() => setShowSettings(!showSettings)}
        >
          <i className="bi bi-gear-fill"></i>
        </button>
        <ul
          className={`dropdown-menu ${showSettings && "show"}`}
          aria-labelledby="settings"
          style={{
            padding: 10,
            boxShadow: "0 0px 50px 10px rgb(0 0 0 / 3%)",
            border: "none",
          }}
        >
          <button
            className="dropdown-item settings-item"
            onClick={(e) => {
              setShowPane("profile");
              setFindingFriends({ id: auth.currentUser.uid, value: false });
            }}
          >
            <i className="bi bi-person-fill"></i>Profile
          </button>
          <button
            onClick={(e) => setShowPane("find_friends")}
            className="dropdown-item settings-item"
          >
            <i className="bi bi-person-plus-fill"></i>Find Friends
          </button>
          <button
            onClick={(e) => setShowPane("requests")}
            className="dropdown-item settings-item"
          >
            <i className="bi bi-people-fill"></i>Requests
          </button>
          <button className="dropdown-item settings-item">
            <i className="bi bi-sliders2"></i>Settings
          </button>
          <button
            className="dropdown-item settings-item"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-left"></i>Logout
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Settings;

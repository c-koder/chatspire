import { useEffect, useRef, useState } from "react";

const UserService = require("../services/UserService");

const Settings = () => {
  const [showSettings, setShowSettings] = useState(false);
  const toggleOpen = () => setShowSettings(!showSettings);

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
      ref={settingsRef}
    >
      <div className="dropdown">
        <button
          className="btn shadow-none btn-send"
          type="button"
          data-bs-toggle="dropdown"
          onClick={toggleOpen}
        >
          <i className="bi bi-gear-fill"></i>
        </button>
        <div
          className={`dropdown-menu ${showSettings ? "show" : ""}`}
          style={{
            positionL: "absolute",
            right: 0,
            marginRight: 15,
            padding: 10,
            boxShadow: "0 0px 50px 10px rgb(0 0 0 / 2%)",
            border: "none",
          }}
        >
          <button className="dropdown-item settings-item">
            <i class="bi bi-person-fill"></i>Profile
          </button>
          <button className="dropdown-item settings-item">
            <i class="bi bi-sliders2"></i>Settings
          </button>
          <button
            className="dropdown-item settings-item"
            onClick={handleLogout}
          >
            <i class="bi bi-box-arrow-left"></i>Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

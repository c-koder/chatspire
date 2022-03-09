import { useEffect, useRef, useState } from "react";

const VisibilitySettings = ({ setEmailVisibility, emailVisibility }) => {
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
        setTimeout(() => {
          setShowSettings(false);
        }, 100);
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
        margin: "-9px 0px 0px -7px",
      }}
    >
      <div className="dropdown">
        <button
          className="btn shadow-none btn-send"
          type="button"
          data-bs-toggle="dropdown"
          onClick={toggleOpen}
          ref={settingsRef}
        >
          <i
            className={emailVisibility ? "bi bi-globe2" : "bi bi-lock-fill"}
          ></i>
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
          <button
            className="dropdown-item settings-item"
            onClick={(e) => setEmailVisibility(true)}
          >
            <i className="bi bi-globe2"></i>Public
          </button>
          <button
            className="dropdown-item settings-item"
            onClick={(e) => setEmailVisibility(false)}
          >
            <i className="bi bi-lock-fill"></i>Only Me
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisibilitySettings;

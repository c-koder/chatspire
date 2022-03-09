import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import "../styles/login.css";
import "../styles/loader.css";
import { errVariants, pageLoadVariants } from "../utils/animationVariants";
import SendFriendRequests from "./SendFriendRequests";

const UserService = require("../services/UserService");

const ChangeAvatar = () => {
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageAsUrl, setSelectedImageAsUrl] = useState("");

  const [skipToFriendRequests, setSkipToFriendRequests] = useState(false);
  const [loading, setLoading] = useState(false);

  const [imageError, setImageError] = useState("");
  const [errorClass, setErrorClass] = useState("error");

  const handleUploadAvatar = (e) => {
    e.preventDefault();
    if (selectedImageAsUrl === "") {
      setImageError("Please select an image");
    } else {
      setLoading(true);
      UserService.updateUserAvatar(selectedImage, false)
        .then((response) => {
          if (response !== undefined && response !== null) {
            setErrorClass("error success");
            setImageError("Avatar upload success");
            setSelectedImage("");
            setTimeout(() => {
              setSkipToFriendRequests(true);
            }, 1000);
          } else {
            setErrorClass("error");
            setImageError("An error occured when uploading your avatar.");
            setSelectedImage("");
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  };

  const handleChooseAvatar = () => {
    const input = document.getElementById("file-input");
    if (input) {
      input.click();
    }
  };

  const getFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setSelectedImageAsUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setImageError("");
    }, 4000);
    return () => clearInterval(timer);
  }, [imageError]);

  if (skipToFriendRequests) return <SendFriendRequests />;
  else
    return (
      <motion.div
        className="main centered"
        variants={pageLoadVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{ height: "550px" }}
      >
        <form>
          <label>Profile Avatar</label>
          <center>
            <h6
              style={{
                fontSize: 14,
                marginTop: -40,
                marginBottom: 15,
                width: "50%",
                color: "var(--primary)",
              }}
            >
              Let your friends know the face behind the message.
            </h6>
            <br />
            <div className="profilepic" onClick={handleChooseAvatar}>
              <input
                type="file"
                id="file-input"
                style={{ display: "none" }}
                accept="image/png, image/jpeg, image/jpg"
                onChange={getFile}
              />
              <img
                className="profilepic__image"
                src={
                  selectedImageAsUrl ||
                  "https://firebasestorage.googleapis.com/v0/b/chatspire-33b4c.appspot.com/o/profile.png?alt=media&token=eaa85b3e-e186-49d8-ba2b-ce6594d51f7d"
                }
                onError={(e) => setSelectedImageAsUrl("")}
                alt="Profibild"
              />

              <div className="profilepic__content">
                <span className="profilepic__icon">
                  <i className="bi bi-camera-fill"></i>
                </span>
                <span className="profilepic__text">Select Avatar</span>
              </div>
            </div>
            <br />
            <div
              style={{
                display: "flex",
                width: "75%",
              }}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setSkipToFriendRequests(true);
                }}
                className="invert-btn"
                style={{
                  marginRight: 30,
                }}
              >
                Skip
              </button>
              <button onClick={handleUploadAvatar} disabled={loading}>
                Proceed
              </button>
            </div>
          </center>
        </form>

        {loading && (
          <div className="ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}

        {imageError !== "" && (
          <motion.span
            variants={errVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={errorClass}
          >
            {imageError}
          </motion.span>
        )}
      </motion.div>
    );
};

export default ChangeAvatar;

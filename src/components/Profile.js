import { motion } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import moment from "moment";
import ReactTooltip from "react-tooltip";

import "../styles/login.css";
import "../styles/loader.css";

import { errVariants, pageLoadVariants2 } from "../utils/animationVariants";
import { AuthContext } from "../helpers/AuthContext";
import VisibilitySettings from "./VisibilitySettings";
import {
  invalidUsername,
  validFacebookUrl,
  validInstagramUrl,
  validLinkedinUrl,
  validTwitterUrl,
} from "../utils/validations";

const UserService = require("../services/UserService");

const Profile = ({ setShowPane, isFindingFriends }) => {
  const id = isFindingFriends.friend_request
    ? isFindingFriends.id.id
    : isFindingFriends.id;

  const { currentUser } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);

  const [user, setUser] = useState({
    avatar: "",
    email: "",
    email_visibility: true,
    username: "",
    score: 0,
    bio: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    joined_date: "",
  });

  useEffect(() => {
    UserService.getUser("id", id).then((response) => {
      setUser(response[Object.keys(response)[0]]);

      setNewUsername(response[Object.keys(response)[0]].username);
      setEmailVisibility(response[Object.keys(response)[0]].email_visibility);
      setNewBio(response[Object.keys(response)[0]].bio);
      setTwitter(response[Object.keys(response)[0]].twitter);
      setFacebook(response[Object.keys(response)[0]].facebook);
      setInstagram(response[Object.keys(response)[0]].instagram);
      setLinkedin(response[Object.keys(response)[0]].linkedin);
    });
  }, [id]);

  const [emailVisibility, setEmailVisibility] = useState(false);
  const [newAvatar, setNewAvatar] = useState("");
  const [selectedImageAsUrl, setSelectedImageAsUrl] = useState("");

  const [newUsername, setNewUsername] = useState("");
  const [usernameExists, setUsernameExists] = useState(false);

  const [newBio, setNewBio] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorClass, setErrorClass] = useState("error");

  const [btnMessage, setBtnMessage] = useState("Send Request");

  const handleSendRequest = (id) => {
    setLoading(true);
    UserService.sendFriendRequest(id).then((response) => {
      if (response === "success") {
        setBtnMessage("Request Sent");
      } else if (response === "already_sent") {
        setBtnMessage("Request Pending");
      }
      setLoading(false);
    });
  };

  const handleAccept = (id, friend_id) => {
    UserService.acceptFriendRequest(id, friend_id).then((response) => {
      response !== null && response !== undefined && setShowPane("requests");
    });
  };

  const handleDecline = (id) => {
    UserService.declineFriendRequest(id).then((response) => {
      response !== null && response !== undefined && setShowPane("requests");
    });
  };

  useEffect(() => {
    newUsername !== user.username &&
      UserService.getUser("username", newUsername).then((response) => {
        response !== null ? setUsernameExists(true) : setUsernameExists(false);
      });
  }, [newUsername]);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setError("");
    }, 4000);
    return () => clearInterval(timer);
  }, [error]);

  const saveDetails = () => {
    if (
      newUsername !== user.username &&
      (newUsername.length < 5 || newUsername.length > 10)
    ) {
      setError("Username must be atleast 5 chars and not over 10.");
    } else if (newUsername !== user.username && invalidUsername(newUsername)) {
      setError("Username cannot contain special chars.");
    } else if (newUsername !== user.username && usernameExists) {
      setError("Username is not available.");
    } else if (newBio !== user.bio && newBio.length > 150) {
      setError("Please limit the bio to 150 chars.");
    } else if (twitter !== "" && !validTwitterUrl(twitter)) {
      setError("Invalid Twitter url.");
    } else if (facebook !== "" && !validFacebookUrl(facebook)) {
      setError("Invalid Facebook url.");
    } else if (instagram !== "" && !validInstagramUrl(instagram)) {
      setError("Invalid Instagram url.");
    } else if (linkedin !== "" && !validLinkedinUrl(linkedin)) {
      setError("Invalid Linkedin url.");
    } else {
      setLoading(true);
      UserService.updateUser(
        newAvatar,
        newUsername,
        newBio,
        emailVisibility,
        twitter,
        facebook,
        instagram,
        linkedin
      )
        .then((response) => {
          if (response !== undefined && response !== null) {
            setErrorClass("error success");
            setError("Profile updated.");
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            setErrorClass("error");
            setError("An error occured when updating.");
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
      setNewAvatar(e.target.files[0]);
      setSelectedImageAsUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <motion.div
      className="centered profile-card"
      style={{
        boxShadow: "none",
        height: "100%",
      }}
      variants={pageLoadVariants2}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <ReactTooltip
        place="bottom"
        type="dark"
        effect="solid"
        textColor="var(--lightAccent)"
        backgroundColor="var(--dark)"
        className="tool-tip"
        offset={{ top: 15 }}
      />
      <div className="container mt-4 p-3 d-flex justify-content-center">
        <div className="card p-3">
          <div className=" image d-flex flex-column justify-content-center align-items-center">
            {editMode ? (
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
                  alt="avatar"
                  src={selectedImageAsUrl || user.avatar}
                  onError={(e) => setSelectedImageAsUrl("")}
                />
                <div className="profilepic__content">
                  <span className="profilepic__icon">
                    <i className="bi bi-camera-fill"></i>
                  </span>
                  <span className="profilepic__text">Select Avatar</span>
                </div>
              </div>
            ) : (
              <img className="img" src={user.avatar} alt="avatar" />
            )}
            {editMode ? (
              <div>
                <br />
                <input
                  type="text"
                  value={newUsername}
                  placeholder="Update username"
                  onChange={(e) => setNewUsername(e.target.value)}
                />
                <br />
                <br />
              </div>
            ) : (
              <span className="name mt-3">{user.username}</span>
            )}

            {!editMode && (
              <div
                className={`d-flex flex-row justify-content-center align-items-center`}
                data-tip="Spire Score"
              >
                <span className="score">{user.score || 0}</span>
                <span style={{ fontSize: "14px" }}>
                  <i className="bi bi-activity" style={{ fontSize: 20 }}></i>
                </span>
              </div>
            )}

            {(user.email_visibility || id === currentUser.uid) && (
              <span className="email">
                <a href={`mailto:${user.email}`}>{user.email}</a>
                {user.id === currentUser.uid && !editMode && (
                  <i
                    data-tip={`${user.email_visibility ? "Public" : "Only Me"}`}
                    className={`${
                      user.email_visibility ? "bi bi-globe2" : "bi bi-lock-fill"
                    } btn shadow-none btn-send`}
                    style={{ marginTop: -8, marginLeft: -7 }}
                  ></i>
                )}
                {editMode && (
                  <VisibilitySettings
                    setEmailVisibility={setEmailVisibility}
                    emailVisibility={emailVisibility}
                  />
                )}
              </span>
            )}
            <div className="text text-center">
              {editMode ? (
                <textarea
                  className="form-control shadow-none txtarea"
                  placeholder="Update your bio (150 Chars)"
                  value={newBio}
                  onChange={(e) => {
                    setNewBio(e.target.value);
                  }}
                  style={{ fontSize: 16 }}
                />
              ) : (
                <span>{user.bio}</span>
              )}
            </div>
            {editMode ? (
              <div className="float-left">
                <br />
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text"
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        width: 35,
                        marginLeft: -30,
                      }}
                    >
                      <i className="fa fa-twitter"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control shadow-none"
                    placeholder="Update Twitter (Public)"
                    value={twitter}
                    onChange={(e) => {
                      setTwitter(e.target.value);
                    }}
                  />
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text"
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        width: 35,
                        marginLeft: -30,
                      }}
                    >
                      <i className="fa fa-facebook-f"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control shadow-none"
                    placeholder="Update Facebook (Public)"
                    value={facebook}
                    onChange={(e) => {
                      setFacebook(e.target.value);
                    }}
                  />
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text"
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        width: 35,
                        marginLeft: -30,
                      }}
                    >
                      <i className="fa fa-instagram"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control shadow-none"
                    placeholder="Update Instagram (Public)"
                    value={instagram}
                    onChange={(e) => {
                      setInstagram(e.target.value);
                    }}
                  />
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text"
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        width: 35,
                        marginLeft: -30,
                      }}
                    >
                      <i className="fa fa-linkedin"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control shadow-none"
                    placeholder="Update LinkedIn (Public)"
                    value={linkedin}
                    onChange={(e) => {
                      setLinkedin(e.target.value);
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="gap-3 mt-1 icons d-flex flex-row justify-content-center align-items-center">
                {user.twitter !== "" && (
                  <a
                    href={"//" + user.twitter}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fa fa-twitter"></i>
                  </a>
                )}
                {user.facebook !== "" && (
                  <a
                    href={"//" + user.facebook}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fa fa-facebook-f"></i>
                  </a>
                )}
                {user.instagram !== "" && (
                  <a
                    href={"//" + user.instagram}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fa fa-instagram"></i>
                  </a>
                )}
                {user.linkedin !== "" && (
                  <a
                    href={"//" + user.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fa fa-linkedin"></i>
                  </a>
                )}
              </div>
            )}

            {editMode && error !== "" && (
              <motion.span
                variants={errVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={errorClass}
                style={{ marginTop: 0, marginBottom: 5 }}
              >
                {error}
              </motion.span>
            )}

            <div className=" px-2 rounded mt-2 date ">
              <span className="join">
                {"Joined Date: " +
                  moment(user.joined_date).format("MMMM Do YYYY")}
              </span>
            </div>
            <br />
            {id === currentUser.uid && (
              <div className=" d-flex">
                <button
                  className="btn-main"
                  style={{ width: 110, height: 40 }}
                  disabled={loading}
                  onClick={(e) =>
                    editMode ? saveDetails() : setEditMode(true)
                  }
                >
                  {editMode && loading && (
                    <i className="fa fa-circle-o-notch fa-spin"></i>
                  )}
                  {editMode ? "Save" : "Edit Profile"}
                </button>
                {editMode && (
                  <button
                    className="btn-main"
                    style={{
                      width: 100,
                      height: 40,
                      marginLeft: 20,
                      backgroundColor: "var(--primaryDark)",
                    }}
                    disabled={loading}
                    onClick={(e) => {
                      setEditMode(false);
                      setShowPane("profile");
                    }}
                  >
                    Discard
                  </button>
                )}
              </div>
            )}

            {isFindingFriends.viewing_friend && (
              <div className=" d-flex">
                <button
                  className="btn-main"
                  style={{
                    width: 200,
                    height: 40,
                    marginRight: 15,
                  }}
                  disabled={
                    btnMessage === "Request Sent" ||
                    btnMessage === "Request Pending"
                  }
                  onClick={(e) => handleSendRequest(id)}
                >
                  {loading && <i className="fa fa-circle-o-notch fa-spin"></i>}
                  {btnMessage}
                </button>
                <button
                  className="btn-main"
                  style={{
                    width: 80,
                    height: 40,
                  }}
                  onClick={(e) => {
                    setShowPane("find_friends");
                  }}
                >
                  Back
                </button>
              </div>
            )}

            {isFindingFriends.friend_request && (
              <div className=" d-flex">
                <div className="btn-group mr-2" style={{ marginRight: 15 }}>
                  <button
                    type="button"
                    className="dropdown-item btn-main"
                    style={{
                      fontSize: 14,
                      height: 40,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                    onClick={(e) =>
                      handleAccept(isFindingFriends.id.request_id, id)
                    }
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className="dropdown-item btn-main"
                    style={{
                      fontSize: 14,
                      height: 40,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      backgroundColor: "var(--primaryDark)",
                    }}
                    onClick={(e) =>
                      handleDecline(isFindingFriends.id.request_id, id)
                    }
                  >
                    <i
                      className="bi bi-x-circle"
                      style={{ color: "var(--light)" }}
                    ></i>
                  </button>
                </div>
                <button
                  className="btn-main"
                  style={{
                    width: 80,
                    height: 40,
                  }}
                  onClick={(e) => {
                    setShowPane("find_friends");
                  }}
                >
                  Back
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;

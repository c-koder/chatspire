import { useState } from "react";

const SendRequestTo = ({ chatFriend }) => {
  const UserService = require("../services/UserService");

  const [btnMessage, setBtnMessage] = useState("Send Request");

  const handleSendRequest = (id) => {
    UserService.sendFriendRequest(id).then((response) => {
      if (response === "success") {
        setBtnMessage("Request Sent");
      } else if (response === "already_sent") {
        setBtnMessage("Request Pending");
      }
    });
  };

  return (
    <li className="clearfix">
      <img src={chatFriend.avatar} alt="avatar" />
      <div className="about" style={{ display: "flex" }}>
        <div className="name">{chatFriend.username} </div>
        <button
          style={{
            position: "absolute",
            right: 0,
            fontSize: 14,
            width: 140,
            height: 40,
            marginTop: 5,
            marginRight: 40,
          }}
          disabled={
            btnMessage === "Request Sent" || btnMessage === "Request Pending"
          }
          onClick={(e) => handleSendRequest(chatFriend.id)}
        >
          {btnMessage}
        </button>
      </div>
    </li>
  );
};

export default SendRequestTo;

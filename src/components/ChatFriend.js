import { Parser } from "html-to-react";
import { messageContainsEmojis } from "../utils/Validations";

const ChatFriend = ({ user, active, setChattingWithUser }) => {
  const handleCurrentChattingUser = () => {
    setChattingWithUser(user);
  };

  let userLastMessage = "";

  if (user.lastMessage !== null || user.lastMessage !== undefined) {
    if (user.lastMessage.length > 20) {
      userLastMessage = user.lastMessage.substring(0, 20) + "...";
    } else {
      userLastMessage = user.lastMessage;
    }
  }

  return (
    <div onClick={handleCurrentChattingUser}>
      <li className={active ? "clearfix active" : "clearfix"}>
        <img src={user.avatar} alt="avatar" />
        <i
          className={
            user.onlineOrLastSeen === "online"
              ? "fa fa-circle online"
              : "fa fa-circle offline"
          }
          style={{
            position: "absolute",
            left: 0,
            marginLeft: 70,
            fontSize: 14,
          }}
        ></i>
        <div className="about">
          <div className="name">{user.username} </div>
          <div className="status">
            {user.isTyping
              ? "typing..."
              : messageContainsEmojis(userLastMessage) &&
                userLastMessage.length <= 4
              ? userLastMessage
              : Parser().parse(userLastMessage)}
          </div>
        </div>
      </li>
    </div>
  );
};

export default ChatFriend;

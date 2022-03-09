import { messageContainsEmojis } from "../utils/validations";

const ChatFriend = ({ user, active, setChattingWithUser, setShowPane }) => {
  const handleCurrentChattingUser = () => {
    setChattingWithUser(user);
    setShowPane("messages");
  };

  let userLastMessage = "";

  if (user.lastMessage !== null && user.lastMessage !== undefined) {
    if (user.lastMessage.length > 15) {
      userLastMessage = user.lastMessage.substring(0, 15) + "...";
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
            {userLastMessage === "Message Deleted" ? "" : userLastMessage}
          </div>
        </div>
      </li>
    </div>
  );
};

export default ChatFriend;

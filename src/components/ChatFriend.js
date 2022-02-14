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
        <img
          src="https://bootdey.com/img/Content/avatar/avatar1.png"
          alt="avatar"
        />
        <i
          className={
            user.onlineOrLastSeen === "online"
              ? "fa fa-circle online"
              : "fa fa-circle offline"
          }
          style={{
            position: "absolute",
            marginTop: 5,
            marginLeft: -8,
            fontSize: 14,
          }}
        ></i>
        <div className="about">
          <div className="name">{user.username} </div>
          <div className="status">
            {user.isTyping ? "typing..." : userLastMessage}
          </div>
        </div>
      </li>
    </div>
  );
};

export default ChatFriend;

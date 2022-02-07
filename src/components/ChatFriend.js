import moment from "moment";

const ChatFriend = ({ user, active, setChattingWithUser }) => {
  const handleCurrentChattingUser = () => {
    setChattingWithUser(user);
  };

  return (
    <div onClick={handleCurrentChattingUser}>
      <li className={active ? "clearfix active" : "clearfix"}>
        <img
          src="https://bootdey.com/img/Content/avatar/avatar1.png"
          alt="avatar"
        />
        <div className="about">
          <div className="name">{user.username}</div>
          <div className="status">
            <i
              className={
                user.onlineOrLastSeen === "online"
                  ? "fa fa-circle online"
                  : "fa fa-circle offline"
              }
            ></i>
            <span>
              {user.onlineOrLastSeen !== "online"
                ? " " + moment(user.onlineOrLastSeen).local().fromNow()
                : " online"}
            </span>
          </div>
        </div>
      </li>
    </div>
  );
};

export default ChatFriend;

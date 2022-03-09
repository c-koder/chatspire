const SendRequestTo = ({ chatFriend, setShowPane, setFindingFriends }) => {
  const showProfile = (id) => {
    setShowPane("profile");
    setFindingFriends({ id: id, viewing_friend: true, friend_request: false });
  };

  return (
    <li className="clearfix">
      <img src={chatFriend.avatar} alt="avatar" />
      <div className="about" style={{ display: "flex" }}>
        <div className="name" style={{ margin: "10px 0px 10px 5px" }}>
          {chatFriend.username}
        </div>
        <button
          style={{
            position: "absolute",
            right: 0,
            fontSize: 14,
            width: 140,
            height: 40,
            marginTop: 5,
            marginRight: 40,
            zIndex: 99,
          }}
          onClick={(e) => showProfile(chatFriend.id)}
        >
          View
        </button>
      </div>
    </li>
  );
};

export default SendRequestTo;

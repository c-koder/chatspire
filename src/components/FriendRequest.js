const FriendRequest = ({ request, setShowPane, setFindingFriends }) => {
  const showProfile = () => {
    setShowPane("profile");
    setFindingFriends({
      id: request,
      viewing_friend: false,
      friend_request: true,
    });
  };

  return (
    <li className="clearfix">
      <img src={request.avatar} alt="avatar" />
      <div className="about" style={{ display: "flex" }}>
        <div className="name" style={{ margin: "10px 0px 10px 5px" }}>
          {request.username}
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
          onClick={(e) => showProfile()}
        >
          View
        </button>
      </div>
    </li>
  );
};

export default FriendRequest;

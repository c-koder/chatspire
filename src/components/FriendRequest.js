const FriendRequest = ({ request, handleDelete }) => {
  const UserService = require("../services/UserService");

  const handleAccept = (id, friend_id) => {
    UserService.acceptFriendRequest(id, friend_id).then((response) => {
      if (response === "success") {
        handleDelete(id);
      }
    });
  };

  const handleDecline = (id) => {
    UserService.declineFriendRequest(id).then((response) => {
      if (response === "success") {
        handleDelete(id);
      }
    });
  };

  return (
    <li className="clearfix">
      <img src={request.avatar} alt="avatar" />
      <div className="about" style={{ display: "flex" }}>
        <div className="name" style={{ margin: "10px 0px 10px 5px" }}>
          {request.username}
        </div>
        <div
          className="btn-group mr-2"
          style={{
            position: "absolute",
            right: 0,
            marginTop: -15,
            marginRight: 30,
          }}
        >
          <button
            type="button"
            className="dropdown-item"
            style={{
              fontSize: 14,
              height: 40,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
            onClick={(e) => handleAccept(request.request_id, request.id)}
          >
            Accept
          </button>
          <button
            type="button"
            className="dropdown-item"
            style={{
              fontSize: 14,
              height: 40,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
            onClick={(e) => handleDecline(request.request_id)}
          >
            <i className="bi bi-x-circle"></i>
          </button>
        </div>
      </div>
    </li>
  );
};

export default FriendRequest;

import ChatFriend from "./ChatFriend";

const ChatFriends = ({
  chatFriends,
  chattingWithUser,
  setChattingWithUser,
}) => {
  console.log(chatFriends);
  return (
    <div>
      <div className="input-group mb-0 message-outer-box">
        <div className="input-group-prepend">
          <button className="btn shadow-none btn-send" type="button">
            <i className="fa fa-search"></i>
          </button>
        </div>
        <input
          type="text"
          className="form-control shadow-none message-box"
          placeholder="Search..."
          rows={1}
        />
      </div>
      <ul className="list-unstyled chat-list mt-2 mb-0">
        {chatFriends.map((chatFriend) => {
          return (
            <ChatFriend
              key={chatFriend.id}
              user={chatFriend}
              active={
                chattingWithUser !== null &&
                chatFriend.username === chattingWithUser.username
              }
              setChattingWithUser={setChattingWithUser}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default ChatFriends;

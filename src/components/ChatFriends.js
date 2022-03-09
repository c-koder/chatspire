import ChatFriend from "./ChatFriend";

const ChatFriends = ({
  chatFriends,
  chattingWithUser,
  setChattingWithUser,
  setShowPane,
}) => {
  return (
    <div style={{ marginTop: 80 }}>
      <ul className="list-unstyled chat-list mt-2 mb-0">
        {chatFriends.map((chatFriend) => {
          return (
            <ChatFriend
              key={chatFriend.id}
              user={chatFriend}
              active={
                chattingWithUser !== null &&
                chatFriend.id === chattingWithUser.id
              }
              setShowPane={setShowPane}
              setChattingWithUser={setChattingWithUser}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default ChatFriends;

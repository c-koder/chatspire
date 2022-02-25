import ChatFriend from "./ChatFriend";

const ChatFriends = ({
  chatFriends,
  chattingWithUser,
  setChattingWithUser,
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
              setChattingWithUser={setChattingWithUser}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default ChatFriends;

import React, { useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import Message from "./Message";

const Messages = ({ messages }) => {
  const { currentUser } = useContext(AuthContext);
  
  return (
    <div className="chat-history">
      <ul className="m-b-0">
        {messages.map((message) => {
          return (
            <Message
              key={message.id}
              message={message}
              isUserMessage={currentUser.uid == message.from_uid}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Messages;

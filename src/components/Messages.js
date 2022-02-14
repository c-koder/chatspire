import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../helpers/AuthContext";
import Message from "./Message";

const Messages = ({ messages, chattingWithUser }) => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="chat-history">
      <ul className="m-b-0">
        {messages.map((message) => {
          if (
            message.receiver_id === chattingWithUser.id ||
            message.sender_id === chattingWithUser.id
          ) {
            return (
              <Message
                key={message.id}
                message={message}
                isUserMessage={currentUser.uid == message.sender_id}
              />
            );
          }
        })}
      </ul>
    </div>
  );
};

export default Messages;

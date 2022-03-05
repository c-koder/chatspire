import moment from "moment";
import { useContext } from "react";

import { AuthContext } from "../helpers/AuthContext";
import Message from "./Message";

const Messages = ({ messages, chattingWithUser }) => {
  const { currentUser } = useContext(AuthContext);
  let previousDate = "";

  const displayDate = (timestamp) => {
    const previousValue = moment().diff(
      moment(previousDate, "YYYY-MM-DD HH:mm:ss"),
      "days"
    );

    const previousValueInHours = moment().diff(
      moment(previousDate, "YYYY-MM-DD HH:mm:ss"),
      "hours"
    );

    const currentValue = moment().diff(
      moment(timestamp, "YYYY-MM-DD HH:mm:ss"),
      "days"
    );

    const currentValueInHours = moment().diff(
      moment(timestamp, "YYYY-MM-DD HH:mm:ss"),
      "hours"
    );

    if (
      previousValueInHours !== currentValueInHours &&
      previousValue !== currentValue
    ) {
      if (currentValueInHours < 12) return "Today";
      else if (currentValueInHours >= 12 && currentValueInHours <= 36)
        return "Yesterday";
      else return moment(timestamp, "YYYY-MM-DD HH:mm:ss").format("MM/DD/YYYY");
    }
  };

  const populateMessages = () => {
    return messages.map((message, i) => {
      if (
        message.receiver_id === chattingWithUser.id ||
        message.sender_id === chattingWithUser.id
      ) {
        previousDate = i > 0 && messages[i - 1].timestamp;
        return (
          <div key={message.id}>
            {displayDate(message.timestamp) !== undefined && (
              <center>
                <span className="lbl-date">
                  {displayDate(message.timestamp)}
                </span>
              </center>
            )}
            <Message
              message={message}
              isUserMessage={currentUser.uid === message.sender_id}
            />
          </div>
        );
      } else {
        return null;
      }
    });
  };

  return (
    <div className="chat-history">
      <ul className="m-b-0">{populateMessages()}</ul>
    </div>
  );
};

export default Messages;

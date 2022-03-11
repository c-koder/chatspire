import moment from "moment";
import { useContext } from "react";

import { AuthContext } from "../helpers/AuthContext";
import Message from "./Message";

const Messages = ({ messages, chattingWithUser }) => {
  const { currentUser } = useContext(AuthContext);
  let previous_timestamp = "";

  const displayDate = (timestamp) => {
    const previousValue = moment().diff(
      moment(previous_timestamp, "YYYY-MM-DD HH:mm:ss"),
      "days"
    );

    const currentValue = moment().diff(
      moment(timestamp, "YYYY-MM-DD HH:mm:ss"),
      "days"
    );

    if (currentValue !== previousValue) return calculateDateDiff(timestamp);
  };

  function calculateDateDiff(date) {
    let fromNow = moment(date, "YYYY-MM-DD HH:mm:ss").fromNow();

    return moment(date).calendar(null, {
      lastWeek: "[Last] dddd",
      lastDay: "[Yesterday]",
      sameDay: "[Today]",
      nextDay: "[Tomorrow]",
      nextWeek: "dddd",
      sameElse: () => {
        return "[" + fromNow + "]";
      },
    });
  }

  const populateMessages = () => {
    return messages.map((message, i) => {
      if (
        message.receiver_id === chattingWithUser.id ||
        message.sender_id === chattingWithUser.id
      ) {
        previous_timestamp = i > 0 && messages[i - 1].timestamp;
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

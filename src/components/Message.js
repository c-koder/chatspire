import moment from "moment";
import { useEffect, useState } from "react";

const Message = ({ message, isUserMessage }) => {
  const [displayTime, setDisplayTime] = useState(true);

  useEffect(() => {
    setDisplayTime(
      moment().diff(
        moment(message.time).format("YYYY-MM-DD HH:mm:ss"),
        "minutes"
      ) > 1
    );
  }, []);

  const convertedTime = moment(message.time).format("HH:mm");

  return (
    <li className="clearfix">
      <div
        className={
          isUserMessage
            ? "message my-message float-right"
            : "message other-message"
        }
      >
        {message.context}
        <br />
        {displayTime && (
          <span className="message-data-time">{convertedTime}</span>
        )}
      </div>
    </li>
  );
};

export default Message;

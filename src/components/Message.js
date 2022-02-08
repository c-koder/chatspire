import moment from "moment";
import { useEffect, useState } from "react";

const Message = ({ message, isUserMessage }) => {
  const [displayTime, setDisplayTime] = useState(true);

  /**
   * Determining whether the timestamp on a message should be display or not.
   * Compares the difference between the current time and the time when the message was sent.
   * Resulting value being greater than one means timestamp should be displayed and if not otherwise.
   */
  useEffect(() => {
    setDisplayTime(
      moment().diff(
        moment(message.time).format("YYYY-MM-DD HH:mm:ss"),
        "minutes"
      ) > 1
    );
  }, []);

  /**
   * Conversion of the time from YYYY-MM-DD HH:mm:ss into HH:mm.
   * Which results in displaying only the hours and minutes of the delivered message.
   */
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

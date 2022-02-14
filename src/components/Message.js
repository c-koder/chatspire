import moment from "moment";
import { messageContainsEmojis } from "../utils/validations";

const Message = ({ message, isUserMessage }) => {
  /**
   * Conversion of the time from YYYY-MM-DD HH:mm:ss into hh:mm A.
   * Which results in displaying only the hours and minutes with AM or PM,
   * of the delivered/received message.
   */
  const convertedTime = moment(message.timestamp).format("hh:mm A");

  return (
    <li className="clearfix">
      <div
        className={
          isUserMessage
            ? "message my-message float-right"
            : "message other-message"
        }
        style={{
          fontSize:
            messageContainsEmojis(message.context) &&
            message.context.length < 3 &&
            28,
        }}
      >
        {message.context}
        <span className="message-data-time"> {convertedTime}</span>
      </div>
    </li>
  );
};

export default Message;

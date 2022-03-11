import moment from "moment";
import Linkify from "react-linkify/dist/components/Linkify";
import { useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import { messageContainsEmojis } from "../utils/validations";
import MessageSettings from "./MessageSettings";

const Message = ({ message, isUserMessage }) => {
  /**
   * Conversion of the time from YYYY-MM-DD HH:mm:ss into hh:mm A.
   * Which results in displaying only the hours and minutes with AM or PM,
   * of the delivered/received message.
   */
  const { currentUser } = useContext(AuthContext);

  const context = message.context;
  const convertedTime = moment(message.timestamp).format("hh:mm A");
  const isEmojiMessage = context.replace(/<[^>]*>/g, "");
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
            messageContainsEmojis(isEmojiMessage) &&
            isEmojiMessage.length <= 4 &&
            28,
          padding:
            messageContainsEmojis(isEmojiMessage) &&
            isEmojiMessage.length <= 4 &&
            "10px 10px",
        }}
      >
        {context !== "Message deleted" && (
          <MessageSettings
            isSender={message.sender_id === currentUser.uid}
            msg_id={message.id}
          />
        )}

        {messageContainsEmojis(isEmojiMessage) && isEmojiMessage.length <= 4 ? (
          isEmojiMessage
        ) : (
          <Linkify>
            <span
              style={{
                fontStyle: context === "Message deleted" && "italic",
                opacity: context === "Message deleted" && 0.8,
              }}
            >
              {context === "Message deleted" && (
                <i className="bi bi-slash-circle"> </i>
              )}
              {context}
            </span>
          </Linkify>
        )}

        {context.includes("\n") && <br />}

        <span
          className="message-data-time"
          style={{
            marginLeft: context.includes("\n") && "0px",
            opacity: context === "Message deleted" && 0.8,
          }}
        >
          {convertedTime}
        </span>
      </div>
    </li>
  );
};

export default Message;

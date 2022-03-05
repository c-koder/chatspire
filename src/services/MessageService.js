const MessageRepository = require("../repositories/MessageRepository");

const sendMessage = async (message) => {
  return MessageRepository.sendMessage(message);
};

const getUserMessages = async () => {
  return MessageRepository.getUserMessages();
};

const getUserLastMessage = async (sender_id) => {
  return MessageRepository.getUserLastMessage(sender_id);
};

const deleteMessage = async (msg_id) => {
  return MessageRepository.deleteMessage(msg_id);
};

export { sendMessage, getUserMessages, getUserLastMessage,deleteMessage };

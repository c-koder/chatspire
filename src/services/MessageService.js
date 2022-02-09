const MessageRepository = require("../repositories/MessageRepository");

const sendMessage = async (message) => {
  return MessageRepository.sendMessage(message);
};

const getUserMessages = async () => {
  return MessageRepository.getUserMessages();
};

export { sendMessage, getUserMessages };

const UserRepository = require("../repositories/UserRepository");

const getUserByUsername = async (username) => {
  return UserRepository.getUserByUsername(username);
};

const getUserByEmail = async (email) => {
  return UserRepository.getUserByEmail(email);
};

const registerUser = async (user) => {
  return UserRepository.registerUser(user);
};

const loginUser = async (user) => {
  return UserRepository.loginUser(user);
};

const logoutUser = async () => {
  return UserRepository.logoutUser();
};

export { getUserByUsername, getUserByEmail, registerUser, loginUser, logoutUser };

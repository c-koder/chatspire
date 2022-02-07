const UserRepository = require("../repositories/UserRepository");

const getUser = async (by, value) => {
  return UserRepository.getUser(by, value);
};

const getUserFriends = async () => {
  return UserRepository.getUserFriends();
};

const registerUser = async (user) => {
  return UserRepository.registerUser(user);
};

const loginUser = async (user) => {
  return UserRepository.loginUser(user);
};

const resetUserPassword = async (email) => {
  return UserRepository.resetUserPassword(email);
};

const confirmPasswordReset = async (oobCode, newPassword) => {
  return UserRepository.confirmUserPasswordReset(oobCode, newPassword);
};

const logoutUser = async () => {
  return UserRepository.logoutUser();
};

export {
  getUser,
  getUserFriends,
  confirmPasswordReset,
  registerUser,
  loginUser,
  resetUserPassword,
  logoutUser,
};

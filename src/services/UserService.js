const UserRepository = require("../repositories/UserRepository");

/**
 * Used to fetch a user's info.
 * @param {*} by
 * Child key that is either id,username or email.
 * @param {*} value
 * Child value that needs to be compared with.
 * @returns
 * Returns a snapshot value that contains a user object.
 */
const getUser = async (by, value) => {
  return UserRepository.getUser(by, value);
};

/**
 * Used to fetch currently logged in user's friends.
 * @returns
 * Based on the current user uid, an array of user objects are returned.
 */
const getUserFriends = async () => {
  return UserRepository.getUserFriends();
};

/**
 * Registering a user in the database under users child.
 * Firebase's createUserWithEmailAndPassword() authentication method,
 * is used to further ensure a secure registration process.
 * @param {*} user
 * An object that contains a username, email and a password provided by the user via the frontend.
 * @returns
 * Returns a string if succeeded, or the error code if the process failed.
 * It'd likely fail if a user with the given email already exists;
 * Or if na unlikely database error occurs when the function is called.
 */
const registerUser = async (user) => {
  return UserRepository.registerUser(user);
};

/**
 * Handles the user login using Firebase's signInWithEmailAndPassword() authentication method.
 * @param {*} user
 * An object that contains the user's email and password provided via the frontend.
 * @returns
 * Returns a promise that resolves a user object if and only if the sign in process is verified
 * and completed, or rejects the error code.
 */
const loginUser = async (user) => {
  return UserRepository.loginUser(user);
};

/**
 * Handles the user's logout process through Firebase's signOut() method.
 * @returns
 * Returns a promise that resolves a string if and only if the logout process was a success.
 */
const logoutUser = async () => {
  return UserRepository.logoutUser();
};

/**
 * Sends a reset password link to the provided email,
 * using the Firebase's sendPasswordResetEmail() function.
 * @param {*} email
 * User's email is required to proceed with the password reset process.
 * @returns
 * Returns a promise that resolves a string if and only if the email was successfully sent,
 * or rejects the error code.
 */
const resetUserPassword = async (email) => {
  return UserRepository.resetUserPassword(email);
};

/**
 * Confirms the URL parameters that was sent to the user's email through their reset password mail.
 * If the oobCode and the auth instance is valid, the user's password can be reset.
 * @param {*} oobCode
 * A confirmation code sent to the user.
 * @param {*} newPassword
 * The new password.
 * @returns
 * Returns a promise that resolves a string if the password reset process is confirmed,
 * or rejects the error code.
 */
const confirmPasswordReset = async (oobCode, newPassword) => {
  return UserRepository.confirmUserPasswordReset(oobCode, newPassword);
};

const setUserIsTyping = async (val) => {
  return UserRepository.setUserIsTyping(val);
};

const updateUserAvatar = async (imageFile) => {
  return UserRepository.updateUserAvatar(imageFile);
};

const getUsersToSendRequests = async () => {
  return UserRepository.getUsersToSendRequests();
};

const sendFriendRequest = async (id) => {
  return UserRepository.sendFriendRequest(id);
};

const fetchFriendRequests = async () => {
  return UserRepository.fetchFriendRequests();
};

const acceptFriendRequest = async (id, friend_id) => {
  return UserRepository.acceptFriendRequest(id, friend_id);
};

const declineFriendRequest = async (id) => {
  return UserRepository.declineFriendRequest(id);
};

const updateUser = async (
  avatar,
  username,
  bio,
  email_visibility,
  twitter,
  facebook,
  instagram,
  linkedin
) => {
  return UserRepository.updateUser(
    avatar,
    username,
    bio,
    email_visibility,
    twitter,
    facebook,
    instagram,
    linkedin
  );
};

export {
  getUser,
  getUserFriends,
  confirmPasswordReset,
  registerUser,
  loginUser,
  resetUserPassword,
  setUserIsTyping,
  updateUserAvatar,
  getUsersToSendRequests,
  sendFriendRequest,
  fetchFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  updateUser,
  logoutUser,
};

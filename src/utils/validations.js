/**
 * Checks whether a username consists of any symbols or extra characters.
 * @param {*} username
 * The username that needs to be validated.
 * @returns
 * Returns a boolean whether the username consists such special chars or not.
 */
const invalidUsername = (username) => {
  const format = /[ `!@#$%^&*()_+\-=[]{};':"\\|,.<>\/?~]/;
  return username.match(format);
};

/**
 * Checks whether an email is of proper and valid format.
 * @param {*} username
 * The email that needs to be validated.
 * @returns
 * Returns a boolean whether the email matches the format or not.
 */
const validEmail = (email) => {
  const format = /^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$/;
  return email.match(format);
};

/**
 * Checks whether a password consists of any symbols or extra characters and is over 6 chars.
 * @param {*} username
 * The password that needs to be validated.
 * @returns
 * Returns a boolean whether the password matches the intended format.
 */
const validPassword = (pwd) => {
  const format = /^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$/;
  return pwd.match(format);
};

export { invalidUsername, validEmail, validPassword };

const invalidUsername = (username) => {
  const format = /[ `!@#$%^&*()_+\-=[]{};':"\\|,.<>\/?~]/;
  return username.match(format);
};

const validEmail = (email) => {
  const format = /^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$/;
  return email.match(format);
};

const validPassword = (pwd) => {
  const format = /^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$/;
  return pwd.match(format);
};

export { invalidUsername, validEmail, validPassword };

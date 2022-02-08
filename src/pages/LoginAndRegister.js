import "../styles/login.css";
import "../styles/loader.css";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  invalidUsername,
  validEmail,
  validPassword,
} from "../utils/validations";
import PasswordStrengthMeter from "../utils/PasswordStrengthMeter";
import { pageLoadVariants } from "../utils/animationVariants";
import { Link } from "react-router-dom";

const UserService = require("../services/UserService");

const LoginAndRegister = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [registerError, setRegisterError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [errorClass, setErrorClass] = useState("error");

  const [usernameExists, setUsernameExists] = useState(false);

  const [loading, setLoading] = useState(false);

  /**
   * Whenever the registerUsername state changes, the useEffect will get called.
   * What the function getUser does is returning the snapshot value returned by the firebase query.
   * It is then checked if it's not null, thereby setting whether the username exists or not,
   * using the setUsernameExists state.
   */
  useEffect(() => {
    UserService.getUser("username", registerUsername).then((response) => {
      response !== null ? setUsernameExists(true) : setUsernameExists(false);
    });
  }, [registerUsername]);

  /**
   * User registration is handled by accumulating the username, email and the password from the user.
   * Validation processes are carried on to ensure factors that affect account clashes,
   * and other related events.
   */
  const handleRegister = (e) => {
    e.preventDefault();

    if (registerUsername === "") {
      setRegisterError("Username is required.");
    } else if (registerUsername.length < 5 || registerUsername.length > 10) {
      setRegisterError("Username must be atleast 5 chars and not over 10.");
    } else if (invalidUsername(registerUsername)) {
      setRegisterError("Username cannot contain special chars.");
    } else if (usernameExists) {
      setRegisterError("Username is not available.");
    } else if (registerEmail === "") {
      setRegisterError("Email is required.");
    } else if (!validEmail(registerEmail)) {
      setRegisterError("Invalid email format.");
    } else if (registerPassword === "") {
      setRegisterError("Password is required.");
    } else if (registerPassword.length < 6) {
      setRegisterError("Password must be atleast 6 chars.");
    } else if (!validPassword(registerPassword)) {
      setRegisterError("Password is not secure enough.");
    } else {
      const user = {
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
      };
      setLoading(true);
      UserService.registerUser(user)
        .then((response) => {
          if (response !== undefined && response !== null) {
            setErrorClass("error success");
            setRegisterError("Registration Successful");
            setRegisterUsername("");
            setRegisterEmail("");
            setRegisterPassword("");
          } else {
            setErrorClass("error");
            setRegisterError("An error occured when registering your account.");
            setRegisterPassword("");
          }
          setLoading(false);
        })
        .catch((err) => {
          if (err === "auth/email-already-in-use") {
            setRegisterError("Email already in use.");
            setRegisterPassword("");
          }
          setLoading(false);
        });
    }
  };

  /**
   * User login is handled by accumulating the email and password from the user.
   * Validations are carried to properly ensure the user's login process is a success.
   */
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginEmail === "") {
      setLoginError("Email Required");
    } else if (!validEmail(loginEmail)) {
      setLoginError("Invalid email format.");
    } else if (loginPassword === "") {
      setLoginError("Password Required");
    } else {
      const user = {
        email: loginEmail,
        password: loginPassword,
      };
      setLoading(true);
      UserService.loginUser(user)
        .then((response) => {
          if (response !== undefined && response !== null) {
            setErrorClass("error success");
            setLoginError("Successfully Logged In");
            setLoginEmail("");
            setLoginPassword("");
          } else {
            setErrorClass("error");
            setLoginError("Error encountered when loggin in.");
            setRegisterPassword("");
          }
          setLoading(false);
        })
        .catch((err) => {
          if (err === "auth/user-not-found") {
            setLoginError("User not found.");
          } else if (err === "auth/wrong-password") {
            setLoginError("Password mismatch.");
          }
          setLoading(false);
        });
    }
  };

  const errVariants = {
    hidden: {
      visibility: "hidden",
      opacity: 0,
      x: -20,
    },
    visible: {
      visibility: "visible",
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
    exit: {
      transition: { ease: "easeIn" },
    },
  };

  /**
   * Clearing a registration error occured in the interface,
   * after a delay of 5s after the state being changed.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setRegisterError("");
    }, 3500);
    return () => clearInterval(timer);
  }, [registerError]);

  /**
   * Clearing a login error shown in the interface,
   * occured after a delay of 5s after the state being changed.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setLoginError("");
    }, 3500);
    return () => clearInterval(timer);
  }, [loginError]);

  return (
    <motion.div
      className="main centered"
      variants={pageLoadVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <input type="checkbox" id="chk" />
      <div className="signup">
        <form>
          <label htmlFor="chk">Register</label>
          <motion.input
            type="text"
            placeholder="Username"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
            whileFocus={{ opacity: 1 }}
          />
          <motion.input
            type="text"
            placeholder="Email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            whileFocus={{ opacity: 1 }}
          />
          <motion.input
            type="password"
            placeholder="Password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            whileFocus={{ opacity: 1 }}
            style={{ borderRadius: "5px 5px 0px 0px" }}
          />
          <PasswordStrengthMeter password={registerPassword} />
          <button onClick={handleRegister}>Register</button>
        </form>

        {loading && (
          <div className="ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}

        {registerError !== "" && (
          <motion.span
            variants={errVariants}
            initial="hidden"
            animate={registerError !== "" ? "visible" : "hidden"}
            exit="exit"
            className={errorClass}
          >
            {registerError}
          </motion.span>
        )}
      </div>

      <div className="login">
        <form>
          <label htmlFor="chk">Login</label>
          <motion.input
            type="text"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            whileFocus={{ opacity: 1 }}
          />
          <motion.input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            whileFocus={{ opacity: 1 }}
          />
          <center>
            <Link to="/resetpassword" className="link">
              Forgot password?
            </Link>{" "}
          </center>
          <button onClick={handleLogin}>Login</button>
        </form>

        {loading && (
          <div className="ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}

        {loginError !== "" && (
          <motion.span
            variants={errVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={errorClass}
          >
            {loginError}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
};

export default LoginAndRegister;

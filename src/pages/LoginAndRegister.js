import "../styles/login.css";
import "../styles/loader.css";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  invalidUsername,
  validEmail,
  validPassword,
} from "../constants/validations";
import PasswordStrengthMeter from "../utils/PasswordStrengthMeter";
import { pageLoadVariants } from "../constants/animationVariants";

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

  useEffect(() => {
    UserService.getUserByUsername(registerUsername).then((response) => {
      response ? setUsernameExists(true) : setUsernameExists(false);
    });
  }, [registerUsername]);

  const handleRegister = (e) => {
    e.preventDefault();

    if (registerUsername === "") {
      setRegisterError("Username is required."); //empty username
    } else if (registerUsername.length < 5) {
      setRegisterError("Username must be atleast 5 chars."); //username < 5 chars
    } else if (invalidUsername(registerUsername)) {
      setRegisterError("Username cannot contain special chars."); //username contain special chars
    } else if (usernameExists) {
      setRegisterError("Username is not available."); //username already in use
    } else if (registerEmail === "") {
      setRegisterError("Email is required."); //empty email
    } else if (!validEmail(registerEmail)) {
      setRegisterError("Invalid email format."); //invalid email format
    } else if (registerPassword === "") {
      setRegisterError("Password is required."); //empty pwd
    } else if (registerPassword.length < 6) {
      setRegisterError("Password must be atleast 6 chars."); //pwd < 6 chars
    } else if (!validPassword(registerPassword)) {
      setRegisterError("Password is not secure enough."); //pwd is not secure enough
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
            //re-route
          } else {
            setErrorClass("error");
            setRegisterError("An error occured when registering your account.");
            setRegisterPassword("");
          }
        })
        .catch((err) => {
          if (err === "auth/email-already-in-use") {
            setRegisterError("Email already in use.");
            setRegisterPassword("");
          }
        });
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginEmail === "") {
      setLoginError("Email Required"); //empty email
    } else if (!validEmail(loginEmail)) {
      setLoginError("Invalid email format."); //invalid email format
    } else if (loginPassword === "") {
      setLoginError("Password Required"); //empty pwd
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
        })
        .catch((err) => {
          if (err === "auth/user-not-found") {
            setLoginError("User not found.");
          } else if (err === "auth/wrong-password") {
            setLoginError("Password mismatch.");
          }
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

  useEffect(() => {
    const timer = setInterval(() => {
      setRegisterError("");
    }, 3500);
    return () => clearInterval(timer);
  }, [registerError]);

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
          <div class="ring">
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
          <button onClick={handleLogin}>Login</button>
        </form>

        {loading && (
          <div class="ring">
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

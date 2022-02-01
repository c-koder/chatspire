import "../styles/login.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { v1 as uuid } from "uuid";
const DataService = require("../services/DataService");

const LoginComponent = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [registerError, setRegisterError] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (registerUsername === "") {
      setRegisterError("Username Required");
    } else {
      const user = {
        id: uuid(),
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
      };

      DataService.registerUser(user)
        .then(() => {
          console.log("User Registered");
          setRegisterUsername("");
          setRegisterEmail("");
          setRegisterPassword("");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginEmail === "") {
      setLoginError("Email Required");
    } else {
      const user = {
        email: loginEmail,
        password: loginPassword,
      };

      DataService.loginUser(user)
        .then((response) => {
          if (response == null) {
            console.log("error!");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const containerVariants = {
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
    }, 4000);
    return () => clearInterval(timer);
  }, [registerError]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoginError("");
    }, 4000);
    return () => clearInterval(timer);
  }, [loginError]);

  return (
    <div className="main">
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
          />
          <button onClick={handleRegister}>Register</button>
          {registerError != "" && (
            <motion.span
              variants={containerVariants}
              initial="hidden"
              animate={registerError != "" ? "visible" : "hidden"}
              exit="exit"
              className="error"
            >
              {registerError}
            </motion.span>
          )}
        </form>
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
          {loginError != "" && (
            <motion.span
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="error"
            >
              {loginError}
            </motion.span>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;

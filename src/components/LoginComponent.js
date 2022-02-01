import "../styles/login.css";
import { motion } from "framer-motion";
import { useState } from "react";
import { v1 as uuid } from "uuid";
const DataService = require("../services/DataService");

const LoginComponent = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [error, setError] = useState("Error!");

  const handleRegister = (e) => {
    e.preventDefault();
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
  };

  const handleLogin = (e) => {
    e.preventDefault();

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
  };

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
          <span className="error">{error}</span>
          <button onClick={handleRegister}>Register</button>
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
          <span className="error">{error}</span>
          <button onClick={handleLogin}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;

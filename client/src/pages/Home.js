import React, { useState } from "react";
import logo from "../assets/logo.png";
import LoginComponent from "../components/LoginComponent";
const Home = () => {
  const [logoHidden, setLogoHidden] = useState(false);

  setTimeout(() => setLogoHidden(true), 2500);

  return (
    <div className="centered">
      <LoginComponent />
      {/* {!logoHidden ? (
        <div>
          <img alt="logo" src={logo} style={{ height: "100px" }} />
          <h3 style={{ textAlign: "center", letterSpacing: 2 }}>
            Your modern chat app!
          </h3>
        </div>
      ) : (
        <LoginComponent />
      )} */}
    </div>
  );
};

export default Home;

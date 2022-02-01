import React, { useState } from "react";
import "../styles/login.css";

const LoginComponent = () => {
  const [containerClass, setContainerClass] = useState("container");

  const swapToSignUp = (e) => {
    e.preventDefault();
    setContainerClass("container right-panel-active");
  };

  const swapToSignIn = (e) => {
    e.preventDefault();
    setContainerClass("container");
  };

  return (
    <div class={containerClass}>
      {/* sign up */}
      <div class="form-container sign-up-container">
        <form action="#">
          <h1>Create Account</h1>
          <span>Register your chatspire account</span>
          <input type="text" placeholder="Username" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Register</button>
        </form>
      </div>
      {/* sign in */}
      <div class="form-container sign-in-container">
        <form action="#">
          <h1>Log in</h1>
          <span>Login to see your new chats.</span>
          <input type="email" placeholder="Username/Email" />
          <input type="password" placeholder="Password" />
          <a href="#">Forgot your password?</a>
          <button>Login</button>
        </form>
      </div>
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your credentials.</p>
            <button class="ghost" onClick={swapToSignIn}>
              Login
            </button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>Hey Bud!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button class="ghost" onClick={swapToSignUp}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;

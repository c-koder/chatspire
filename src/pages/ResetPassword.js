import "../styles/reset.css";
import "../styles/loader.css";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { validEmail, validPassword } from "../utils/validations";
import { errVariants, pageLoadVariants } from "../utils/animationVariants";
import { useLocation, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../utils/PasswordStrengthMeter";

const UserService = require("../services/UserService");

/**
 * This custom hook returns parameters found in the URL.
 */
const useQuery = () => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [resetError, setResetError] = useState("");
  const [errorClass, setErrorClass] = useState("error");

  const [loading, setLoading] = useState(false);

  const query = useQuery();

  /**
   * User password reset process is handled by accumulating the user email.
   * A password reset mail is forwarded to the provided email,
   * if and only if such a user with the given email exists.
   * In an event where the email is not found, user will be notified.
   * Otherwise, when the user has arrived at the link provided through the password reset mail,
   * they are redirected to the site enabling them to set a new password.
   */
  const handleReset = (e) => {
    e.preventDefault();
    if (resetEmail === "") {
      setResetError("Email Required");
    } else if (!validEmail(resetEmail)) {
      setResetError("Invalid email format.");
    } else {
      setLoading(true);
      UserService.resetUserPassword(resetEmail)
        .then((response) => {
          if (response !== null) {
            setErrorClass("error success");
            setResetError("Password reset mail sent to your email.");
            setResetEmail("");
          }
          setLoading(false);
        })
        .catch((err) => {
          if (err === "auth/user-not-found") {
            setResetError("Email not found.");
            setLoading(false);
          }
        });
    }
  };

  /**
   * User password reset process is then continued after the user has provided a new password.
   * Once the basic validation processes are complete, a firebase method will be called,
   * where the provided authentication instance, oobCode, and the new password are validated,
   * and if valid, the user's password will be reset and not otherwise.
   */
  const handleConfirmReset = (e) => {
    e.preventDefault();
    if (newPassword === "") {
      setResetError("Password Required");
    } else if (newPassword.length < 6) {
      setResetError("Password must be atleast 6 chars.");
    } else if (!validPassword(newPassword)) {
      setResetError("Password is not secure enough.");
    } else {
      setLoading(true);
      UserService.confirmPasswordReset(query.get("oobCode"), newPassword)
        .then((response) => {
          if (response !== null) {
            setErrorClass("error success");
            setResetError("Password changed successfully.");
            setNewPassword("");
            setTimeout(() => navigate("/"), 1500);
          }
          setLoading(false);
        })
        .catch((err) => {
          setResetError(
            "Could not change the password, possible because the link had expired."
          );
          setLoading(false);
        });
    }
  };

  /**
   * Clearing a reset error shown in the interface,
   * occured after a delay of 5s after the state being changed.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setResetError("");
    }, 3500);
    return () => clearInterval(timer);
  }, [resetError]);

  return (
    <motion.div
      className="reset centered"
      variants={pageLoadVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <form>
        <label>Reset Password</label>
        {query.get("mode") === null && (
          <motion.input
            type="text"
            placeholder="Email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            whileFocus={{ opacity: 1 }}
          />
        )}
        {query.get("mode") === "resetPassword" && (
          <div>
            <motion.input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              whileFocus={{ opacity: 1 }}
              style={{ borderRadius: "5px 5px 0px 0px" }}
            />
            <PasswordStrengthMeter password={newPassword} />
          </div>
        )}
        {query.get("mode") === "resetPassword" ? (
          <button onClick={handleConfirmReset}>Change Password</button>
        ) : (
          <button onClick={handleReset}>Send Reset Email</button>
        )}
      </form>

      {loading && (
        <div className="ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}

      {resetError !== "" && (
        <motion.span
          variants={errVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={errorClass}
        >
          {resetError}
        </motion.span>
      )}
    </motion.div>
  );
};

export default ResetPassword;

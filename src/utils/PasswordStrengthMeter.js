import zxcvbn from "zxcvbn";
import "../styles/pwd-meter.css";

const PasswordStrengthMeter = ({ password }) => {
  const testedResult = zxcvbn(password);

  const createPasswordLabel = (result) => {
    switch (result.score) {
      case 0:
        return "Weak";
      case 1:
        return "Fair";
      case 2:
        return "Good";
      case 3:
        return "Strong";
      default:
        return "Weak";
    }
  };

  return (
    <div className="password-strength-meter">
      <progress
        className={`password-strength-meter-progress strength-${createPasswordLabel(
          testedResult
        )}`}
        value={testedResult.score}
        max="4"
      />
    </div>
  );
};

export default PasswordStrengthMeter;

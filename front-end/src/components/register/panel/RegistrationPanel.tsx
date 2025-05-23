// components/register/panel/RegistrationPanel.tsx
import React, { useState, useEffect } from "react";
import InputCustom from "../../input/InputCustom"; // Adjust path
import InputCheckbox from "../../input/InputCheckbox"; // Adjust path
import { AccountDetails } from "../../../types/userRegister.d"; // Adjust path

interface Props {
  initialEmail: string;
  initialPassword?: string; // To prefill password if user goes back and forth (optional)
  onAccountSubmit: (accountDetails: AccountDetails) => void;
}

const RegistrationPanel: React.FC<Props> = ({
  initialEmail,
  initialPassword = "", // Default to empty
  onAccountSubmit,
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword); // Local state for password input
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [agreedError, setAgreedError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showConfirmPasswordInput, setShowConfirmPasswordInput] =
    useState(false);

  // Sync email from parent if it changes (e.g., if parent resets form)
  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  useEffect(() => {
    setPassword(initialPassword); // Sync password if needed, e.g. on back navigation
  }, [initialPassword]);

  const validate = () => {
    // ... (your existing validation logic for email, password, confirmPassword, agreed)
    // This logic seems fine as is, just ensure it uses local `email` and `password` states.
    if (!email.trim()) {
      setEmailError("Email is required.");
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format.");
      return "Invalid email format";
    }

    if (!password) {
      setPasswordError("Password is required.");
      return "Password is required";
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return "Password must be at least 8 characters";
    }
    const passwordComplexity =
      /[a-zA-Z]/.test(password) &&
      /\d/.test(password) &&
      /[^a-zA-Z0-9]/.test(password);
    if (!passwordComplexity) {
      setPasswordError("Password must contain letters, numbers, and symbols.");
      return "Password must contain letters, numbers, and symbols";
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return "Passwords do not match";
    }
    if (!agreed) {
      setAgreedError("You must agree to the Terms and Privacy Policy.");
      return "You must agree to the Terms and Privacy Policy";
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setAgreedError("");
    setGeneralError("");

    const validationMessage = validate();
    if (validationMessage) {
      // Error handling logic as you have it is fine for local errors
      if (validationMessage.toLowerCase().includes("email"))
        setEmailError(validationMessage);
      else if (validationMessage.toLowerCase().includes("password"))
        setPasswordError(validationMessage);
      else if (validationMessage.startsWith("Passwords do not match"))
        setConfirmPasswordError(validationMessage);
      else if (validationMessage.startsWith("You must agree"))
        setAgreedError(validationMessage);
      else setGeneralError(validationMessage);
      // Optionally focus on the first error field here
      return;
    }
    onAccountSubmit({ email, password }); // Submit the locally managed email and password
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 text-white w-full sm:w-[600px] lg:w-[600px] mx-auto">
      <InputCustom
        label="Email Address"
        name="email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailError("");
          setGeneralError("");
        }}
        isRequired
        errorMessage={emailError}
      />
      <div>
        <InputCustom
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError("");
            setGeneralError("");
          }}
          isRequired
          errorMessage={passwordError}
          showPassword={showPasswordInput}
          setShowPassword={setShowPasswordInput}
        />
        <p className="text-xs text-gray-400 mt-1">
          Min. 8 characters with letters, numbers, & symbols.
        </p>
      </div>
      <InputCustom
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setConfirmPasswordError("");
          setGeneralError("");
        }}
        isRequired
        errorMessage={confirmPasswordError}
        showPassword={showConfirmPasswordInput}
        setShowPassword={setShowConfirmPasswordInput}
      />
      <div>
        <div className="flex items-center space-x-2">
          <InputCheckbox
            name="agreed"
            label=""
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              setAgreedError("");
              setGeneralError("");
            }}
          />
          <label htmlFor="agreed" className="text-sm cursor-pointer">
            I agree to the{" "}
            <button type="button" className="text-orange-500 hover:underline">
              Terms
            </button>{" "}
            and{" "}
            <button type="button" className="text-orange-500 hover:underline">
              Policy
            </button>
          </label>
        </div>
        {agreedError && (
          <p className="text-sm text-red-500 mt-1">{agreedError}</p>
        )}
      </div>
      {generalError && <p className="text-sm text-red-500">{generalError}</p>}
      <button
        type="submit"
        className="w-full py-2 bg-orange-500 hover:bg-orange-600 transition rounded text-white font-semibold">
        Continue
      </button>
    </form>
  );
};
export default RegistrationPanel;

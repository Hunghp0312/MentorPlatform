import React, { useState } from "react";
import InputCustom from "../../input/InputCustom"; // Adjust path as needed
import InputCheckbox from "../../input/InputCheckbox"; // Adjust path as needed

interface Props {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  onNext: () => void;
}

const RegistrationPanel: React.FC<Props> = ({
  email,
  password,
  setEmail,
  setPassword,
  onNext,
}) => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Specific error states for each field
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [agreedError, setAgreedError] = useState("");
  const [generalError, setGeneralError] = useState(""); // For errors not specific to a field

  // State for password visibility toggles
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showConfirmPasswordInput, setShowConfirmPasswordInput] =
    useState(false);

  // Validate function remains largely the same, using component's state and props
  const validate = () => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format";

    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    const passwordComplexity =
      /[a-zA-Z]/.test(password) &&
      /\d/.test(password) &&
      /[^a-zA-Z0-9]/.test(password);
    if (!passwordComplexity) {
      return "Password must contain letters, numbers, and symbols";
    }

    if (password !== confirmPassword) return "Passwords do not match";
    if (!agreed) return "You must agree to the Terms and Privacy Policy";

    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset all errors first
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setAgreedError("");
    setGeneralError("");

    const validationMessage = validate();
    if (validationMessage) {
      if (validationMessage.toLowerCase().includes("email")) {
        setEmailError(validationMessage);
      } else if (
        validationMessage.startsWith(
          "Password must be at least 8 characters"
        ) ||
        validationMessage.startsWith("Password is required") ||
        validationMessage.startsWith(
          "Password must contain letters, numbers, and symbols"
        )
      ) {
        setPasswordError(validationMessage);
      } else if (validationMessage.startsWith("Passwords do not match")) {
        setConfirmPasswordError(validationMessage);
      } else if (validationMessage.startsWith("You must agree")) {
        setAgreedError(validationMessage);
      } else {
        setGeneralError(validationMessage);
      }
      return;
    }
    onNext();
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
        placeholder="you@example.com"
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailError("");
          setGeneralError("");
        }}
        isRequired
        errorMessage={emailError}
        className="w-full"
      />

      <div>
        <InputCustom
          label="Password"
          name="password"
          type="password"
          value={password}
          placeholder="••••••••"
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
          Password must be at least 8 characters with a mix of letters, numbers,
          and symbols
        </p>
      </div>

      <InputCustom
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={confirmPassword}
        placeholder="••••••••"
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
          {}
          <label htmlFor="agreed" className="text-sm cursor-pointer">
            I agree to the{" "}
            <button type="button" className="text-orange-500 hover:underline">
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              className="text-orange-500 hover:underline p-0 bg-transparent border-none cursor-pointer">
              Privacy Policy
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
        Continue to Profile Setup
      </button>
    </form>
  );
};

export default RegistrationPanel;

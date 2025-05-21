import React, { useState } from "react";

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
  const [error, setError] = useState("");

  const validate = () => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format";

    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    const passwordComplexity =
      /[a-zA-Z]/.test(password) &&
      /[0-9]/.test(password) &&
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
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-white">
      <div>
        <label className="block text-sm mb-1">Email Address</label>
        <input
          type="email"
          value={email}
          placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          value={password}
          placeholder="••••••••"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-orange-500"
        />
        <p className="text-xs text-gray-400 mt-1">
          Password must be at least 8 characters with a mix of letters, numbers,
          and symbols
        </p>
      </div>

      <div>
        <label className="block text-sm mb-1">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          placeholder="••••••••"
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="form-checkbox accent-orange-500"
        />
        <span className="text-sm">
          I agree to the{" "}
          <a href="#" className="text-orange-500 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-orange-500 hover:underline">
            Privacy Policy
          </a>
        </span>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        className="w-full py-2 bg-orange-500 hover:bg-orange-600 transition rounded text-white font-semibold">
        Continue to Profile Setup
      </button>
    </form>
  );
};

export default RegistrationPanel;

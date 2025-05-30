import React, { useState } from "react";
import InputCustom from "../../input/InputCustom";
import InputCheckbox from "../../input/InputCheckbox";
import { AccountDetails } from "../../../types/userRegister";
import { pathName } from "../../../constants/pathName";
import { Link } from "react-router-dom";

type Props = {
  initialEmail: string;
  initialPassword: string;
  onAccountSubmit: (accountDetails: AccountDetails) => void;
};

const RegistrationPanel: React.FC<Props> = ({
  initialEmail,
  initialPassword,
  onAccountSubmit,
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errs.email = "Please fill in this field";
    } else if (trimmedEmail.length < 6 || trimmedEmail.length > 100) {
      errs.email = "Please enter between 6-100 characters.";
    } else if (!trimmedEmail.includes("@")) {
      errs.email = `Please enter a ‘@’, ‘${trimmedEmail}’ is missing an ‘@’.`;
    } else {
      const [username, domain] = trimmedEmail.split("@");
      if (!username) {
        errs.email = `Please enter a part followed by ‘@’. ‘@${domain}’ is incomplete.`;
      } else if (!domain) {
        errs.email = `Please enter a part following ‘@’. ‘${username}@’ is incomplete.`;
      } else if (!emailRegex.test(trimmedEmail)) {
        errs.email = `Please enter a valid email address. ‘${trimmedEmail}’ is invalid`;
      }
    }

    if (!password) {
      errs.password = "Please fill in this field";
    } else if (password.length > 100) {
      errs.password = "Please enter between 8-100 characters.";
    } else if (
      password.length < 8 ||
      !/[A-Za-z]/.test(password) ||
      !/\d/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      errs.password =
        "Password must be at least 8 characters with a mix of letters, numbers, and symbols";
    }
    if (!confirm) {
      errs.confirm = "Please fill in this field";
    } else if (confirm.length < 8 || confirm.length > 100) {
      errs.confirm = "Please enter between 8-100 characters.";
    } else if (password !== confirm) {
      errs.confirm = "Passwords don’t match";
    }

    if (!agreed) {
      errs.agreed =
        "Please read and agree to our terms of service and privacy policies.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    onAccountSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputCustom
        label="Email"
        name="email"
        type="text"
        value={email}
        onChange={(e) => {
          const value = e.target.value;
          if (value.length <= 100) {
            setEmail(value);
            setErrors({ email: "" });
          } else {
            setErrors({ email: "Please enter between 6-100 characters." });
          }
        }}
        errorMessage={errors.email}
      />
      <div className="space-y-0.5">
        <InputCustom
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 100) {
              setPassword(value);
              setErrors({ password: "" });
            } else {
              setErrors({ password: "Please enter between 8-100 characters." });
            }
          }}
          errorMessage={errors.password}
          placeholder=""
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
      </div>

      <InputCustom
        label="Confirm Password"
        name="confirm"
        type="password"
        value={confirm}
        onChange={(e) => {
          const value = e.target.value;

          if (value.length <= 100) {
            setConfirm(value);
            setErrors({ confirm: "" });
          } else {
            setErrors({ confirm: "Please enter between 8-100 characters." });
          }
        }}
        errorMessage={errors.confirm}
        showPassword={showConfirmPassword}
        setShowPassword={setShowConfirmPassword}
      />

      <div className="flex items-center">
        <InputCheckbox
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          name="agreed"
          label={""}
        />
        <label className="ml-2 text-sm">
          By continuing, you agree to our{" "}
          <a href="/terms-of-service" className="text-orange-500 underline">
            Terms of Service
          </a>
          {" and "}
          <a href="/privacy-policy" className="text-orange-500 underline">
            Privacy Policy
          </a>
        </label>
      </div>
      {errors.agreed && (
        <p className="text-sm text-red-500 mt-1">{errors.agreed}</p>
      )}
      <button type="submit" className="w-full py-2 bg-orange-500 rounded">
        Continue
      </button>
      <p className="text-sm text-center text-slate-400 mt-4">
        Already have an account?{" "}
        <Link
          to={pathName.login}
          className="font-medium text-orange-400 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegistrationPanel;

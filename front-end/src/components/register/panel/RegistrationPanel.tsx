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

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = "Email required";
    if (!password) errs.password = "Password required";
    if (password !== confirm) errs.confirm = "Passwords must match";
    if (!agreed) errs.agreed = "You must agree";
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
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        errorMessage={errors.email}
      />
      <InputCustom
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        errorMessage={errors.password}
      />
      <InputCustom
        label="Confirm Password"
        name="confirm"
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        errorMessage={errors.confirm}
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
      {errors.agreed && <p className="text-xs text-red-500">{errors.agreed}</p>}
      <button type="submit" className="w-full py-2 bg-orange-500 rounded">
        Continue
      </button>
      <p className="text-sm text-center text-slate-400 mt-4">
        Already have an account?{" "}
        <Link
          to={pathName.login}
          className="font-medium text-orange-400 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
};

export default RegistrationPanel;

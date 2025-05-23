// LoginPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import InputCustom from "../../components/input/InputCustom";
import InputCheckbox from "../../components/input/InputCheckbox";
import { FaGoogle, FaGithub, FaLinkedin } from "react-icons/fa";
import { pathName } from "../../constants/pathName";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }
    console.log("Login attempt:", { email, password, rememberMe });
    setTimeout(() => {
      if (email === "fail@example.com") setError("Invalid credentials.");
      else alert(`Login successful (simulated) for ${email}`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 justify-start">
      {" "}
      <div className="w-full max-w-md px-6 py-8 bg-slate-800 rounded-2xl shadow-2xl mt-8">
        {" "}
        {/* Reduced mt-16 to mt-8, py-10 to py-8 */}
        <h2 className="text-3xl font-bold mb-2 text-white text-center">
          Welcome Back
        </h2>
        <p className="text-slate-400 mb-6 text-center">
          Sign in to continue to your account
        </p>
        {/* Reduced space between form elements (space-y-4) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputCustom
            label="Email Address"
            name="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            isRequired
            errorMessage={
              error?.toLowerCase().includes("email") ? error : undefined
            }
          />
          <div>
            <InputCustom
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              isRequired
              errorMessage={
                error &&
                error.toLowerCase().includes("password") &&
                !error.toLowerCase().includes("email")
                  ? error
                  : undefined
              }
              showPassword={showPasswordInput}
              setShowPassword={setShowPasswordInput}
            />
            <div className="text-right mt-1">
              <Link
                to={pathName.forgotPassword}
                className="text-sm text-orange-400 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          {error &&
            !error.toLowerCase().includes("email") &&
            !error.toLowerCase().includes("password") && (
              <p className="text-sm text-red-400 text-center bg-red-900 bg-opacity-30 p-2 rounded-md">
                {error}
              </p>
            )}

          <InputCheckbox
            label="Remember me"
            name="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-orange-500 disabled:opacity-60">
            {" "}
            {/* Reduced py-3 to py-2.5 */}
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        {/* Reduced margin (my-4) */}
        <div className="my-4 text-center">
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-500">
                or continue with
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500">
            {" "}
            {/* Reduced py-2.5 to py-2 */}
            <FaGoogle size={18} />
            <span className="hidden sm:inline">Google</span>
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500">
            <FaGithub size={18} />
            <span className="hidden sm:inline">GitHub</span>
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500">
            <FaLinkedin size={18} />
            <span className="hidden sm:inline">LinkedIn</span>
          </button>
        </div>
        {/* Reduced margin (mt-6) */}
        <div className="mt-6 text-center text-sm text-slate-400">
          Don’t have an account?{" "}
          <Link
            to={pathName.register}
            className="font-medium text-orange-400 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
      <div className="absolute bottom-8 text-center w-full px-4">
        <p className="text-xs text-slate-500">
          By continuing, you agree to our{" "}
          <Link
            to="/terms"
            className="font-medium text-orange-400 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="font-medium text-orange-400 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;

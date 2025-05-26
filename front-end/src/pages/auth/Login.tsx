// LoginPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputCustom from "../../components/input/InputCustom";
import InputCheckbox from "../../components/input/InputCheckbox";
import { FaGoogle, FaGithub, FaLinkedin } from "react-icons/fa";
import { pathName } from "../../constants/pathName";
import { authService } from "../../services/login.service";
import { AxiosError } from "axios";
import { useAuthContext } from "../../contexts/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { setIsAuthenticated } = useAuthContext();
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [error, setError] = useState<Record<string, string>>({});
  const [loading] = useState(false);
  const navigate = useNavigate();

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

    setError(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    console.log("Login attempt:", { email, password, rememberMe });

    try {
      const response = await authService.login({ email, password });

      console.log(response);

      setIsAuthenticated(true);

      if (rememberMe) {
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("accessToken", response.accessToken);
      } else {
        sessionStorage.setItem("refreshToken", response.refreshToken);
        sessionStorage.setItem("accessToken", response.accessToken);
      }

      navigate(pathName.home);
    } catch (apiError: unknown) {
      if (apiError instanceof AxiosError) {
        const message =
          apiError.response?.data?.message ?? "Something went wrong";
        setError({ api: message }); // store under key 'api'
      }
      console.error("Forgot password error:", apiError);
    }
  };

  const handleGitHubLogin = async () => {
    try {
      await authService.githubLogin();
    } catch (error) {
      console.error("GitHub login failed:", error);
    }
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
          {error.api && (
            <p id="ApiError" className="text-red-400 text-sm text-center">
              {error.api}
            </p>
          )}
          <InputCustom
            label="Email Address"
            name="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            isRequired
            errorMessage={error.email}
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
              errorMessage={error.password}
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
            className="w-full flex items-center justify-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500"
            onClick={handleGitHubLogin}>
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

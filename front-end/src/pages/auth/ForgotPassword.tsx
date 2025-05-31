// ForgotPasswordPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Assuming React Router for navigation
import InputCustom from "../../components/input/InputCustom"; // Adjust path to your InputCustom component
import { pathName } from "../../constants/pathName";
import { authService } from "../../services/login.service";
import { AxiosError } from "axios";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(null);
    setLoading(true);

    if (!email) {
      setError("Email address is required.");
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await authService.forgotPassword({ email });
      setSuccessMessage(`${response.message}`);
    } catch (apiError: unknown) {
      if (apiError instanceof AxiosError) {
        setError(apiError.response?.data?.message);
      } else {
        setError("An unexpected error occurred.");
      }
      console.error("Forgot password error:", apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-200">
      <div className="absolute top-8 left-8 z-10">
        <h1 className="text-3xl font-bold text-orange-500">MentorConnect</h1>
      </div>

      <div className="w-full max-w-md px-6 py-10 bg-slate-800 rounded-2xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-100">Reset Password</h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter your email to receive a reset link
          </p>
        </div>

        {!successMessage ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <InputCustom
              label="Email Address"
              name="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              isRequired
              errorMessage={error}
            />
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-orange-500 disabled:opacity-60">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6 text-center">
            <p className="text-green-400">{successMessage}</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate(pathName.login)} // Or your specific login path
            className="text-sm font-medium text-orange-400 hover:text-orange-300 hover:underline">
            Back to sign in
          </button>
        </div>
      </div>
      <div className="text-xs text-center text-slate-500 mt-8">
        By continuing, you agree to our{" "}
        <Link to="/terms" className="underline hover:text-orange-400">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="underline hover:text-orange-400">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

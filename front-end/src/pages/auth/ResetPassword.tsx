import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import InputCustom from "../../components/input/InputCustom";
import { pathName } from "../../constants/pathName";

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Password reset token is missing or invalid.");
    }
  }, [token]);

  const validatePasswords = (): string | null => {
    if (!newPassword) return "New password is required.";
    if (newPassword.length < 8)
      return "Password must be at least 8 characters.";
    if (newPassword !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!token || !email) {
      setError("Invalid reset link. Token or email is missing.");
      return;
    }

    const validationError = validatePasswords();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (newPassword === "failpassword") {
        setError(
          "Failed to reset password due to a server error. Please try again."
        );
      } else {
        setSuccessMessage(
          "Your password has been reset successfully! Redirecting to login..."
        );
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => navigate("/login"), 3000);
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-xl p-8 space-y-6">
      <h2 className="text-3xl font-bold text-center text-slate-100">
        Reset Your Password
      </h2>

      {!token ? (
        <>
          <p className="text-red-400 text-center">{error}</p>
          <button
            onClick={() => navigate(pathName.login)}
            className="mt-6 w-full py-2.5 px-4 text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600">
            Back to Login
          </button>
        </>
      ) : (
        <>
          {email && (
            <p className="text-sm text-center text-slate-400">
              Enter a new password for{" "}
              <span className="text-orange-400 font-medium">{email}</span>.
            </p>
          )}

          {!successMessage ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <InputCustom
                label="New Password"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                isRequired
                errorMessage={
                  error?.toLowerCase().includes("password") &&
                  !error.toLowerCase().includes("match")
                    ? error
                    : undefined
                }
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />

              <InputCustom
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                isRequired
                errorMessage={
                  error?.toLowerCase().includes("match") ? error : undefined
                }
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
              />

              {error &&
                !error.toLowerCase().includes("password") &&
                !error.toLowerCase().includes("match") && (
                  <p className="text-sm text-center text-red-400 bg-red-900 bg-opacity-30 p-2 rounded-md">
                    {error}
                  </p>
                )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50">
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-green-400 text-lg">{successMessage}</p>
              <button
                onClick={() => navigate(pathName.login)}
                className="w-full py-2.5 px-4 text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600">
                Go to Login
              </button>
            </div>
          )}

          <div className="text-sm text-center mt-6">
            <button
              onClick={() => navigate(pathName.login)}
              className="text-orange-500 hover:text-orange-400 font-medium">
              Back to Login
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ResetPasswordPage;

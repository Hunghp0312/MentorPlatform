import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import InputCustom from "../../components/input/InputCustom";
import { pathName } from "../../constants/pathName";
import { authService } from "../../services/login.service";
import { AxiosError } from "axios";

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setError({ tokenEmail: "Password reset token is missing or invalid." });
    }
    if (!email) {
      setError({ tokenEmail: "Email is missing or invalid." });
    }
  }, [token, email]);

  const validatePasswords = () => {
    const errs: Record<string, string> = {};

    if (!newPassword) {
      errs.newpassword = "Please fill in this field";
    } else if (newPassword.length > 100) {
      errs.newpassword = "Please enter between 8-100 characters.";
    } else if (
      newPassword.length < 8 ||
      !/[A-Za-z]/.test(newPassword) ||
      !/\d/.test(newPassword) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
    ) {
      errs.password =
        "Password must be at least 8 characters with a mix of letters, numbers, and symbols";
    }

    if (!confirmPassword) {
      errs.confirmPassword = "Please enter confirm password";
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = "The confirm password must match the password";
    }

    setError(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);

    if (!validatePasswords()) return;
    try {
      if (!email || !token) {
        setError({ tokenEmail: "Token or email is not exist" });
        return;
      }

      const response = await authService.resetPassword({
        email,
        token,
        newPassword,
      });

      setTimeout(() => {
        setSuccessMessage(response.message);
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => navigate("/login"), 3000);

        setLoading(false);
      }, 1500);
    } catch (apiError: unknown) {
      if (apiError instanceof AxiosError) {
        const message =
          apiError.response?.data?.message ?? "Something went wrong";
        setError({ api: message }); // store under key 'api'
      }
      console.error("Forgot password error:", apiError);
    } finally {
      setLoading(false);
    }
    setLoading(true);
  };

  return (
    <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-xl p-8 space-y-6">
      <h2 className="text-3xl font-bold text-center text-slate-100">
        Reset Your Password
      </h2>

      {error.tokenEmail ? (
        <>
          <p className="text-red-400 text-center">{error.tokenEmail}</p>
          <button
            onClick={() => navigate(pathName.login)}
            className="mt-6 w-full py-2.5 px-4 text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600">
            Back to Login
          </button>
        </>
      ) : (
        <>
          {email && !successMessage && (
            <p className="text-sm text-center text-slate-400">
              Enter a new password for{" "}
              <span className="text-orange-400 font-medium">{email}</span>.
            </p>
          )}
          {!successMessage ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error.api && (
                <p id="ApiError" className="text-red-400 text-sm text-center">
                  {error.api}
                </p>
              )}

              <InputCustom
                label="New Password"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                isRequired
                errorMessage={error.password}
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
                errorMessage={error.confirmPassword}
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50">
                {loading ? "Resetting..." : "Reset Password"}
              </button>
              <div className="text-sm text-center mt-6">
                <button
                  onClick={() => navigate(pathName.login)}
                  className="text-orange-500 hover:text-orange-400 font-medium">
                  Back to Login
                </button>
              </div>
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
        </>
      )}
    </div>
  );
};

export default ResetPasswordPage;

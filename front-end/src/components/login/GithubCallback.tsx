import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../services/login.service";
import { AppTokenResponse } from "../../types/login";
import { pathName } from "../../constants/pathName";

const GitHubCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    if (code) {
      authService
        .githubCallback({ code })
        .then((data: AppTokenResponse) => {
          console.log("Successfully logged in with GitHub!", data);

          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);

          setIsLoading(false);
          navigate(pathName.home);
        })
        .catch((err) => {
          console.error("Backend GitHub login failed:", err);
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Login with GitHub failed. Please try again.";
          setError(errorMessage);
          setIsLoading(false);
        });
    } else {
      const errorDescription =
        searchParams.get("error_description") ||
        "GitHub authorization failed or was cancelled.";
      setError(errorDescription);
      setIsLoading(false);
    }
  }, [location, navigate]);

  if (isLoading) {
    return <div>Processing GitHub login... Please wait.</div>;
  }

  if (error) {
    return (
      <div>
        <h2>Login Error</h2>
        <p style={{ color: "red" }}>{error}</p>
        <Link
          to={pathName.login}
          className="font-medium text-orange-400 hover:underline">
          Try to login again
        </Link>
      </div>
    );
  }

  return <div>Login successful, redirecting...</div>;
};

export default GitHubCallback;

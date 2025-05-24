import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Assuming you use React Router
import { authService } from "../../services/login.service";
import { AppTokenResponse } from "../../types/login";

const GitHubCallback: React.FC = () => {
  const location = useLocation(); // Gets information about the current URL
  const navigate = useNavigate(); // For redirecting the user after login
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code"); // Get the 'code' from ?code=xxxx in the URL

    if (code) {
      // We have a code, now send it to our backend
      authService
        .githubCallback({ code })
        .then((data: AppTokenResponse) => {
          console.log("Successfully logged in with GitHub!", data);

          // TODO: Store the tokens securely
          // For example, in localStorage (consider security implications) or a state management solution
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);

          // TODO: Update your global authentication state (e.g., using React Context or Redux)
          // authContext.login(data.accessToken, data.refreshToken);

          setIsLoading(false);
          navigate("/dashboard"); // Or any other page you want to redirect to after login
        })
        .catch((err) => {
          console.error("Backend GitHub login failed:", err);
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Login with GitHub failed. Please try again.";
          setError(errorMessage);
          setIsLoading(false);
          // Optionally navigate to login page with error:
          // navigate('/login', { state: { error: errorMessage } });
        });
    } else {
      // No code found in URL, or GitHub returned an error
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
        <button onClick={() => navigate("/login")}>Try Login Again</button>
      </div>
    );
  }

  // This should ideally not be visible for long as navigation should occur
  return <div>Login successful, redirecting...</div>;
};

export default GitHubCallback;

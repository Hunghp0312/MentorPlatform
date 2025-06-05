import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { pathName } from "../../constants/pathName";
import { useAuthContext } from "../../contexts/AuthContext";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthContext();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setIsAuthenticated(true);
      navigate(pathName.home, { replace: true });
    } else {
      console.error("Missing tokens in URL");
      navigate(pathName.login, { replace: true });
    }
  }, [navigate, setIsAuthenticated]);

  return <p>Signing you in with GitHub...</p>;
};

export default OAuthCallback;

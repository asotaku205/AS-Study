import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAccessToken } from "../services/api";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");
    const isNewUser = params.get("isNewUser") === "true";

    if (!token) {
      navigate("/login");
      return;
    }

    setAccessToken(token);
    api.get("/auth/profile")
      .then((res) => {
        localStorage.setItem("user_role", res.data.role);
        if (isNewUser) {
          navigate("/setup-username");
        } else {
          navigate("/");
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  return null;
};

export default GoogleCallback;
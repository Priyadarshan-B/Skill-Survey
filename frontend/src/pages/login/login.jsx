import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import CryptoJS from "crypto-js";
import axios from "axios";
import TopBar from "../../components/applayout/TopBar";
import llogin from "../../assets/l-login.gif";
import dlogin from "../../assets/d-login.gif";
import requestApi from "../../components/utils/axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    const tokenId = credentialResponse.credential;
    const secretKey = import.meta.env.VITE_ENCRYPT_KEY;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_HOST}/auth/google/callback`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenId}`,
          },
        }
      );

      if (res.status === 200) {
        const { d } = res.data;
        localStorage.setItem("D!", d);

        const bytes = CryptoJS.AES.decrypt(d, secretKey);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        const resourceRes = await requestApi("POST", `/resource`, {
          role: decryptedData.role,
        });

        if (resourceRes.success) {
          const resources = resourceRes.data;
          if (resources.length > 0 && resources[0].path) {
            navigate(resources[0].path);
          } else {
            console.error("No path available in resources");
          }
        }
      } else {
        console.error("Login failed:", res.statusText);
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.error("Login failed")}
    />
  );
};

const Login = () => {
  const [themeGif, setThemeGif] = useState(llogin);

  useEffect(() => {
    const preferredTheme = localStorage.getItem("preferredTheme");
    setThemeGif(preferredTheme === "dark" ? dlogin : llogin);
  }, []);

  return (
    <div>
      <div className="login-top">
        <TopBar />
      </div>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <div className="login-container">
          <div className="login-card">
            <img src={themeGif} alt="login animation" className="login-gif" />
            <div className="google-login-button">
              <GoogleLoginButton />
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    </div>
  );
};

export default Login;

import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    const tokenId = credentialResponse.credential;
    const secretKey = import.meta.env.VITE_ENCRYPT_KEY;

    try {
      // Send token to backend for validation and get encrypted user data
      const res = await axios.post(
        `${import.meta.env.VITE_API_HOST}/auth/google/callback`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenId}`,
          },
        }
      );

      if (res.status === 200) {
        const { d } = res.data;
        localStorage.setItem('D!', d);

        // Decrypt user data
        const bytes = CryptoJS.AES.decrypt(d, secretKey);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        console.log('Decrypted User Data:', decryptedData);

        // Fetch resources based on role
        const resourceRes = await axios.post(
          `${import.meta.env.VITE_API_HOST}/resource`,
          { role: decryptedData.role },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokenId}`,
            },
          }
        );

        if (resourceRes.status === 200) {
          const resources = resourceRes.data;
          console.log('Resources:', resources);

          // Navigate to the path of the first resource
          if (resources.length > 0 && resources[0].path) {
            navigate(resources[0].path);
          } else {
            console.error('No path available in resources');
          }
        }
      } else {
        console.error('Login failed:', res.statusText);
      }
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.error('Login failed')}
    />
  );
};

const Login = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <h1>Google Authentication</h1>
      <GoogleLoginButton />
    </GoogleOAuthProvider>
  );
};

export default Login;

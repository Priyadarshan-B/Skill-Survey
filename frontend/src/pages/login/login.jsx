import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = () => {
  const handleSuccess = async (credentialResponse) => {
    const tokenId = credentialResponse.credential;

    try {
      const res = await fetch('http://localhost:5000/auth/google/callback', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenId}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Login successful:', data);
      } else {
        console.error('Login failed:', res.statusText);
      }
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  const handleFailure = (error) => {
    console.error('Login failed:', error);
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onFailure={handleFailure}
      logo="path_to_your_logo"
    />
  );
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <h1>Google Authentication</h1>
      <GoogleLoginButton />
    </GoogleOAuthProvider>
  );
};

export default App;

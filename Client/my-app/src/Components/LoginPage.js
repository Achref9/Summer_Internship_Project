// Path: /Project-Manager/Client/my-app/src/components/LoginPage.js

import React from 'react';

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:3002/login';
  };

  return (
    <div className="container">
      <h2 className="mt-4 mb-4">Login to GitHub</h2>
      <button className="btn btn-primary" onClick={handleLogin}>Login with GitHub</button>
    </div>
  );
};

export default LoginPage;

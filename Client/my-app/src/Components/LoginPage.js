// Path: /Project-Manager/Client/my-app/src/components/LoginPage.js

import React from 'react';

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:3002/login';
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card">
            <h5 className="card-header">Login to GitHub</h5>
            <div className="card-body text-center">
              <p className="card-text">Click below to login with your GitHub account.</p>
              <button className="btn btn-primary btn-lg" onClick={handleLogin}>
                Login with GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

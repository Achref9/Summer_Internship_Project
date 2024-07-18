import React from 'react';
import ApiService from '../config/ApiService';
import githubLogo from '../assets/majesteye.png'; // Import your image

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = `${ApiService.client.defaults.baseURL}/login`;
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card">
            <h5 className="card-header">Login to the platform using GitHub</h5>
            <div className="card-body text-center">
              <p className="card-text">Click below to login with your GitHub account.</p>
              <button className="btn btn-primary btn-lg" onClick={handleLogin}>
                Login with GitHub
              </button>
              <div className="mt-3">
                <img src={githubLogo} alt="GitHub Logo" style={{ width: '300px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

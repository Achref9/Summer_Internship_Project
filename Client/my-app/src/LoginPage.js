import React from 'react';

const Login = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:3002/login';
  };

  return (
    <div className="container mt-5">
      <h1>GitHub Repository Manager</h1>
      <button className="btn btn-primary" onClick={handleLogin}>
        Log in with GitHub
      </button>
    </div>
  );
};

export default Login;

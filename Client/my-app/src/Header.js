import React from 'react';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  let title = '';

  switch (location.pathname) {
    case '/':
      title = 'Login Page';
      break;
    case '/repos':
      title = 'Your GitHub Repositories';
      break;
    default:
      title = 'GitHub Manager';
  }

  return (
    <header className="bg-primary text-white text-center py-3">
      <h1>{title}</h1>
    </header>
  );
};

export default Header;

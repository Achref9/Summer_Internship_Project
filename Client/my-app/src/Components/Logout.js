import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from './ApiService';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await ApiService.logout();
        if (response.status === 200) {
          navigate('/');
        } else {
          console.error('Failed to logout');
        }
      } catch (err) {
        console.error('Error during logout:', err);
      }
    };

    logout();
  }, [navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;

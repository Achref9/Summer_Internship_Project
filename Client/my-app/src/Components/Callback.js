import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ApiService from './ApiService';

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authenticate = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');

      try {
        const response = await ApiService.callback(code);
        if (response.status === 200) {
          navigate('/repos');
        } else {
          console.error('Failed to authenticate');
        }
      } catch (err) {
        console.error('Error during authentication:', err);
      }
    };

    authenticate();
  }, [navigate, location.search]);

  return (
    <div>
      <h2>Authenticating...</h2>
    </div>
  );
};

export default Callback;

// Path: /Project-Manager/Client/my-app/src/components/CallbackHandler.js

import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';

const CallbackHandler = () => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (code) {
      axios.post('http://localhost:3002/callback', { code })
        .then(response => {
          const { token } = response.data;
          history.push(`/repos?token=${token}`);
        })
        .catch(error => {
          console.error('Error during callback handling', error);
        });
    }
  }, [history, location.search]);

  return <div>Loading...</div>;
};

export default CallbackHandler;
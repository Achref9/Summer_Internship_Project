// Callback.js

import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';

const Callback = () => {
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');

        if (code) {
            axios.get(`http://localhost:3002/callback?code=${code}`)
                .then(response => {
                    // Redirect to /repos or handle as needed
                    history.push('/repos');
                })
                .catch(error => {
                    console.error('Error handling callback:', error);
                });
        }
    }, [location, history]);

    return (
        <div>
            <p>Handling callback...</p>
        </div>
    );
};

export default Callback;

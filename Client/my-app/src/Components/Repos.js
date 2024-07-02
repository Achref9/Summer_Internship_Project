// Repos.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Repos = ({ token }) => {
    const [repos, setRepos] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRepos(token);
    }, [token]);

    const fetchRepos = async (token) => {
        try {
            const response = await axios.get(`http://localhost:3002/repos?token=${token}`);
            setRepos(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching repositories:', error);
            setError('Failed to fetch repositories');
        }
    };

    return (
        <div>
            <h2>GitHub Repositories</h2>
            {error && <p className="text-danger">{error}</p>}
            <ul>
                {repos.map(repo => (
                    <li key={repo.id}>{repo.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Repos;

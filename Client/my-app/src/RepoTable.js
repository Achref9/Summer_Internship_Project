import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const RepoTable = () => {
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const fetchRepos = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/repos?token=${token}`);
        console.log(response.data); // Debugging line
        setRepos(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching repositories:', err); // Debugging line
        setError('Failed to fetch repositories');
        setRepos([]);
      }
    };

    if (token) {
      fetchRepos();
    }
  }, [location]);

  return (
    <div className="container mt-5">
      <h1>Your GitHub Repositories</h1>
      {error && <p>{error}</p>}
      {repos.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Stars</th>
              <th>Forks</th>
              <th>Language</th>
            </tr>
          </thead>
          <tbody>
            {repos.map((repo) => (
              <tr key={repo.id}>
                <td>{repo.name}</td>
                <td>{repo.description}</td>
                <td>{repo.stargazers_count}</td>
                <td>{repo.forks_count}</td>
                <td>{repo.language}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No repositories found.</p>
      )}
    </div>
  );
};

export default RepoTable;

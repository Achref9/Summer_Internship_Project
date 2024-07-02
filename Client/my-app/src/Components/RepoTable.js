// Path: /Project-Manager/Client/my-app/src/components/RepoTable.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const RepoTable = () => {
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    try {
      const response = await axios.get('http://localhost:3002/repos', { withCredentials: true });

      if (response.status === 200) {
        setRepos(response.data);
        setError('');
      } else {
        setError('Failed to fetch repositories');
        setRepos([]);
      }
    } catch (err) {
      console.error('Error fetching repositories:', err);
      setError('Failed to fetch repositories');
      setRepos([]);
    }
  };

  return (
    <div className="container">
      <h2 className="mt-4 mb-4">GitHub Repositories</h2>
      {error && <p className="text-danger">{error}</p>}
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Stars</th>
            <th scope="col">Forks</th>
            <th scope="col">Language</th>
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
    </div>
  );
};

export default RepoTable;

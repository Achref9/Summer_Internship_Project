import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const RepoTable = () => {
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      fetchRepos(token, 'Achref9'); // Replace 'Achref9' with the username you want to fetch repos for
    }
  }, [location]);

  const fetchRepos = async (token, username) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/repos?token=${token}&username=${username}`);

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
      <h2 className="mt-4 mb-4">GitHub Repositories for Achref9</h2>
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

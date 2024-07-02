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

  const handleViewRepo = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">GitHub Repositories</h2>
      {error && <p className="text-danger">{error}</p>}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Stars</th>
              <th scope="col">Forks</th>
              <th scope="col">Language</th>
              <th scope="col">Actions</th> {/* New column for actions */}
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
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleViewRepo(repo.html_url)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepoTable;

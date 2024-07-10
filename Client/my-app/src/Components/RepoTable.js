import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaLock, FaGlobe } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';

const RepoTable = () => {
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]); // State to hold filtered repositories
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // State to hold search term
  const history = useHistory();

  useEffect(() => {
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    try {
      const response = await axios.get('http://localhost:3002/repos', { withCredentials: true });

      if (response.status === 200) {
        setRepos(response.data);
        setFilteredRepos(response.data); // Initialize filteredRepos with all repositories
        setError('');
      } else {
        setError('Failed to fetch repositories');
        setRepos([]);
        setFilteredRepos([]);
      }
    } catch (err) {
      console.error('Error fetching repositories:', err);
      setError('Failed to fetch repositories');
      setRepos([]);
      setFilteredRepos([]);
    }
  };

  const handleViewRepo = (url) => {
    window.open(url, '_blank');
  };

  const handleCommit = (owner, repoName) => {
    history.push(`/commit?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repoName)}`);
  };

  const handleViewBranches = (owner, repo) => {
    history.push(`/branches/${owner}/${repo}`);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:3002/logout', { withCredentials: true });
      if (response.status === 200) {
        window.location.href = 'http://localhost:3000'; // Redirect to login page
      }
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    // Filter repositories based on search term
    const filtered = repos.filter(repo =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRepos(filtered);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>GitHub Repositories</h2>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>
      {error && <p className="text-danger">{error}</p>}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by repository name"
          aria-label="Search"
          aria-describedby="basic-addon2"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="input-group-append">
          <button className="btn btn-outline-secondary" type="button">Search</button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Stars</th>
              <th scope="col">Forks</th>
              <th scope="col">Language</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRepos.map((repo) => (
              <tr key={repo.id}>
                <td>{repo.name}</td>
                <td>{repo.description}</td>
                <td>{repo.stargazers_count}</td>
                <td>{repo.forks_count}</td>
                <td>{repo.language}</td>
                <td>
                  {repo.private ? (
                    <span>
                      <FaLock className="text-secondary" /> Private
                    </span>
                  ) : (
                    <span>
                      <FaGlobe className="text-info" /> Public
                    </span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleViewRepo(repo.html_url)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleCommit(repo.owner.login, repo.name)}
                  >
                    Commit
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleViewBranches(repo.owner.login, repo.name)}
                  >
                    View Branches
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

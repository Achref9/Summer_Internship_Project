import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaLock, FaGlobe } from 'react-icons/fa';
import ApiService from '../config/ApiService';
import './RepoTable.css'; // Import the CSS file for custom styling
import logo from '../assets/logogit.png'; // Adjust the path as necessary

const RepoTable = () => {
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // State to handle the current page
  const reposPerPage = 5; // Number of repos per page
  const history = useHistory();

  useEffect(() => {
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    try {
      const response = await ApiService.getRepos();
      if (response.status === 200) {
        setRepos(response.data);
        setFilteredRepos(response.data);
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
      const response = await ApiService.logout();
      if (response.status === 200) {
        window.location.href = 'http://localhost:3000';
      }
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    const filtered = repos.filter(repo =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRepos(filtered);
    setCurrentPage(0); // Reset to the first page on new search
  };

  // Calculate repositories for the current page
  const offset = currentPage * reposPerPage;
  const currentRepos = filteredRepos.slice(offset, offset + reposPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 header">
        <h2>
          <img src={logo} alt="GitHub Logo" style={{ width: '38px', marginRight: '10px' }} />
          GitHub Repositories
        </h2>
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
            {currentRepos.map((repo) => (
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
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={Math.ceil(filteredRepos.length / reposPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
    </div>
  );
};

export default RepoTable;

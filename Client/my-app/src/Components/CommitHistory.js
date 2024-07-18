import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import ApiService from '../config/ApiService';

const CommitHistory = () => {
  const { repoOwner, repoName } = useParams();
  const [commits, setCommits] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [commitsPerPage] = useState(5); // Number of commits per page

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const response = await ApiService.getCommits(repoOwner, repoName);
        setCommits(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching commits:', err);
        setError('Failed to fetch commit history');
      }
    };

    fetchCommits();
  }, [repoOwner, repoName]);

  // Calculate page count for pagination
  const pageCount = Math.ceil(commits.length / commitsPerPage);

  // Logic to paginate commits
  const offset = currentPage * commitsPerPage;
  const currentCommits = commits.slice(offset, offset + commitsPerPage);

  // Function to handle pagination change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 header">
        <h2>Commit History of {repoOwner}/{repoName}</h2>
        <Link to="/repos" className="btn btn-primary">
          Back to Repos
        </Link>
      </div>
      {error && <p className="text-danger">{error}</p>}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">SHA</th>
              <th scope="col">Author</th>
              <th scope="col">Date (UTC Time)</th>
              <th scope="col">Message</th>
            </tr>
          </thead>
          <tbody>
            {currentCommits.map(commit => (
              <tr key={commit.sha}>
                <td>{commit.sha}</td>
                <td>{commit.author}</td>
                <td>{commit.date}</td>
                <td>{commit.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
        pageLinkClassName={'page-link'}
        previousLinkClassName={'page-link'}
        nextLinkClassName={'page-link'}
        disabledClassName={'disabled'}
      />
    </div>
  );
};

export default CommitHistory;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CommitHistory = () => {
  const { repoOwner, repoName } = useParams();
  const [commits, setCommits] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/commits/${repoOwner}/${repoName}`, {
          withCredentials: true
        });
        setCommits(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching commits:', err);
        setError('Failed to fetch commit history');
      }
    };

    fetchCommits();
  }, [repoOwner, repoName]);

  return (
    <div className="container mt-4">
      <h2>Commit History of {repoOwner}/{repoName}</h2>
      {error && <p className="text-danger">{error}</p>}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">SHA</th>
              <th scope="col">Author</th>
              <th scope="col">Date</th>
              <th scope="col">Message</th>
            </tr>
          </thead>
          <tbody>
            {commits.map(commit => (
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
    </div>
  );
};

export default CommitHistory;

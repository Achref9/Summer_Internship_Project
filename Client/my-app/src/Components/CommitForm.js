import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // Import Link and useHistory from react-router-dom

const CommitForm = ({ repoName, repoOwner }) => {
  const [message, setMessage] = useState('Add README.md');
  const [content, setContent] = useState('This is the initial content of the file.');
  const [path, setPath] = useState('README.md');
  const [branch, setBranch] = useState('main');
  const [loading, setLoading] = useState(false);
  const [commitResponse, setCommitResponse] = useState(null);
  const [error, setError] = useState(null);
  
  const history = useHistory(); // Initialize useHistory
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      message: message,
      content: content,
      path: path,
      branch: branch
    };

    setLoading(true);

    try {
      const response = await axios.post(`http://localhost:3002/commit/${repoOwner}/${repoName}`, data, {
        withCredentials: true
      });
      
      setCommitResponse(response.data);
      setError(null);
    } catch (err) {
      console.error('Commit error:', err);
      setCommitResponse(null);
      setError('Failed to commit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    history.push('/repos'); // Navigate to '/repos' using useHistory
  };

  const handleViewCommitHistory = () => {
    history.push(`/commit-history/${repoOwner}/${repoName}`); // Navigate to '/commit-history' with repoOwner and repoName as parameters
  };

  return (
    <div className="container mt-4">
      <h2>Commit Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="message">Commit Message:</label>
          <input
            type="text"
            className="form-control"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">File Content:</label>
          <textarea
            className="form-control"
            id="content"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="path">File Path:</label>
          <input
            type="text"
            className="form-control"
            id="path"
            value={path}
            onChange={(e) => setPath(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="branch">Branch:</label>
          <input
            type="text"
            className="form-control"
            id="branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Committing...' : 'Commit'}
        </button>
        <button type="button" className="btn btn-secondary ml-2" onClick={handleCancel}>
          Cancel
        </button>
        <button type="button" className="btn btn-primary ml-2" onClick={handleViewCommitHistory}>
          View Commit History
        </button>
      </form>
      {error && (
        <div className="alert alert-warning mt-3" role="alert">
          {error}
        </div>
      )}
      {commitResponse && (
        <div className="mt-3">
          <p className="alert alert-success">Commit successful!</p>
          <p>Redirecting back to repositories...</p>
        </div>
      )}
    </div>
  );
};

export default CommitForm;

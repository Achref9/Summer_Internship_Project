// Path: /Project-Manager/Client/my-app/src/components/CommitForm.js

import React, { useState } from 'react';
import axios from 'axios';

const CommitForm = () => {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [path, setPath] = useState('');
  const [message, setMessage] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCommit = async () => {
    try {
      const response = await axios.post('http://localhost:3002/commit', {
        owner,
        repo,
        path,
        message,
        content
      }, { withCredentials: true });

      if (response.status === 200) {
        setSuccess('Commit created successfully!');
        setError('');
      }
    } catch (err) {
      console.error('Error creating commit:', err);
      setError('Failed to create commit');
      setSuccess('');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Create a Commit</h2>
      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}
      <div className="form-group">
        <label htmlFor="owner">Owner</label>
        <input
          type="text"
          className="form-control"
          id="owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="repo">Repository</label>
        <input
          type="text"
          className="form-control"
          id="repo"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="path">File Path</label>
        <input
          type="text"
          className="form-control"
          id="path"
          value={path}
          onChange={(e) => setPath(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="message">Commit Message</label>
        <input
          type="text"
          className="form-control"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          className="form-control"
          id="content"
          rows="5"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
      <button className="btn btn-primary" onClick={handleCommit}>Create Commit</button>
    </div>
  );
};

export default CommitForm;

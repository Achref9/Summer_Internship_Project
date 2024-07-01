import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RepoInfo = () => {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [token, setToken] = useState('');
  const [repoInfo, setRepoInfo] = useState(null);
  const [repoContents, setRepoContents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, []);

  const fetchRepoInfo = async () => {
    try {
      const headers = token ? { Authorization: `token ${token}` } : {};
      const repoResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers });
      setRepoInfo(repoResponse.data);

      const contentsResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents`, { headers });
      setRepoContents(contentsResponse.data);

      setError('');
    } catch (err) {
      setError('Repository not found or an error occurred');
      setRepoInfo(null);
      setRepoContents([]);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>GitHub Repository Info</h2>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          placeholder="Repository"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button onClick={fetchRepoInfo} style={{ marginLeft: '10px' }}>
          Fetch Info
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {repoInfo && (
        <div>
          <h3>{repoInfo.full_name}</h3>
          <p>{repoInfo.description}</p>
          <p>
            <strong>Stars:</strong> {repoInfo.stargazers_count}
          </p>
          <p>
            <strong>Forks:</strong> {repoInfo.forks_count}
          </p>
          <p>
            <strong>Open Issues:</strong> {repoInfo.open_issues_count}
          </p>
          <p>
            <strong>Watchers:</strong> {repoInfo.watchers_count}
          </p>
          <p>
            <strong>Language:</strong> {repoInfo.language}
          </p>
          <h4>Files:</h4>
          <ul>
            {repoContents.map((file) => (
              <li key={file.sha}>
                <a href={file.html_url} target="_blank" rel="noopener noreferrer">
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RepoInfo;

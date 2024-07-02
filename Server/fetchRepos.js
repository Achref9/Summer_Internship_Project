// Path: /Project-Manager/Server/fetchRepos.js

const axios = require('axios');

const fetchRepos = async (username, token) => {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = fetchRepos;

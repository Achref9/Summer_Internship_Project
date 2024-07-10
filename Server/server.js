const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3002;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.json());

const githubToken = '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'; // Replace with your GitHub token
const clientID = 'Ov23liQk5Xn3d1IFi9ik'; // Replace with your actual client ID
const clientSecret = 'fbe8c391228cc099adeaccc3afd1c248cd64638b'; // Replace with your actual client secret

// Redirect to GitHub OAuth login
app.get('/login', (req, res) => {
  const redirectUri = 'http://localhost:3002/callback';
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectUri}`;
  res.redirect(githubAuthUrl);
});

// Callback route to handle GitHub OAuth callback
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    // Exchange code for access token
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientID,
        client_secret: clientSecret,
        code: code
      },
      {
        headers: {
          accept: 'application/json'
        }
      }
    );

    const accessToken = response.data.access_token;
    // Get user details to determine owner (username or organization)
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const owner = userResponse.data.login; // Assuming the GitHub username is the owner
    res.cookie('github_token', accessToken, { httpOnly: true });
    res.cookie('github_owner', owner, { httpOnly: true }); // Store owner in cookie
    res.redirect('http://localhost:3000/repos'); // Redirect to repository list page
  } catch (err) {
    console.error('Error getting access token:', err);
    res.status(500).send('Authentication failed');
  }
});

// Route to fetch repositories for authenticated user
app.get('/repos', async (req, res) => {
  const token = req.cookies.github_token;
  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const owner = req.cookies.github_owner; // Retrieve owner from cookie
    const response = await axios.get(`https://api.github.com/user/repos`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching repositories:', err.response ? err.response.data : err);
    res.status(500).send('Failed to fetch repositories');
  }
});

// Route to fetch branches for a specific repository
app.get('/branches/:owner/:repo', async (req, res) => {
  const { owner, repo } = req.params;
  const url = `https://api.github.com/repos/${owner}/${repo}/branches`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(error.response.status || 500).json({ message: 'Failed to fetch branches' });
  }
});

// Logout route to clear cookies
app.get('/logout', (req, res) => {
  res.clearCookie('github_token');
  res.clearCookie('github_owner');
  res.json({ message: 'Logged out successfully' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

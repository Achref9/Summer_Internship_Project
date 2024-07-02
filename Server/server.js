const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const querystring = require('querystring');

const app = express();
const port = 3002;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());


const clientID = 'Ov23liQk5Xn3d1IFi9ik'; // Replace with your actual client ID
const clientSecret = ' fbe8c391228cc099adeaccc3afd1c248cd64638b'; // Replace with your actual client secret

app.get('/login', (req, res) => {
  const redirectUri = 'http://localhost:3002/callback';
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectUri}`;
  res.redirect(githubAuthUrl);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
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
    res.cookie('github_token', accessToken, { httpOnly: true });
    res.redirect('http://localhost:3000/repos');
  } catch (err) {
    console.error('Error getting access token:', err);
    res.status(500).send('Authentication failed');
  }
});

app.get('/repos', async (req, res) => {
  const token = req.cookies.github_token;
  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching repositories:', err);
    res.status(500).send('Failed to fetch repositories');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

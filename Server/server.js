const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());


const clientID = 'Ov23liQk5Xn3d1IFi9ik'; 
const clientSecret = '6678c9861e8923459fe3235d674dd948ba281e0e '; 

app.get('/login', (req, res) => {
  const redirectUri = 'http://localhost:5000/auth/github/callback';
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}`);
});

app.get('/auth/github/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code
    }, {
      headers: { 'Accept': 'application/json' }
    });

    const { access_token } = response.data;
    res.redirect(`http://localhost:3000/repos?token=${access_token}`);
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).send('Authentication failed');
  }
});

app.get('/api/repos', async (req, res) => {
  const { token } = req.query;

  try {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(500).send('Failed to fetch repositories');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

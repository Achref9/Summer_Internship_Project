const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const querystring = require('querystring');

const app = express();
const PORT = 3002; // Adjust port as needed

const CLIENT_ID = 'Ov23liQk5Xn3d1IFi9ik'; // Replace with your actual client ID
const CLIENT_SECRET = ' fbe8c391228cc099adeaccc3afd1c248cd64638b'; // Replace with your actual client secret
const REDIRECT_URI = 'http://localhost:3000/callback'; // Adjust redirect URI

app.use(cors());
app.use(bodyParser.json());

// Endpoint to initiate GitHub OAuth flow
app.get('/login', (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo`;
    res.redirect(githubAuthUrl);
});

// Callback endpoint to handle GitHub's redirect after authentication
app.get('/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    try {
        // Exchange code for access token
        const { data } = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code,
            redirect_uri: REDIRECT_URI,
        }, {
            headers: {
                accept: 'application/json',
            },
        });

        const accessToken = data.access_token;

        // Redirect to frontend with access token
        res.redirect(`http://localhost:3000/repos?token=${accessToken}`);
    } catch (error) {
        console.error('Error exchanging code for access token:', error);
        res.status(500).json({ error: 'Failed to get access token' });
    }
});

// Endpoint to fetch user's repositories using GitHub API
app.get('/repos', async (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        // Fetch repositories using GitHub API
        const { data } = await axios.get('https://api.github.com/user/repos', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        res.json(data);
    } catch (error) {
        console.error('Error fetching repositories:', error);
        res.status(500).json({ error: 'Failed to fetch repositories' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

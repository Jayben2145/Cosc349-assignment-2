const express = require('express');
const router = express.Router();
const cognito = require('../config/cognito');

// Render login page
router.get('/', (req, res) => {
  console.log('Login page hit!');
  res.render('login');
});

// Handle login POST request with Cognito
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password
    }
  };

  try {
    // Attempt to authenticate with Cognito
    const data = await cognito.initiateAuth(params).promise();

    // Check if the IdToken is present in the response
    if (!data || !data.AuthenticationResult || !data.AuthenticationResult.IdToken) {
      console.error('Authentication failed: Missing IdToken');
      return res.render('login', { error: 'Failed to authenticate: Missing IdToken.' });
    }

    const idToken = data.AuthenticationResult.IdToken;

    // Store the token in the session for authentication
    req.session.isAuthenticated = true;
    req.session.idToken = idToken;

    res.redirect('/admin');
  } catch (error) {
    console.error('Error authenticating:', error);
    res.render('login', { error: 'Invalid username or password' });
  }
});

// Handle logout
router.get('/logout', (req, res) => {
  req.session.isAuthenticated = false;
  req.session.idToken = null;
  res.redirect('/login');
});

module.exports = router;

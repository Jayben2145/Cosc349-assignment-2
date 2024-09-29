const express = require('express');
const router = express.Router();
const cognito = require('../config/cognito');
const bcrypt = require('bcrypt'); // Not used for authentication anymore

// Render login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login POST request with Cognito
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: process.env.COGNITO_CLIENT_ID, // No client secret needed
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password
    }
  };

  try {
    // Authenticate with Cognito
    const data = await cognito.initiateAuth(params).promise();
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

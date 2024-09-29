const express = require('express');
const router = express.Router();
const cognito = require('../config/cognito');

// Render login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login POST request with Cognito
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    // Authenticate with Cognito
    const data = await cognito.initiateAuth(params).promise();

    // Check for NEW_PASSWORD_REQUIRED challenge
    if (data.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
      req.session.challengeSession = data.Session;
      req.session.username = username;
      res.render('newPassword', { username });
    } else {
      const idToken = data.AuthenticationResult.IdToken;
      req.session.isAuthenticated = true;
      req.session.idToken = idToken;
      res.redirect('/admin');
    }
  } catch (error) {
    console.error('Error authenticating:', error);
    res.render('login', { error: 'Invalid username or password' });
  }
});

// Handle setting new password
router.post('/new-password', async (req, res) => {
  const { newPassword } = req.body;

  const params = {
    ChallengeName: 'NEW_PASSWORD_REQUIRED',
    ClientId: process.env.COGNITO_CLIENT_ID,
    ChallengeResponses: {
      USERNAME: req.session.username,
      NEW_PASSWORD: newPassword,
    },
    Session: req.session.challengeSession,
  };

  try {
    const data = await cognito.respondToAuthChallenge(params).promise();
    req.session.isAuthenticated = true;
    req.session.idToken = data.AuthenticationResult.IdToken;
    res.redirect('/admin');
  } catch (error) {
    console.error('Error setting new password:', error);
    res.render('newPassword', { error: 'Could not set new password' });
  }
});

// Handle logout
router.get('/logout', (req, res) => {
  req.session.isAuthenticated = false;
  req.session.idToken = null;
  res.redirect('/login');
});

module.exports = router;

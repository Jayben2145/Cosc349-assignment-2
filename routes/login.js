const express = require('express');
const router = express.Router();
const cognito = require('../config/cognito'); // Cognito SDK should be properly configured
const bcrypt = require('bcrypt');

// Render the login page (GET /login)
router.get('/', (req, res) => {
  console.log('Login page hit!');
  res.render('login');  // Ensure login.pug exists in your views folder
});

// Handle login (POST /login)
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
    const data = await cognito.initiateAuth(params).promise();
    const idToken = data.AuthenticationResult.IdToken;
    req.session.isAuthenticated = true;
    req.session.idToken = idToken;

    res.redirect('/admin');
  } catch (error) {
    console.error('Error authenticating:', error);
    res.render('login', { error: 'Invalid username or password' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.isAuthenticated = false;
  req.session.idToken = null;
  res.redirect('/login');
});

module.exports = router;

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

  console.log(`Attempting login for user: ${username}`);

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: process.env.COGNITO_CLIENT_ID, // Cognito App Client ID
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password
    }
  };

  try {
    // Authenticate with Cognito
    const data = await cognito.initiateAuth(params).promise();
    console.log("Auth response from Cognito:", data);

    // Check for NEW_PASSWORD_REQUIRED challenge
    if (data.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
      console.log("New password required for user:", username);
      
      // Save the session for the next step
      req.session.challengeSession = data.Session;
      req.session.username = username;

      console.log("Challenge Session stored in session:", req.session.challengeSession);
      
      // Render the new password page
      res.render('newPassword', { username });
    } else {
      // User successfully authenticated
      console.log("Authentication successful! ID Token:", data.AuthenticationResult.IdToken);
      
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

  console.log("New password submission for user:", req.session.username);
  console.log("Session from initial challenge:", req.session.challengeSession);

  const params = {
    ChallengeName: 'NEW_PASSWORD_REQUIRED',
    ClientId: process.env.COGNITO_CLIENT_ID,
    ChallengeResponses: {
      USERNAME: req.session.username,
      NEW_PASSWORD: newPassword
    },
    Session: req.session.challengeSession, // Include session from initial authentication
  };

  try {
    // Respond to the password change challenge
    const data = await cognito.respondToAuthChallenge(params).promise();
    
    console.log("New password response from Cognito:", data);

    // Successfully authenticated with new password
    const idToken = data.AuthenticationResult.IdToken;
    req.session.isAuthenticated = true;
    req.session.idToken = idToken;

    console.log("User successfully authenticated with new password. Redirecting to admin.");
    
    res.redirect('/admin');
  } catch (error) {
    console.error('Error setting new password:', error);
    res.render('newPassword', { error: 'Could not set new password' });
  }
});

// Handle logout
router.get('/logout', (req, res) => {
  console.log("Logging out user");
  
  req.session.isAuthenticated = false;
  req.session.idToken = null;
  res.redirect('/login');
});

module.exports = router;

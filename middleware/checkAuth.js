const AWS = require('aws-sdk');

const checkAuth = (req, res, next) => {
  if (!req.session.isAuthenticated || !req.session.idToken) {
    return res.redirect('/login');
  }

  // Optionally, you can verify the token with Cognito here
  next();
};

module.exports = checkAuth;

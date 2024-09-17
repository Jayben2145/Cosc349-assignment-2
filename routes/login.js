const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// Load the admin password hash from the .env file
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

// Render login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login POST request
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Only allow login for the "admin" username (or update for multiple users)
  if (username === 'admin') {
    // Compare the provided password with the hash in the .env file
    const isPasswordCorrect = await bcrypt.compare(password, adminPasswordHash);

    if (isPasswordCorrect) {
      req.session.isAuthenticated = true;
      res.redirect('/admin');
    } else {
      res.render('login', { error: 'Invalid username or password' });
    }
  } else {
    res.render('login', { error: 'Invalid username or password' });
  }
});

// Handle logout
router.get('/logout', (req, res) => {
  req.session.isAuthenticated = false;
  res.redirect('/login');
});

module.exports = router;

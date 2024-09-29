// /routes/admin/index.js

const express = require('express');
const router = express.Router();

// Sub-routes for different admin sections
const propertiesRouter = require('./properties');
const appraisalsRouter = require('./appraisals');
const buyerSpecsRouter = require('./buyerSpecifications');
const contactsRouter = require('./contacts');

// Check authentication for admin access
function checkAuth(req, res, next) {
  if (req.session.isAuthenticated) {
    next(); // Proceed if authenticated
  } else {
    res.redirect('/login'); // Redirect to login if not authenticated
  }
}

// Admin dashboard
router.get('/', checkAuth, (req, res) => {
  res.render('dashboard'); // Corrected view path
});

// Routes for managing properties
router.use('/properties', checkAuth, propertiesRouter);

// Routes for managing appraisal requests
router.use('/appraisals', checkAuth, appraisalsRouter);

// Routes for managing buyer specifications
router.use('/buyer-specifications', checkAuth, buyerSpecsRouter);

// Routes for managing contact requests
router.use('/contacts', checkAuth, contactsRouter);

module.exports = router;

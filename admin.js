// admin.js
const express = require('express');
const router = express.Router();

// Sub-routes for different admin sections
const propertiesRouter = require('./routes/admin/properties');
const appraisalsRouter = require('./routes/admin/appraisals');
const buyerSpecsRouter = require('./routes/admin/buyerSpecifications');
const contactsRouter = require('./routes/admin/contacts');

// Middleware to check if user is authenticated
function checkAuth(req, res, next) {
  if (req.session.isAuthenticated) {
    next(); // User is authenticated, proceed to the next function
  } else {
    res.redirect('/login'); // Redirect to login if not authenticated
  }
}

// Admin dashboard (protected)
router.get('/', checkAuth, (req, res) => {
  res.render('admin/dashboard', { title: 'Admin Dashboard' });
});

// Routes for properties management
router.use('/properties', checkAuth, propertiesRouter);

// Routes for appraisal requests
router.use('/appraisals', checkAuth, appraisalsRouter);

// Routes for buyer specifications
router.use('/buyer-specifications', checkAuth, buyerSpecsRouter);

// Routes for contact requests
router.use('/contacts', checkAuth, contactsRouter);

module.exports = router;

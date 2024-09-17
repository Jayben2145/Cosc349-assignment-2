// app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { sequelize } = require('./models');
const multer = require('multer');
const bcrypt = require('bcrypt');
const session = require('express-session');  // Added session handling

const app = express();

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware for managing sessions
app.use(session({
  secret: process.env.SECRET_KEY,  // Replace hardcoded secret with env variable
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // Set to true if using HTTPS
}));


// Middleware to make session data available to views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  next();
});

// Routes
const indexRouter = require('./routes/index');
const propertiesRouter = require('./routes/properties');
const appraisalsRouter = require('./routes/appraisals');
const buyerSpecificationsRouter = require('./routes/buyerSpecifications');
const contactsRouter = require('./routes/contacts');
const adminRouter = require('./admin'); // Updated path for admin
const loginRouter = require('./routes/login'); // Added login route

// Use router
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/properties', propertiesRouter);
app.use('/request-appraisal', appraisalsRouter);
app.use('/buyer-specifications', buyerSpecificationsRouter);
app.use('/contact', contactsRouter);
app.use('/', loginRouter);  // Added login route

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
  });
});

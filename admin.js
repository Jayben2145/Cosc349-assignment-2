// admin.js (for admin routes)
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const { sequelize } = require('./models');

const app = express();

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.NON_ADMIN_URL = process.env.NON_ADMIN_URL;
    res.locals.ADMIN_URL = process.env.ADMIN_URL;
    next();
  });
  

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  next();
});

// Include the login routes
const loginRouter = require('./routes/login');  // Ensure the correct path to login.js
app.use('/', loginRouter);

app.get('/', (req, res) => {
    res.redirect('/admin');  // Redirects to the admin dashboard
  });

// Admin routes
const adminRouter = require('./routes/admin/index');
app.use('/admin', adminRouter);

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Admin server started on http://localhost:4000');
  });
});

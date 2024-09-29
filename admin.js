// admin.js (for admin routes)
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const { sequelize } = require('./models');
const checkAuth = require('./middleware/checkAuth');  // Import checkAuth middleware

const app = express();  // Initialize the Express app

// Set view engine
app.set('views', path.join(__dirname, 'views/admin'));
app.set('view engine', 'pug');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use((req, res, next) => {
  res.locals.NON_ADMIN_URL = process.env.NON_ADMIN_URL;
  res.locals.ADMIN_URL = process.env.ADMIN_URL;
  res.locals.isAuthenticated = req.session.isAuthenticated;
  next();
});

// Redirect root to login page
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Login route
const loginRouter = require('./routes/login');  // Add login route
app.use('/login', loginRouter);

// Protect all admin routes with authentication
app.use(checkAuth);

// Admin routes
const adminRouter = require('./routes/admin/index');
app.use('/admin', adminRouter);

// Sync database and start the server
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Admin server started on http://localhost:3000');
  });
});

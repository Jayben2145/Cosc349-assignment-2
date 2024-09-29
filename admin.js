// admin.js (for admin routes)
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const { sequelize } = require('./models');
const checkAuth = require('./middleware/checkAuth');

const app = express();

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

// **Login route**
const loginRouter = require('./routes/login');
app.use('/', loginRouter);  // Make sure all login routes are included

// **Important:** Apply checkAuth after defining routes that should be accessible without authentication
app.use(checkAuth);

// Admin routes
const adminRouter = require('./routes/admin/index');
app.use('/admin', adminRouter);

// Sync database and start the server
sequelize.sync().then(() => {
  app.listen(3000, '0.0.0.0', () => {
    console.log('Admin server started on http://0.0.0.0:4000');
  });
});

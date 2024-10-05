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

// Render login page before auth checks
const loginRouter = require('./routes/login');
app.use('/login', loginRouter);

// Apply authentication middleware
app.use(checkAuth);  // This must come after login route

// Admin routes
const adminRouter = require('./routes/admin/index');
app.use('/admin', adminRouter);

// Sync database and start the server
sequelize.sync().then(() => {
  app.listen(4000, () => {
    console.log('Admin server started on http://localhost:4000');
  });
});

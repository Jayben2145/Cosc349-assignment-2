// app.js (for non-admin routes)

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
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


// Routes for the front-end
const indexRouter = require('./routes/index');
const propertiesRouter = require('./routes/properties');
const appraisalsRouter = require('./routes/appraisals');
const buyerSpecificationsRouter = require('./routes/buyerSpecifications');
const contactsRouter = require('./routes/contacts');

app.use('/', indexRouter);
app.use('/properties', propertiesRouter);
app.use('/request-appraisal', appraisalsRouter);
app.use('/buyer-specifications', buyerSpecificationsRouter);
app.use('/contact', contactsRouter);

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(4000, () => {
    console.log('Front-end server started on http://localhost:3000');
  });
});

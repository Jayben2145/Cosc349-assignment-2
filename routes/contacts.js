const express = require('express');
const router = express.Router();
const { Contact } = require('../models');

router.get('/', (req, res) => {
  res.render('contact');
});

router.post('/', async (req, res) => {
  await Contact.create(req.body);
  res.send('Contact message sent successfully.');
});

module.exports = router;

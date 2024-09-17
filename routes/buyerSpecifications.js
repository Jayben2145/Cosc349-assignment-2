const express = require('express');
const router = express.Router();
const { BuyerSpecification } = require('../models');

router.get('/', (req, res) => {
  res.render('buyerSpecifications');
});

router.post('/', async (req, res) => {
  await BuyerSpecification.create(req.body);
  res.send('Buyer specifications submitted successfully.');
});

module.exports = router;

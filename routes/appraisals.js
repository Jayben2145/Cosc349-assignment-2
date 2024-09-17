const express = require('express');
const router = express.Router();
const { Appraisal } = require('../models');

router.get('/', (req, res) => {
  res.render('requestAppraisal');
});

router.post('/', async (req, res) => {
  await Appraisal.create(req.body);
  res.send('Appraisal request submitted successfully.');
});

module.exports = router;

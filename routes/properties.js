const express = require('express');
const router = express.Router();
const { Property, PropertyImage } = require('../models');

// Properties list
router.get('/', async (req, res) => {
  const properties = await Property.findAll({ where: { display: true } });
  res.render('properties', { properties });
});

// Property details
router.get('/:id', async (req, res) => {
  const property = await Property.findByPk(req.params.id);
  const images = await PropertyImage.findAll({ where: { propertyId: req.params.id } });
  res.render('propertyDetails', { property, images });
});

module.exports = router;

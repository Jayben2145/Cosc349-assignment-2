const express = require('express');
const router = express.Router();
const { BuyerSpecification } = require('../../models');

// View all buyer specifications
router.get('/', async (req, res) => {
  const buyerSpecifications = await BuyerSpecification.findAll();
  res.render('admin/buyerSpecifications', { buyerSpecifications });
});

// Mark a buyer specification as contacted
router.post('/:id/contacted', async (req, res) => {
  try {
    console.log(`Marking BuyerSpecification ID ${req.params.id} as contacted`);

    // Update the 'contacted' field to true
    const result = await BuyerSpecification.update({ contacted: true }, { where: { id: req.params.id } });
    console.log('Update result:', result);

    res.redirect('/admin/buyer-specifications');
  } catch (error) {
    console.error('Error marking as contacted:', error);
    res.status(500).send("Error marking as contacted");
  }
});

// Delete a buyer specification request
router.post('/:id/delete', async (req, res) => {
  try {
    await BuyerSpecification.destroy({ where: { id: req.params.id } });
    res.redirect('/admin/buyer-specifications');
  } catch (error) {
    console.error('Error deleting buyer specification:', error);
    res.status(500).send("Error deleting buyer specification");
  }
});

module.exports = router;

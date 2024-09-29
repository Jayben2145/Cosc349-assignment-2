const express = require('express');
const router = express.Router();
const { Appraisal } = require('../../models');

// View all appraisal requests
router.get('/', async (req, res) => {
  const appraisals = await Appraisal.findAll();
  res.render('appraisals', { appraisals });
});

// Mark an appraisal as contacted
router.post('/:id/contacted', async (req, res) => {
  try {
    // Update the 'contacted' field to true
    await Appraisal.update({ contacted: true }, { where: { id: req.params.id } });
    res.redirect('/admin/appraisals');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error marking as contacted");
  }
});

// Delete an appraisal request
router.post('/:id/delete', async (req, res) => {
  try {
    await Appraisal.destroy({ where: { id: req.params.id } });
    res.redirect('/admin/appraisals');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting appraisal");
  }
});

module.exports = router;

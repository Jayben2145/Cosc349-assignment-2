const express = require('express');
const router = express.Router();
const { Contact } = require('../../models');

// View all contact requests
router.get('/', async (req, res) => {
  const contacts = await Contact.findAll();
  res.render('contacts', { contacts });
});

// Mark a contact request as contacted
router.post('/:id/contacted', async (req, res) => {
  try {
    console.log(`Marking Contact ID ${req.params.id} as contacted`);

    // Update the 'contacted' field to true
    await Contact.update({ contacted: true }, { where: { id: req.params.id } });
    res.redirect('/admin/contacts');
  } catch (error) {
    console.error('Error marking as contacted:', error);
    res.status(500).send("Error marking as contacted");
  }
});

// Delete a contact request
router.post('/:id/delete', async (req, res) => {
  try {
    await Contact.destroy({ where: { id: req.params.id } });
    res.redirect('/admin/contacts');
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).send("Error deleting contact");
  }
});

module.exports = router;

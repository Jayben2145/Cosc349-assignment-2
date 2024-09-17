const express = require('express');
const multer = require('multer');
const fs = require('fs-extra'); 
const axios = require('axios');
const path = require('path');
const router = express.Router();
const { Property, PropertyImage } = require('../../models');

// Set up multer for file uploads (you can change the destination folder as needed)
const upload = multer({ dest: 'public/images/' });

// Helper function to delete files
async function deleteFiles(imagePaths) {
  for (const imagePath of imagePaths) {
    const fullPath = path.join(__dirname, '../../public', imagePath);
    
    // Ensure that only files inside the 'public/images/' directory are deleted
    if (fullPath.startsWith(path.join(__dirname, '../../public/images/'))) {
      try {
        if (await fs.pathExists(fullPath)) {
          await fs.remove(fullPath);
          console.log(`Deleted file: ${fullPath}`);
        } else {
          console.log(`File not found: ${fullPath}`);
        }
      } catch (error) {
        console.error(`Error deleting file: ${fullPath}`, error);
      }
    } else {
      console.log(`Skipped deletion for invalid path: ${fullPath}`);
    }
  }
}

// View all properties (including hidden ones)
router.get('/', async (req, res) => {
  const properties = await Property.findAll();  // Show all properties regardless of the display flag
  res.render('admin/properties', { properties });
});

// View form for adding a new property
router.get('/add', (req, res) => {
  res.render('admin/addProperty');
});

router.post('/add', upload.array('photos', 10), async (req, res) => {
  const { title, description, price, location, display, notes } = req.body;
  const GOOGLE_API_KEY = 'AIzaSyADRTxHN9jOFcED8b58dIFZWdfUMVe08Zg';  // Replace with your actual Google API Key

  try {
    // Make a request to the Geocoding API to get the coordinates
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address: location,
        key: GOOGLE_API_KEY
      }
    });

    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location;
      console.log(`Coordinates for ${location}: Latitude ${lat}, Longitude ${lng}`);

      // Create the new property with the obtained coordinates
      const property = await Property.create({
        title,
        description,
        price,
        location,
        latitude: lat,  // Use the latitude from the API response
        longitude: lng,  // Use the longitude from the API response
        display: display === 'true',  // Convert string to boolean
        notes
      });

      // Handle photo uploads
      if (req.files) {
        for (const file of req.files) {
          await PropertyImage.create({ propertyId: property.id, imageUrl: `/images/${file.filename}` });
        }
      }

      res.redirect('/admin/properties');
    } else {
      res.status(400).send("Unable to find location coordinates.");
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    res.status(500).send("Error creating property.");
  }
});

// Edit property form
router.get('/:id/edit', async (req, res) => {
  const property = await Property.findByPk(req.params.id);
  const images = await PropertyImage.findAll({ where: { propertyId: property.id } });
  res.render('admin/editProperty', { property, images });
});

router.post('/:id/edit', upload.array('photos', 10), async (req, res) => {
  const { title, description, price, location, display, notes } = req.body;
  const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

  try {
    // Make a request to the Geocoding API to get the coordinates
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address: location,
        key: GOOGLE_API_KEY
      }
    });

    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location;
      console.log(`Coordinates for ${location}: Latitude ${lat}, Longitude ${lng}`);

      // Update the property with the obtained coordinates
      await Property.update({
        title,
        description,
        price,
        location,
        latitude: lat,  // Use the latitude from the API response
        longitude: lng,  // Use the longitude from the API response
        display: display === 'true',  // Convert string to boolean
        notes
      }, {
        where: { id: req.params.id }
      });

      // Handle updated photo uploads
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          await PropertyImage.create({
            propertyId: req.params.id,
            imageUrl: `/images/${file.filename}`
          });
        }
      }

      res.redirect('/admin/properties');
    } else {
      res.status(400).send("Unable to find location coordinates.");
    }
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).send("Error updating property.");
  }
});

// Delete a property
router.post('/:id/delete', async (req, res) => {
  try {
    // Fetch all images related to the property
    const images = await PropertyImage.findAll({ where: { propertyId: req.params.id } });
    
    // Collect the image file paths to delete from the file system
    const imagePaths = images.map(image => image.imageUrl);

    // Delete the images from the file system
    await deleteFiles(imagePaths);

    // Delete the associated image records from the database
    await PropertyImage.destroy({ where: { propertyId: req.params.id } });
    
    // Finally, delete the property itself
    await Property.destroy({ where: { id: req.params.id } });

    res.redirect('/admin/properties');
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).send("Error deleting property");
  }
});
// Handle deleting an individual property image
router.post('/:propertyId/images/:imageId/delete', async (req, res) => {
  try {
    await PropertyImage.destroy({ where: { id: req.params.imageId, propertyId: req.params.propertyId } });
    res.redirect(`/admin/properties/${req.params.propertyId}/edit`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting image");
  }
});

module.exports = router;

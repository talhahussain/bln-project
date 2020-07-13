const express = require('express')
const router = express.Router();
const locationController = require('../controller/locationController')

router.post('/addLocation', locationController.addLocation);
router.get('/getLocations', locationController.getLocation);
router.post('/location', locationController.location)
router.post('/getFare', locationController.getFare);



module.exports = router;
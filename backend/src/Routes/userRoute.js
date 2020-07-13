const express = require('express')
const router = express.Router();
const authController = require('../controller/authController')


router.post('/register', authController.register)
router.get('/confirmEmail/:token', authController.confirmEmail)
router.post('/login', authController.login)



module.exports = router;
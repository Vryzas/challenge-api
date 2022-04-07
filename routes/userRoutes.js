const express = require('express');

const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.get('/getMe', userController.getMe);
router.get('/getMyStats', userController.getMyStats);
router.get('/getMyMatches', userController.getMyMatches);

module.exports = router;

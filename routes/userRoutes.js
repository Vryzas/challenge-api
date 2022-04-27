const express = require('express');

const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.get('/profile', userController.profile);
router.get('/stats', userController.stats);
router.get('/matches', userController.matches);

module.exports = router;

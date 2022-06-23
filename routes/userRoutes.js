const express = require('express');

const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout/:username', authController.logout);

router.get('/activation/:token', userController.activateAccount);
router.patch('/forgotPassword', userController.forgotPassword);
router.get('/resetPassword/:token', userController.resetPassword);
router.patch('/changePassword', userController.passwordRedefined);
router.get('/profile', userController.getMe);

module.exports = router;

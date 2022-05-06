const express = require('express');

const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.get('/login', authController.login);
router.get('/logout/:username', authController.logout);

router.patch('/activateMe/:username', userController.activateAccount);
router.patch('/forgotPassword', userController.forgotPassword);
router.get('/resetPassword/:token', userController.resetPassword);
router.patch('/passwordRedefined/:username', userController.passwordRedefined);
router.get('/getMe', userController.getMe);

module.exports = router;

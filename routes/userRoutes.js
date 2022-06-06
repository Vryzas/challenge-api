const express = require('express');

const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const validation = require('./../utils/validation');

const router = express.Router();

router.post('/signup', validation.signupFields, authController.signup);
router.get('/login', validation.loginFields, authController.login);
router.get('/logout/:username', authController.logout);

router.patch('/activateMe/:username', userController.activateAccount);
router.patch('/forgotPassword', userController.forgotPassword);
router.get('/resetPassword/:token', userController.resetPassword);
router.patch('/passwordRedefined/:username', userController.passwordRedefined);
router.get('/getMe', userController.getMe);
router.get('/getMyStats', userController.getMyStats);
router.get('/getMyMatches', userController.getMyMatches);

module.exports = router;

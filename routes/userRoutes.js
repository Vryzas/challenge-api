const express = require('express');

const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const validation = require('./../utils/validation');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', validation.activeUser, authController.login);
router.get('/logout', authController.logout);

router.get('/getMe', validation.activeUser, userController.getMe);
router.get('/getMyStats', validation.activeUser, userController.getMyStats);
router.get('/getMyMatches', validation.activeUser, userController.getMyMatches);

router.patch('/activate/:username', userController.activate);
router.patch('/forgotPassword', validation.activeUser, userController.forgotPassword);
router.get('/resetPassword/:token', userController.resetPassword);
router.patch('/changePassword/:username', userController.changePassword);

module.exports = router;

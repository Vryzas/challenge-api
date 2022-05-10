const express = require('express');

const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', userController.activeUser, authController.login);
router.get('/logout', authController.logout);

router.get('/getMe', userController.activeUser, userController.getMe);
router.get('/getMyStats', userController.activeUser, userController.getMyStats);
router.get('/getMyMatches', userController.activeUser, userController.getMyMatches);

router.patch('/activate/:username', userController.activate);
router.patch('/forgotPassword', userController.activeUser, userController.forgotPassword);
router.get('/resetPassword/:token', userController.resetPassword);
router.patch('/changePassword/:username', userController.changePassword);

module.exports = router;

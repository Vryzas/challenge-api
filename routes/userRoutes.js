const express = require('express');

const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.patch('/activate/:username', userController.activate);
router.patch('/forgotPassword', userController.forgotPassword);
router.get('/resetPassword/:token', userController.resetPassword);
router.patch('/changePassword/:username', userController.changePassword);

router.get('/getMe', userController.getMe);
router.get('/getMyStats', userController.getMyStats);
router.get('/getMyMatches', userController.getMyMatches);

module.exports = router;

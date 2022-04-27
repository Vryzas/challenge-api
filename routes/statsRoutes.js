const express = require('express');

const statsController = require('../controllers/statsController');

const router = express.Router();

router.patch('/winUpdate/:username', statsController.winUpdate);
router.patch('/defeatUpdate/:username', statsController.defeatUpdate);
router.patch('/drawUpdate/:username', statsController.drawUpdate);

router.get('/findStats/:username', statsController.findStats);
router.get('/compareStats', statsController.compareStats);

module.exports = router;

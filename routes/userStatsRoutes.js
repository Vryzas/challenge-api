const express = require('express');

const statsController = require('./../controllers/statsController');

const router = express.Router();

router.get('/player/:username?', statsController.findStats);
router.get('/compare', statsController.compareStats);

module.exports = router;

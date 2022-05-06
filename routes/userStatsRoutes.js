const express = require('express');

const statsController = require('./../controllers/statsController');

const router = express.Router();

router.get('/findStats/:username', statsController.findStats);
router.get('/compareStats', statsController.compareStats);

module.exports = router;

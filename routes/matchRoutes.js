const express = require('express');

const matchController = require('./../controllers/matchController');

const router = express.Router();

router.get('/playerMatches/:username', matchController.playerMatches);
router.get('/compareMatches/:compareTo', matchController.compareMatches);

router.post('/addMatch', matchController.addMatch);

module.exports = router;

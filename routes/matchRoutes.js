const express = require('express');

const matchController = require('./../controllers/matchController');

const router = express.Router();

router.get('/player/:username', matchController.playerMatches);
router.get('/compare', matchController.compareMatches);

router.post('/', matchController.addMatch);

module.exports = router;

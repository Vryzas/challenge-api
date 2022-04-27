const express = require('express');

const chessController = require('./../controllers/chessController');

const router = express.Router();

router.get('/player/:player_id', chessController.player);
router.get('/playerMatches/:player_id', chessController.playerMatches);

module.exports = router;

const express = require('express');

const chessController = require('./../controllers/chessController');

const router = express.Router();

router.get('/chessMatchesByPlayer', chessController.chessMatchesByPlayer);
router.get('/chessPlayer', chessController.chessPlayer);

module.exports = router;

const express = require('express');

const matchController = require('./../controllers/matchController');

const router = express.Router();

router.get('/player/:username', matchController.player);
router.get('/compare', matchController.compare);

router.post('/', matchController.newMatch);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/leaderboardController');

// GET /api/leaderboard - Get top 10 students
router.get('/', getLeaderboard);

module.exports = router;

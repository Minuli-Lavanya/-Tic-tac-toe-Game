const express = require('express');
const userController = require('./controllers/userController');
const gameController = require('./controllers/gameController');
const protectRoute = require('./middleware/auth');

const router = express.Router();

// User Routes
router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);

// Game Routes
router.post('/game', protectRoute, gameController.createGame);
router.post('/game/move', protectRoute, gameController.makeMove);

module.exports = router;

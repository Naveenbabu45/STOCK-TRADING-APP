const express = require('express');
const { registerUser, loginUser, getProfile, updateProfile, getWatchlist, addToWatchlist, removeFromWatchlist } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/watchlist', protect, getWatchlist);
router.post('/watchlist', protect, addToWatchlist);
router.delete('/watchlist/:symbol', protect, removeFromWatchlist);

module.exports = router;

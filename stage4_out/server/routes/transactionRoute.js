const express = require('express');
const { createTransaction, getUserTransactions, getAllTransactions } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createTransaction);
router.get('/user', protect, getUserTransactions);
router.get('/', protect, getAllTransactions);

module.exports = router;

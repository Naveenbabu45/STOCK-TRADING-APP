const express = require('express');
const { getStocks, getStockBySymbol, getStockHistory, getPortfolio } = require('../controllers/stockController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getStocks);
router.get('/history/:symbol', getStockHistory);
router.get('/portfolio/me', protect, getPortfolio);
router.get('/:symbol', getStockBySymbol);

module.exports = router;

const Stock = require('../models/stockModel');
const { getQuote, getMarket, getHistory } = require('../services/marketDataService');

const getStocks = async (req, res) => {
  try {
    const stocks = await getMarket();
    res.json(stocks.map((stock) => ({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      previousClose: stock.previousClose,
      change: stock.change,
      changePercent: stock.changePercent,
      stockExchange: stock.exchange,
    })));
  } catch (error) {
    console.error('getStocks:', error);
    res.status(503).json({ message: 'Market data is temporarily unavailable' });
  }
};

const getStockBySymbol = async (req, res) => {
  try {
    const stock = await getQuote(req.params.symbol);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.json({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      previousClose: stock.previousClose,
      change: stock.change,
      changePercent: stock.changePercent,
      stockExchange: stock.exchange,
    });
  } catch (error) {
    console.error('getStockBySymbol:', error);
    res.status(503).json({ message: 'Market data is temporarily unavailable' });
  }
};

const getStockHistory = async (req, res) => {
  try {
    const history = await getHistory(req.params.symbol, req.query.range || '1mo');
    if (!history) return res.status(404).json({ message: 'Stock not found' });
    res.json(history);
  } catch (error) {
    console.error('getStockHistory:', error);
    res.status(503).json({ message: 'Historical data is temporarily unavailable' });
  }
};

const getPortfolio = async (req, res) => {
  try {
    const holdings = await Stock.find({ user: req.user._id }).sort({ symbol: 1 });
    const enriched = await Promise.all(holdings.map(async (holding) => {
      const quote = await getQuote(holding.symbol);
      const avgPrice = Number(holding.price.toFixed(2));
      const currentPrice = quote?.price ?? avgPrice;
      const marketValue = Number((currentPrice * holding.count).toFixed(2));
      const costBasis = Number((avgPrice * holding.count).toFixed(2));
      const pnl = Number((marketValue - costBasis).toFixed(2));
      return {
        _id: holding._id,
        symbol: holding.symbol,
        name: quote?.name || holding.name,
        count: holding.count,
        price: avgPrice,
        avgPrice,
        currentPrice,
        totalPrice: costBasis,
        marketValue,
        pnl,
        pnlPercent: costBasis > 0 ? Number(((pnl / costBasis) * 100).toFixed(2)) : 0,
        stockExchange: quote?.exchange || holding.stockExchange,
      };
    }));
    res.json(enriched);
  } catch (error) {
    console.error('getPortfolio:', error);
    res.status(500).json({ message: 'Unable to load portfolio' });
  }
};

module.exports = { getStocks, getStockBySymbol, getStockHistory, getPortfolio };

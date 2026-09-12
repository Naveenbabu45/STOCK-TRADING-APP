const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Stock = require('../models/stockModel');
const Transaction = require('../models/transactionModel');
const { getQuote } = require('../services/marketDataService');

const parseTradeInput = (body) => {
  const symbol = String(body.symbol || '').trim().toUpperCase();
  const count = Number(body.count);
  const orderType = String(body.orderType || '').trim().toLowerCase();

  if (!symbol || !Number.isInteger(count) || count <= 0) {
    return { error: 'A valid stock symbol and whole-number quantity are required' };
  }
  if (!['buy', 'sell'].includes(orderType)) {
    return { error: 'Order type must be buy or sell' };
  }
  if (symbol.length > 10) return { error: 'Invalid stock symbol' };
  return { symbol, count, orderType };
};

const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const parsed = parseTradeInput(req.body);
    if (parsed.error) return res.status(400).json({ message: parsed.error });

    const { symbol, count, orderType } = parsed;
    const quote = await getQuote(symbol);
    if (!quote) return res.status(404).json({ message: 'Stock is not available for trading' });

    const executionPrice = Number(quote.price.toFixed(2));
    const totalPrice = Number((executionPrice * count).toFixed(2));
    let createdOrder;

    await session.withTransaction(async () => {
      const user = await User.findById(req.user._id).session(session);
      if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

      const ownedStock = await Stock.findOne({ user: user._id, symbol }).session(session);

      if (orderType === 'sell' && (!ownedStock || ownedStock.count < count)) {
        throw Object.assign(new Error('Not enough shares to sell'), { status: 400 });
      }
      if (orderType === 'buy' && user.balance < totalPrice) {
        throw Object.assign(new Error('Insufficient balance'), { status: 400 });
      }

      let realizedPnl = 0;

      if (orderType === 'buy') {
        user.balance = Number((user.balance - totalPrice).toFixed(2));
        await user.save({ session });

        if (ownedStock) {
          const previousCost = ownedStock.price * ownedStock.count;
          const newCount = ownedStock.count + count;
          ownedStock.price = Number(((previousCost + totalPrice) / newCount).toFixed(2));
          ownedStock.count = newCount;
          ownedStock.totalPrice = Number((ownedStock.price * newCount).toFixed(2));
          ownedStock.currentPrice = executionPrice;
          ownedStock.name = quote.name;
          ownedStock.stockExchange = quote.exchange;
          await ownedStock.save({ session });
        } else {
          await Stock.create([{
            user: user._id,
            symbol,
            name: quote.name,
            price: executionPrice,
            currentPrice: executionPrice,
            count,
            totalPrice,
            stockExchange: quote.exchange,
          }], { session });
        }
      } else {
        realizedPnl = Number(((executionPrice - ownedStock.price) * count).toFixed(2));
        user.balance = Number((user.balance + totalPrice).toFixed(2));
        await user.save({ session });

        ownedStock.count -= count;
        ownedStock.currentPrice = executionPrice;
        ownedStock.totalPrice = Number((ownedStock.price * ownedStock.count).toFixed(2));
        if (ownedStock.count === 0) await Stock.deleteOne({ _id: ownedStock._id }).session(session);
        else await ownedStock.save({ session });
      }

      [createdOrder] = await Order.create([{
        user: user._id,
        symbol,
        name: quote.name,
        price: executionPrice,
        count,
        totalPrice,
        stockType: quote.exchange,
        orderType,
        orderStatus: 'completed',
        realizedPnl,
      }], { session });

      await Transaction.create([{
        user: user._id,
        type: orderType,
        paymentMode: 'wallet',
        amount: totalPrice,
        symbol,
        quantity: count,
        price: executionPrice,
        realizedPnl,
      }], { session });
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('createOrder:', error);
    const status = error.status || 500;
    const message = status === 500 && /transaction|replica set|topology/i.test(error.message)
      ? 'Trading requires MongoDB transactions. Use MongoDB Atlas or a replica-set MongoDB instance.'
      : (error.message || 'Unable to complete order');
    res.status(status).json({ message });
  } finally {
    await session.endSession();
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('getUserOrders:', error);
    res.status(500).json({ message: 'Unable to load orders' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    if (req.user.usertype !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const orders = await Order.find().populate('user', 'username').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('getAllOrders:', error);
    res.status(500).json({ message: 'Unable to load orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    if (req.user.usertype !== 'admin') return res.status(403).json({ message: 'Access denied' });
    return res.status(400).json({ message: 'Completed trades cannot be manually changed' });
  } catch (error) {
    console.error('updateOrderStatus:', error);
    res.status(500).json({ message: 'Unable to update order' });
  }
};

module.exports = { createOrder, getUserOrders, getAllOrders, updateOrderStatus };

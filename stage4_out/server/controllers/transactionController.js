const Transaction = require('../models/transactionModel');

const createTransaction = async (req, res) => {
  try {
    const { type, paymentMode, amount } = req.body;
    if (!type || !paymentMode || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Valid type, paymentMode, and positive amount are required' });
    }
    if (!['deposit', 'withdrawal'].includes(type)) {
      return res.status(403).json({ message: 'Trade transactions are created automatically by the order engine' });
    }
    return res.status(501).json({ message: 'Deposits and withdrawals are not enabled yet' });
  } catch (error) {
    console.error('createTransaction:', error);
    res.status(500).json({ message: 'Unable to create transaction' });
  }
};

const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('getUserTransactions:', error);
    res.status(500).json({ message: 'Unable to load transactions' });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    if (req.user.usertype !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const transactions = await Transaction.find().populate('user', 'username').sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('getAllTransactions:', error);
    res.status(500).json({ message: 'Unable to load transactions' });
  }
};

module.exports = { createTransaction, getUserTransactions, getAllTransactions };

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['deposit', 'withdrawal', 'buy', 'sell', 'debit', 'credit'], required: true },
    paymentMode: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    symbol: { type: String, uppercase: true, trim: true },
    quantity: { type: Number, min: 0 },
    price: { type: Number, min: 0 },
    realizedPnl: { type: Number },
    time: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

transactionSchema.index({ user: 1, time: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);

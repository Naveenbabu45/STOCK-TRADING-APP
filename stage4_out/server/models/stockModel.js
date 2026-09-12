const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currentPrice: {
      type: Number,
      min: 0,
    },
    count: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    stockExchange: {
      type: String,
      default: 'NASDAQ',
    },
  },
  { timestamps: true }
);

stockSchema.index({ user: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('Stock', stockSchema);

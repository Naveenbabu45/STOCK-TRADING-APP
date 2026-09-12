const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    usertype: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    balance: {
      type: Number,
      default: 100000,
    },
    watchlist: {
      type: [String],
      default: [],
      validate: {
        validator: (symbols) => symbols.length <= 50,
        message: 'Watchlist cannot contain more than 50 symbols',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

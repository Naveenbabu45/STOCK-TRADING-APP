const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const generateToken = (id) => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const registerUser = async (req, res) => {
  try {
    const username = String(req.body.username || '').trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');

    // Never accept usertype/role from public registration.
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ message: 'Username must be between 3 and 30 characters' });
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
      return res.status(400).json({ message: 'Username contains invalid characters' });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({ message: 'Password must be between 8 and 128 characters' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        usertype: user.usertype,
        balance: user.balance,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Username or email is already registered' });
    }
    console.error('registerUser:', error);
    res.status(500).json({ message: 'Unable to create account' });
  }
};

const loginUser = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        usertype: user.usertype,
        balance: user.balance,
      },
    });
  } catch (error) {
    console.error('loginUser:', error);
    res.status(500).json({ message: 'Unable to sign in' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('getProfile:', error);
    res.status(500).json({ message: 'Unable to load profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updates = {};

    if (req.body.username !== undefined) {
      const username = String(req.body.username).trim();
      if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(username)) {
        return res.status(400).json({ message: 'Username must be 3–30 characters and use only letters, numbers, _, ., or -' });
      }
      updates.username = username;
    }

    if (req.body.email !== undefined) {
      const email = normalizeEmail(req.body.email);
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address' });
      }
      updates.email = email;
    }

    if (req.body.password !== undefined) {
      const password = String(req.body.password);
      if (password.length < 8 || password.length > 128) {
        return res.status(400).json({ message: 'Password must be between 8 and 128 characters' });
      }
      updates.password = await bcrypt.hash(password, 12);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No profile changes provided' });
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Username or email is already in use' });
    }
    console.error('updateProfile:', error);
    res.status(500).json({ message: 'Unable to update profile' });
  }
};

const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('watchlist');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.watchlist || []);
  } catch (error) {
    console.error('getWatchlist:', error);
    res.status(500).json({ message: 'Unable to load watchlist' });
  }
};

const addToWatchlist = async (req, res) => {
  try {
    const symbol = String(req.body.symbol || '').trim().toUpperCase();
    if (!/^[A-Z.]{1,10}$/.test(symbol)) return res.status(400).json({ message: 'Invalid stock symbol' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.watchlist.includes(symbol)) return res.json(user.watchlist);
    if (user.watchlist.length >= 50) return res.status(400).json({ message: 'Watchlist limit reached (50)' });

    user.watchlist.push(symbol);
    await user.save();
    res.status(201).json(user.watchlist);
  } catch (error) {
    console.error('addToWatchlist:', error);
    res.status(500).json({ message: 'Unable to update watchlist' });
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const symbol = String(req.params.symbol || '').trim().toUpperCase();
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { watchlist: symbol } },
      { new: true }
    ).select('watchlist');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.watchlist || []);
  } catch (error) {
    console.error('removeFromWatchlist:', error);
    res.status(500).json({ message: 'Unable to update watchlist' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
};

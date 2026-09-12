const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const userRoute = require('./routes/userRoute');
const stockRoute = require('./routes/stockRoute');
const orderRoute = require('./routes/orderRoute');
const transactionRoute = require('./routes/transactionRoute');

const app = express();
const PORT = Number(process.env.PORT) || 5000;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET is missing or too short. Use a random secret with at least 32 characters.');
}
if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is required.');
}

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

connectDB();

app.disable('x-powered-by');
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '100kb' }));

app.get('/', (req, res) => {
  res.json({ message: 'SB Stocks API is running', status: 'ok' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'sb-stocks-api' });
});

app.use('/api/users', userRoute);
app.use('/api/stocks', stockRoute);
app.use('/api/orders', orderRoute);
app.use('/api/transactions', transactionRoute);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`SB Stocks API running on port ${PORT}`);
});

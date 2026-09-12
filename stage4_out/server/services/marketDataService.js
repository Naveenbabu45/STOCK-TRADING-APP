const FALLBACK_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', price: 227.16 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', price: 506.79 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', price: 177.97 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', price: 230.15 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ', price: 253.75 },
  { symbol: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ', price: 751.53 },
  { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ', price: 395.94 },
  { symbol: 'NFLX', name: 'Netflix Inc.', exchange: 'NASDAQ', price: 1216.88 },
  { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', exchange: 'NASDAQ', price: 168.57 },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', exchange: 'NYSE', price: 314.47 },
  { symbol: 'V', name: 'Visa Inc.', exchange: 'NYSE', price: 342.21 },
  { symbol: 'WMT', name: 'Walmart Inc.', exchange: 'NYSE', price: 108.91 },
];

const cache = new Map();
const CACHE_MS = 60 * 1000;

const normalizeQuote = (result, fallback) => {
  const meta = result?.chart?.result?.[0]?.meta;
  const price = Number(meta?.regularMarketPrice);
  const previousClose = Number(meta?.chartPreviousClose ?? meta?.previousClose);
  if (!Number.isFinite(price) || price <= 0) return null;
  const change = Number.isFinite(previousClose) && previousClose > 0 ? price - previousClose : 0;
  const changePercent = Number.isFinite(previousClose) && previousClose > 0 ? (change / previousClose) * 100 : 0;
  return {
    symbol: fallback.symbol,
    name: meta?.longName || meta?.shortName || fallback.name,
    exchange: meta?.fullExchangeName || fallback.exchange,
    price: Number(price.toFixed(2)),
    previousClose: Number((previousClose || price).toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
  };
};

const fetchYahoo = async (symbol, range = '1mo') => {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=1d`;
  const response = await fetch(url, { headers: { 'User-Agent': 'SB-Stocks/1.0' } });
  if (!response.ok) throw new Error(`Market data provider returned ${response.status}`);
  return response.json();
};

const getQuote = async (symbol) => {
  const fallback = FALLBACK_STOCKS.find((stock) => stock.symbol === symbol.toUpperCase());
  if (!fallback) return null;
  const key = `quote:${fallback.symbol}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_MS) return cached.value;

  try {
    const quote = normalizeQuote(await fetchYahoo(fallback.symbol), fallback);
    const value = quote || { ...fallback, previousClose: fallback.price, change: 0, changePercent: 0 };
    cache.set(key, { timestamp: Date.now(), value });
    return value;
  } catch (error) {
    const value = { ...fallback, previousClose: fallback.price, change: 0, changePercent: 0, source: 'fallback' };
    cache.set(key, { timestamp: Date.now(), value });
    return value;
  }
};

const getMarket = async () => Promise.all(FALLBACK_STOCKS.map((stock) => getQuote(stock.symbol)));

const getHistory = async (symbol, range = '1mo') => {
  const fallback = FALLBACK_STOCKS.find((stock) => stock.symbol === symbol.toUpperCase());
  if (!fallback) return null;
  try {
    const result = await fetchYahoo(fallback.symbol, range);
    const chart = result?.chart?.result?.[0];
    const timestamps = chart?.timestamp || [];
    const closes = chart?.indicators?.quote?.[0]?.close || [];
    const history = timestamps
      .map((timestamp, index) => ({ date: new Date(timestamp * 1000).toISOString().slice(0, 10), price: Number(closes[index]) }))
      .filter((point) => Number.isFinite(point.price) && point.price > 0);
    if (history.length) return history;
  } catch (_) {
    // Use deterministic fallback data when the provider is unavailable.
  }

  const base = fallback.price;
  return Array.from({ length: 20 }, (_, index) => ({
    date: new Date(Date.now() - (19 - index) * 86400000).toISOString().slice(0, 10),
    price: Number((base * (1 + Math.sin(index / 2.7) * 0.025 + (index - 19) * 0.001)).toFixed(2)),
  }));
};

module.exports = { getQuote, getMarket, getHistory, FALLBACK_STOCKS };

const fetch = require('node-fetch');
const token = "lYNZvDYASVv9KjQYTpdKgU8pQfBRi04n";

async function test() {
  // Quote
  const qRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=AAPL&token=${token}`);
  console.log("Quote:", await qRes.json());

  // Search
  const sRes = await fetch(`https://finnhub.io/api/v1/search?q=apple&token=${token}`);
  const sData = await sRes.json();
  console.log("Search (first 2):", sData.result?.slice(0, 2));

  // Candles (1 month daily)
  const to = Math.floor(Date.now() / 1000);
  const from = to - (30 * 24 * 60 * 60);
  const cRes = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=D&from=${from}&to=${to}&token=${token}`);
  console.log("Candles (partial):", (await cRes.json()).c?.slice(0, 2));
}
test();

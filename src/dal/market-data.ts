import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";

import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const BASE_URL = "https://finnhub.io/api/v1";

export async function getStockPrice(symbol: string): Promise<number> {
  "use cache";
  cacheTag(`price-stock-${symbol}`);
  cacheLife({ revalidate: 35, expire: 35, stale: 35 });
  await connection;
  if (!FINNHUB_API_KEY) {
    return Number((Math.random() * 100 + 50).toFixed(2));
  }

  try {
    const res = await fetch(
      `${BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
    );

    if (!res.ok) throw new Error("Failed to fetch stock price");

    const data = await res.json();
    if (data.c === 0 && data.h === 0) throw new Error("Quote not found");

    return data.c;
  } catch (e) {
    console.error(e);
    return Number((Math.random() * 100 + 50).toFixed(2)); // Fallback for dev without keys
  }
}

export async function getStockQuote(symbol: string): Promise<{ price: number; changePercent: number }> {
  "use cache";
  cacheTag(`quote-stock-${symbol}`);
  cacheLife({ revalidate: 35, expire: 35, stale: 35 });
  await connection;
  if (!FINNHUB_API_KEY) {
    const price = Number((Math.random() * 100 + 50).toFixed(2));
    const change = Number((Math.random() * 10 - 5).toFixed(2));
    return { price, changePercent: change };
  }

  try {
    const res = await fetch(
      `${BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
    );

    if (!res.ok) throw new Error("Failed to fetch stock quote");

    const data = await res.json();
    if (data.c === 0 && data.h === 0) throw new Error("Quote not found");

    return {
      price: data.c,
      changePercent: data.dp,
    };
  } catch (e) {
    console.error(e);
    const price = Number((Math.random() * 100 + 50).toFixed(2));
    const change = Number((Math.random() * 10 - 5).toFixed(2));
    return { price, changePercent: change };
  }
}

export async function searchMarketStocks(query: string) {
  "use cache";
  cacheTag(`popular-stocks`);
  cacheLife("weeks");
  if (!FINNHUB_API_KEY) {
    const popular = [
      "AAPL",
      "MSFT",
      "GOOGL",
      "AMZN",
      "TSLA",
      "META",
      "NVDA",
      "NFLX",
      "AMD",
      "INTC",
    ];
    return popular
      .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
      .map((s) => ({ symbol: s, name: `${s} Inc.` }));
  }

  try {
    const res = await fetch(
      `${BASE_URL}/search?q=${query}&token=${FINNHUB_API_KEY}`,
    );

    if (!res.ok) throw new Error("Failed to fetch assets");

    const data = await res.json();
    if (!data.result) return [];

    // Filter only common stocks to avoid warrants, forex, etc.
    const filtered = data.result
      .filter((a: any) => !a.symbol.includes(".") && !a.symbol.includes(":"))
      .slice(0, 10);

    return filtered.map((a: any) => ({
      symbol: a.symbol,
      name: a.description,
    }));
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function fetchYahooBars(
  symbol: string,
  interval: "5m" | "1h" | "1d" | "1wk" | "1mo",
  period1: number,
  period2: number,
): Promise<{ time: number; price: number }[] | null> {
  "use cache";
  cacheTag(`stock-bar-yahoo-${symbol}-${interval}-${period1}-${period2}`);
  cacheLife({ stale: 35, revalidate: 35, expire: 35 });
  await connection;
  try {
    const result: any = await yahooFinance.chart(symbol, {
      period1: new Date(period1 * 1000),
      period2: new Date(period2 * 1000),
      interval,
    });

    if (!result.quotes || result.quotes.length === 0) {
      console.warn(`No quotes returned from Yahoo for ${symbol} (${interval})`);
      return [];
    }

    return result.quotes
      .filter((q: any) => q.close !== null && q.date !== null)
      .map((q: any) => ({
        time: Math.floor(new Date(q.date).getTime() / 1000),
        price: Number(q.close!.toFixed(2)),
      }));
  } catch (e: any) {
    console.error(`Yahoo Finance error for ${symbol}:`, e.message, e.stack);
    return null;
  }
}

export async function getStockBars(
  symbol: string,
  timeframe: "1D" | "1W" | "1M" | "1Y" | "5Y",
) {
  try {
    // Round to nearest 30 seconds to improve cache hits
    const to = Math.floor(Date.now() / 30000) * 30;
    let from = to;
    let interval: "5m" | "1h" | "1d" | "1wk" | "1mo" = "1d";

    switch (timeframe) {
      case "1D":
        // Fetch last 7 days to ensure we get the most recent trading day
        from = to - 7 * 24 * 60 * 60;
        interval = "5m";
        break;
      case "1W":
        from = to - 7 * 24 * 60 * 60;
        interval = "1h";
        break;
      case "1M":
        from = to - 30 * 24 * 60 * 60;
        interval = "1d";
        break;
      case "1Y":
        from = to - 365 * 24 * 60 * 60;
        interval = "1wk";
        break;
      case "5Y":
        from = to - 5 * 365 * 24 * 60 * 60;
        interval = "1mo";
        break;
    }

    const data = await fetchYahooBars(symbol, interval, from, to);

    if (timeframe === "1D" && data && data.length > 0) {
      // If we fetched multiple days, just show the latest day's data
      const lastDate = new Date(
        data[data.length - 1].time * 1000,
      ).toDateString();
      return data.filter(
        (d) => new Date(d.time * 1000).toDateString() === lastDate,
      );
    }

    return data || [];
  } catch (e) {
    console.error(`Error in getStockBars for ${symbol}:`, e);
    return [];
  }
}

export async function getCompanyDetails(symbol: string) {
  if (!FINNHUB_API_KEY) return null;

  try {
    const [profileRes, metricRes] = await Promise.all([
      fetch(
        `${BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
        { next: { revalidate: 86400 } },
      ),
      fetch(
        `${BASE_URL}/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`,
        { next: { revalidate: 86400 } },
      ),
    ]);

    const profile = await profileRes.json();
    const metrics = await metricRes.json();

    let logoUrl = profile.logo || null;
    if (!logoUrl && profile.weburl) {
      try {
        const hostname = new URL(profile.weburl).hostname;
        logoUrl = `https://logo.clearbit.com/${hostname}`;
      } catch (e) {
        // ignore invalid urls
      }
    }

    return {
      logo: logoUrl,
      marketCap: profile.marketCapitalization || null, // usually in millions
      dividendYield: metrics.metric?.dividendYieldIndicatedAnnual || null,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

function generateMockBars(timeframe: string) {
  const points =
    timeframe === "1D"
      ? 24
      : timeframe === "1W"
        ? 7
        : timeframe === "1M"
          ? 30
          : timeframe === "1Y"
            ? 12
            : 60;
  const data = [];
  let price = 150;
  for (let i = 0; i < points; i++) {
    price = price + (Math.random() * 10 - 5);
    data.push({ time: i, price: Number(price.toFixed(2)) });
  }
  return data;
}

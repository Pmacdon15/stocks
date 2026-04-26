"use server";

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const BASE_URL = "https://finnhub.io/api/v1";

export async function getStockPrice(symbol: string): Promise<number> {
  if (!FINNHUB_API_KEY) {
    return Number((Math.random() * 100 + 50).toFixed(2));
  }

  try {
    const res = await fetch(
      `${BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
      { next: { tags: [`price-stock-${symbol}`] } },
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

export async function searchMarketStocks(query: string) {
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
      {
        next: { revalidate: 3600 },
      },
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

export async function getStockBars(
  symbol: string,
  timeframe: "1D" | "1W" | "1M" | "1Y" | "5Y",
) {
  if (!FINNHUB_API_KEY) {
    return generateMockBars(timeframe);
  }

  try {
    const to = Math.floor(Date.now() / 1000);
    let from = to;
    let resolution = "D";

    switch (timeframe) {
      case "1D":
        from = to - 24 * 60 * 60;
        resolution = "5";
        break;
      case "1W":
        from = to - 7 * 24 * 60 * 60;
        resolution = "60";
        break;
      case "1M":
        from = to - 30 * 24 * 60 * 60;
        resolution = "D";
        break;
      case "1Y":
        from = to - 365 * 24 * 60 * 60;
        resolution = "W";
        break;
      case "5Y":
        from = to - 5 * 365 * 24 * 60 * 60;
        resolution = "M";
        break;
    }

    const res = await fetch(
      `${BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`,
      {
        next: { revalidate: 60 },
      },
    );

    if (!res.ok) throw new Error("Failed to fetch candles");

    const data = await res.json();
    if (data.s === "no_data" || !data.c) {
      return generateMockBars(timeframe);
    }

    return data.c.map((closePrice: number, index: number) => ({
      time: data.t[index],
      price: Number(closePrice.toFixed(2)),
    }));
  } catch (e) {
    console.error(e);
    return generateMockBars(timeframe);
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

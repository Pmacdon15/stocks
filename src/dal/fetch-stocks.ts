export async function fetchHomePageStocks(symbols: string[]) {
  try {
    const tickers = symbols.join(",");
    const url = `https://api.massive.com/v3/snapshot?ticker.any_of=${tickers}&apiKey=${process.env.API_KEY || ""}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Home Page Stocks Results: ", data);

    // MarketData snapshot format is usually { results: [...] } or direct array
    // We'll return the results directly to maintain compatibility if possible
    return data.results || data;
  } catch (e) {
    console.error("Error", e);
    return { error: `Error fetching stocks` };
  }
}

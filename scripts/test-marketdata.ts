import { fetchHomePageStocks } from "../src/dal/fetch-stocks";

async function test() {
  process.env.API_KEY = "lYNZvDYASVv9KjQYTpdKgU8pQfBRi04n"; // From .env.local
  const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN"];
  console.log(`Fetching stocks for: ${symbols.join(", ")}`);
  const results = await fetchHomePageStocks(symbols);
  console.log("Test Results:", JSON.stringify(results, null, 2));
}

test();

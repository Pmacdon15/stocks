import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import { sql } from "./index";

export type User = {
  id: number;
  clerk_id: string;
  balance: string;
  created_at: Date;
};

export type UserStock = {
  id: number;
  user_id: string;
  symbol: string;
  created_at: Date;
};

export type Transaction = {
  id: number;
  user_id: string;
  symbol: string;
  shares: number;
  price: string;
  type: "BUY" | "SELL";
  created_at: Date;
};

export async function getUser(clerkId: string): Promise<User | null> {
  await connection;
  const result = await sql`SELECT * FROM users WHERE clerk_id = ${clerkId}`;
  return (result[0] as User) || null;
}

export async function createUser(clerkId: string): Promise<User> {
  const result = await sql`
    INSERT INTO users (clerk_id) 
    VALUES (${clerkId}) 
    RETURNING *
  `;
  return result[0] as User;
}

export async function getUserFollowedStocks(
  clerkId: string,
): Promise<UserStock[]> {
  "use cache";
  cacheTag(`followed-stocks-${clerkId}`);
  cacheLife("days");

  const result = await sql`
    SELECT * FROM user_stocks 
    WHERE user_id = ${clerkId}
    ORDER BY created_at DESC
  `;
  return result as UserStock[];
}

export async function followStockDb(
  clerkId: string,
  symbol: string,
): Promise<UserStock> {
  const result = await sql`
    INSERT INTO user_stocks (user_id, symbol) 
    VALUES (${clerkId}, ${symbol})
    ON CONFLICT (user_id, symbol) DO NOTHING RETURNING *
  `;
  return (
    (result[0] as UserStock) || {
      user_id: clerkId,
      symbol,
      created_at: new Date(),
    }
  );
}

export async function unfollowStockDb(
  clerkId: string,
  symbol: string,
): Promise<UserStock> {
  const result = await sql`
    DELETE FROM user_stocks 
    WHERE user_id = ${clerkId} AND symbol = ${symbol} RETURNING *
  `;
  return (
    (result[0] as UserStock) || {
      user_id: clerkId,
      symbol,
      created_at: new Date(),
    }
  );
}

export async function getTransactions(
  clerkId: string,
  limit: number = 20,
  offset: number = 0,
  search?: string,
  timezone: string = 'UTC'
): Promise<{ transactions: Transaction[]; total: number }> {
  'use cache'
  cacheTag(`transactions-${clerkId}`)
  cacheLife('days')
  const searchQuery = search ? `%${search}%` : null;

  const [transactions, countResult] = await Promise.all([
    searchQuery
      ? sql`
          SELECT * FROM transactions 
          WHERE user_id = ${clerkId}
          AND (
            symbol ILIKE ${searchQuery} 
            OR price::text ILIKE ${searchQuery} 
            OR shares::text ILIKE ${searchQuery}
            OR (price * shares)::text ILIKE ${searchQuery}
            OR to_char(created_at AT TIME ZONE ${timezone}, 'MM/DD/YYYY') ILIKE ${searchQuery}
            OR to_char(created_at AT TIME ZONE ${timezone}, 'YYYY-MM-DD') ILIKE ${searchQuery}
          )
          ORDER BY created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `
      : sql`
          SELECT * FROM transactions 
          WHERE user_id = ${clerkId}
          ORDER BY created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `,
    searchQuery
      ? sql`
          SELECT COUNT(*) as count FROM transactions 
          WHERE user_id = ${clerkId} 
          AND (
            symbol ILIKE ${searchQuery} 
            OR price::text ILIKE ${searchQuery} 
            OR shares::text ILIKE ${searchQuery}
            OR (price * shares)::text ILIKE ${searchQuery}
            OR to_char(created_at AT TIME ZONE ${timezone}, 'MM/DD/YYYY') ILIKE ${searchQuery}
            OR to_char(created_at AT TIME ZONE ${timezone}, 'YYYY-MM-DD') ILIKE ${searchQuery}
          )
        `
      : sql`SELECT COUNT(*) as count FROM transactions WHERE user_id = ${clerkId}`,
  ]);

  return {
    transactions: transactions as Transaction[],
    total: Number(countResult[0].count),
  };
}

export async function getOwnedStocks(
  clerkId: string,
): Promise<{ symbol: string; shares: number; averageCost: number }[]> {
  "use cache";
  cacheTag(`portfolio-${clerkId}`);
  cacheLife("days");
  const result = await sql`
    SELECT 
      symbol, 
      SUM(CASE WHEN type = 'BUY' THEN shares ELSE -shares END) as shares,
      SUM(CASE WHEN type = 'BUY' THEN price * shares ELSE 0 END) / NULLIF(SUM(CASE WHEN type = 'BUY' THEN shares ELSE 0 END), 0) as average_cost
    FROM transactions
    WHERE user_id = ${clerkId}
    GROUP BY symbol
    HAVING SUM(CASE WHEN type = 'BUY' THEN shares ELSE -shares END) > 0
  `;
  return result.map((r) => ({
    symbol: r.symbol,
    shares: Number(r.shares),
    averageCost: Number(r.average_cost),
  }));
}

export async function executeTradeDb(
  clerkId: string,
  symbol: string,
  shares: number,
  price: number,
  type: "BUY" | "SELL",
): Promise<void> {
  const totalCost = shares * price;
  const balanceAdjustment = type === "BUY" ? -totalCost : totalCost;

  // Neon serverless HTTP transaction
  await sql.transaction([
    sql`UPDATE users SET balance = balance + ${balanceAdjustment} WHERE clerk_id = ${clerkId}`,
    sql`INSERT INTO transactions (user_id, symbol, shares, price, type) VALUES (${clerkId}, ${symbol}, ${shares}, ${price}, ${type}) RETURNING *`,
  ]);
}

export async function addDividendDb(
  clerkId: string,
  amount: number,
): Promise<void> {
  await sql`UPDATE users SET balance = balance + ${amount} WHERE clerk_id = ${clerkId}`;
}

export async function getAllOwnedStocksWithUsers(): Promise<
  { symbol: string; user_id: string; shares: number }[]
> {
  const result = await sql`
    SELECT 
      symbol, 
      user_id,
      SUM(CASE WHEN type = 'BUY' THEN shares ELSE -shares END) as shares
    FROM transactions
    GROUP BY symbol, user_id
    HAVING SUM(CASE WHEN type = 'BUY' THEN shares ELSE -shares END) > 0
  `;
  return result.map((r) => ({
    symbol: r.symbol,
    user_id: r.user_id,
    shares: Number(r.shares),
  }));
}

export async function getUserAmountOfStocksDb(
  clerkId: string,
): Promise<number> {
  const result = await sql`
    SELECT COUNT(*) as count FROM (
      SELECT symbol
      FROM transactions
      WHERE user_id = ${clerkId}
      GROUP BY symbol
      HAVING SUM(CASE WHEN type = 'BUY' THEN shares ELSE -shares END) > 0
    ) as owned_stocks
  `;
  return Number(result[0].count);
}

export async function savePortfolioSnapshot(
  clerkId: string,
  totalValue: number,
): Promise<void> {
  await sql`
    INSERT INTO portfolio_snapshots (user_id, total_value)
    VALUES (${clerkId}, ${totalValue})
  `;
}

export async function getPortfolioSnapshots(
  clerkId: string,
  timeframe: "1D" | "1W" | "1M" | "1Y" | "5Y",
): Promise<{ time: number; value: number }[]> {
  "use cache";
  cacheTag(`portfolio-snapshots-${clerkId}`);
  cacheLife('days')
  let intervalDays = 7;

  switch (timeframe) {
    case "1D":
      intervalDays = 1;
      break;
    case "1W":
      intervalDays = 7;
      break;
    case "1M":
      intervalDays = 30;
      break;
    case "1Y":
      intervalDays = 365;
      break;
    case "5Y":
      intervalDays = 365 * 5;
      break;
  }

  const result = await sql`
    SELECT 
      EXTRACT(EPOCH FROM created_at) as time,
      total_value as value
    FROM portfolio_snapshots
    WHERE user_id = ${clerkId} 
    AND created_at >= NOW() - (${intervalDays} || ' days')::interval
    ORDER BY created_at ASC
  `;

  return result.map((r) => ({
    time: Number(r.time),
    value: Number(r.value),
  }));
}

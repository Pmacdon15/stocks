import { sql } from './index';

export type User = {
  id: number;
  clerk_id: string;
  balance: string; // Decimal comes back as string from postgres
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
  type: 'BUY' | 'SELL';
  created_at: Date;
};

export async function getUser(clerkId: string): Promise<User | null> {
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

export async function getUserFollowedStocks(clerkId: string): Promise<UserStock[]> {
  const result = await sql`
    SELECT * FROM user_stocks 
    WHERE user_id = ${clerkId}
    ORDER BY created_at DESC
  `;
  return result as UserStock[];
}

export async function followStockDb(clerkId: string, symbol: string): Promise<void> {
  await sql`
    INSERT INTO user_stocks (user_id, symbol) 
    VALUES (${clerkId}, ${symbol})
    ON CONFLICT (user_id, symbol) DO NOTHING
  `;
}

export async function unfollowStockDb(clerkId: string, symbol: string): Promise<void> {
  await sql`
    DELETE FROM user_stocks 
    WHERE user_id = ${clerkId} AND symbol = ${symbol}
  `;
}

export async function getTransactions(clerkId: string): Promise<Transaction[]> {
  const result = await sql`
    SELECT * FROM transactions 
    WHERE user_id = ${clerkId}
    ORDER BY created_at DESC
  `;
  return result as Transaction[];
}

export async function getOwnedStocks(clerkId: string): Promise<{ symbol: string; shares: number; averageCost: number }[]> {
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
  return result.map(r => ({ symbol: r.symbol, shares: Number(r.shares), averageCost: Number(r.average_cost) }));
}

export async function executeTradeDb(clerkId: string, symbol: string, shares: number, price: number, type: 'BUY' | 'SELL'): Promise<void> {
  const totalCost = shares * price;
  const balanceAdjustment = type === 'BUY' ? -totalCost : totalCost;
  
  // Neon serverless HTTP transaction
  await sql.transaction([
    sql`UPDATE users SET balance = balance + ${balanceAdjustment} WHERE clerk_id = ${clerkId}`,
    sql`INSERT INTO transactions (user_id, symbol, shares, price, type) VALUES (${clerkId}, ${symbol}, ${shares}, ${price}, ${type})`
  ]);
}

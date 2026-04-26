import { NextResponse } from 'next/server';
import { getStockBars } from '@/dal/market-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const timeframe = searchParams.get('timeframe') as any;

  if (!symbol || !timeframe) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const results = await getStockBars(symbol, timeframe);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stock bars' }, { status: 500 });
  }
}

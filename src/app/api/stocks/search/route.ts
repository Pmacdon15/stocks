import { NextResponse } from 'next/server';
import { searchMarketStocks } from '@/dal/market-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const results = await searchMarketStocks(query);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to search stocks' }, { status: 500 });
  }
}

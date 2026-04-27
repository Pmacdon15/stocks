import { NextResponse } from 'next/server';
import { getCompanyDetails } from '@/dal/market-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'Missing symbol' }, { status: 400 });
  }

  try {
    const results = await getCompanyDetails(symbol);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch company details' }, { status: 500 });
  }
}

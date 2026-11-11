import { NextRequest, NextResponse } from 'next/server';
import { validateNwcUri, getNwcBalance } from '@/lib/lightning/nwc';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { connectionUri } = body;

    const validation = validateNwcUri(connectionUri);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const balance = await getNwcBalance(connectionUri);
    return NextResponse.json(balance);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch NWC balance' },
      { status: 500 }
    );
  }
}

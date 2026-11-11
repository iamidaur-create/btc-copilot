import { NextRequest, NextResponse } from 'next/server';
import { validateNwcUri, getNwcInfo } from '@/lib/lightning/nwc';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { connectionUri } = body;

    const validation = validateNwcUri(connectionUri);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const info = await getNwcInfo(connectionUri);
    return NextResponse.json(info);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to connect to NWC' },
      { status: 500 }
    );
  }
}

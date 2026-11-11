import { NextRequest, NextResponse } from 'next/server';
import { validateNwcUri, checkNwcInvoiceStatus } from '@/lib/lightning/nwc';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { connectionUri, paymentHash } = body;

    const validation = validateNwcUri(connectionUri);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (!paymentHash || typeof paymentHash !== 'string') {
      return NextResponse.json({ error: 'Valid paymentHash required' }, { status: 400 });
    }

    const status = await checkNwcInvoiceStatus(connectionUri, paymentHash);
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to check invoice status' },
      { status: 500 }
    );
  }
}

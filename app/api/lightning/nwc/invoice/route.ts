import { NextRequest, NextResponse } from 'next/server';
import { validateNwcUri, createNwcInvoice } from '@/lib/lightning/nwc';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { connectionUri, amountSats, memo } = body;

    const validation = validateNwcUri(connectionUri);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (!amountSats || typeof amountSats !== 'number' || amountSats <= 0) {
      return NextResponse.json({ error: 'Valid positive amount in satoshis required' }, { status: 400 });
    }

    const invoice = await createNwcInvoice(connectionUri, amountSats, memo);
    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to create Lightning invoice' },
      { status: 500 }
    );
  }
}

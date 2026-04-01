import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pin } = body;

    // Securely checks the Vercel server vault
    const correctPin = process.env.DIVISION_ADMIN_PASSCODE;

    if (!correctPin || pin !== correctPin) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}
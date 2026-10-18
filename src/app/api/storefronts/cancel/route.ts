/* src/app/api/storefronts/cancel/route.ts */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing storefront ID' }, { status: 400 });
  }

  const supabase = await createClient();
  
  const { error } = await supabase
    .from('storefronts')
    .update({ status: 'CANCELED' })
    .eq('id', id);

  if (error) {
    console.error("Cancellation Error:", error);
    return NextResponse.json({ error: 'Failed to process cancellation' }, { status: 500 });
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Project Archived</title>
      <style>
        body { 
          background-color: #09090b; 
          color: #fff; 
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          height: 100vh; 
          margin: 0; 
          text-align: center;
          padding: 20px;
        }
        .container {
          max-width: 500px;
          background: rgba(24, 24, 27, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 40px;
          border-radius: 20px;
        }
        h2 { color: #f43f5e; text-transform: uppercase; letter-spacing: 0.1em; font-size: 1.25rem; margin-top: 0; }
        p { color: #a1a1aa; line-height: 1.6; font-size: 0.875rem; margin-bottom: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>File Archived</h2>
        <p>Your build request has been successfully canceled and removed from the active drafting table. No hard feelings—let us know if you want to build something in the future.</p>
      </div>
    </body>
    </html>
  `;

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
}
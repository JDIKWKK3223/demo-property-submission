// app/api/new-community/route.ts
// Next.js API route to proxy new community submissions to Google Apps Script
const GOOGLE_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbz62-IRG9n3s5H2fPoT0oflVQZPbAlHIANnzHzYyYfW-2748pOMPMc1YpsAM2yRVMmojw/exec';

// ---- Test-mode settings ----
const TEST_INBOX = 'crawford1.anthony@gmail.com';
const FORCE_TEST_MODE = process.env.FORCE_TEST_MODE === 'true';


type Community = { name: string; city_name: string; email?: string; [key: string]: unknown };

export async function POST(request: Request) {
  try {
  const body: Record<string, unknown> = await request.json();
    // Validate required fields
    const required = ['community', 'management', 'phone', 'email', 'specials', 'commissionSend', 'commissionEscort'];
    const missing = required.filter(k => !body[k] || String(body[k]).trim() === '');
    if (missing.length) {
      return new Response(JSON.stringify({ error: 'Missing fields: ' + missing.join(', ') }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  const data: unknown = await response.json().catch(() => response.text());
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
  const err = error instanceof Error ? error : new Error('Unknown error');
    return new Response(JSON.stringify({ error: err.message || 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

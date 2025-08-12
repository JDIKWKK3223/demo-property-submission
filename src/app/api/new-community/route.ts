// app/api/new-community/route.ts
// Next.js API route to proxy new community submissions to Google Apps Script
const GOOGLE_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbz62-IRG9n3s5H2fPoT0oflVQZPbAlHIANnzHzYyYfW-2748pOMPMc1YpsAM2yRVMmojw/exec';

// ---- Test-mode settings ----
const TEST_INBOX = 'crawford1.anthony@gmail.com';
const FORCE_TEST_MODE = process.env.FORCE_TEST_MODE === 'true';

type Community = { name: string; city_name: string; email?: string; [key: string]: unknown };
function normalizeAndOverrideRecipient(body: Record<string, unknown>) {
  // Detect test by env or code prefix
  const code = String(body?.code || '').trim().toUpperCase();
  const isTest = FORCE_TEST_MODE || code.startsWith('TEST');

  // Figure out what field the Apps Script expects (common variants)
  const currentRecipient =
    body?.email || body?.to || body?.recipient || null;

  const routed_to = isTest && TEST_INBOX ? TEST_INBOX : currentRecipient;

  // Build a forwarded payload with recipient overrides (cover common keys)
  const forwarded = {
    ...body,
    email: routed_to,
    to: routed_to,
    recipient: routed_to,
    _routed_to: routed_to, // for debugging/visibility
  };

  return { forwarded, routed_to };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
    const data = await response.json().catch(() => response.text());
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const err = error as Error;
    return new Response(JSON.stringify({ error: err.message || 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

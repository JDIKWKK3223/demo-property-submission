// app/api/update-community/route.ts
const GOOGLE_APPS_SCRIPT_UPDATE_URL = 'https://script.google.com/macros/s/AKfycbx6fq-exRiu4Lmwci-L8hw_iG-Ai7m78YpB18p_Hbz2_ohto5nMteOxd_A3BjSHXuMMLw/exec'; // Replace with your deployed doPostUpdate URL

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.email) {
      return new Response(JSON.stringify({ error: 'Missing email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const response = await fetch(GOOGLE_APPS_SCRIPT_UPDATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => response.text());
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

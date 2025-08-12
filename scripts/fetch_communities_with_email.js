// Usage: node scripts/fetch_communities_with_email.js
// This script fetches all communities with emails from Supabase and writes them to src/data/communities.json

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Set your Supabase credentials here or use environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchCommunities() {
  const { data, error } = await supabase.from('submission').select('name, city_name, email');
  if (error) {
    console.error('Error fetching communities:', error);
    process.exit(1);
  }
  const outPath = path.join(__dirname, '../src/data/communities.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log(`Wrote ${data.length} communities to src/data/communities.json`);
}

fetchCommunities();

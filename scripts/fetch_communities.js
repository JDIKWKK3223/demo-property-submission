// Usage: node scripts/fetch_communities.js
// This script fetches all communities from Supabase and writes them to src/data/communities.json

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Set your Supabase credentials here or use environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsbedamebdbemoorexlm.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzYmVkYW1lYmRiZW1vb3JleGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MDk4NDAsImV4cCI6MjA3MDM4NTg0MH0.BRHIj8ZvBWo_f2McIUV2ca-l5KS1J77P4rvTwpy-yOs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchCommunities() {
  const { data, error } = await supabase.from('submission').select('name, city_name, email');
  console.log('Fetched data:', data);
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

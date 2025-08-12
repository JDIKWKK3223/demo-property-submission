import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type Community = { name: string; city_name: string; email?: string; [key: string]: unknown };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { community, city, newEmail } = req.body;
  if (!community || !city || !newEmail) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const filePath = path.join(process.cwd(), 'src/data/communities.json');
  let communities: Community[] = [];
  try {
    communities = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return res.status(500).json({ error: 'Failed to read communities.json' });
  }

  let updated = false;
  communities = communities.map((c: Community): Community => {
    if (c.name === community && c.city_name === city) {
      updated = true;
      return { ...c, email: newEmail };
    }
    return c;
  });

  if (!updated) {
    return res.status(404).json({ error: 'Community not found' });
  }

  try {
    fs.writeFileSync(filePath, JSON.stringify(communities, null, 2), 'utf8');
  } catch {
    return res.status(500).json({ error: 'Failed to update communities.json' });
  }

  return res.status(200).json({ success: true });
}

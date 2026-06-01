export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  try {
    const { prompt, cookies, projectId, batchId } = req.body;

    const API_URL = `https://aisandbox-pa.googleapis.com/v1/projects/${projectId}/flowMedia:batchGenerateImages`;

    const body = {
      clientContext: {
        recipientContext: {
          projectId: projectId,
          tool: "FLOWML"
        }
      },
      batchId: batchId,
      cameFromBuild: true,
      requests: [{
        prompt: prompt,
        sampleCount: 1,
        aspectRatio: "IMAGE_ASPECT_RATIO_LANDSCAPE"
      }]
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
        'Origin': 'https://labs.google',
        'Referer': 'https://labs.google/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: data });
      return;
    }

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

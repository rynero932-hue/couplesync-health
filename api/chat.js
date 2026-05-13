export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OPENROUTER_API_KEY not set' });

  const { system, messages, max_tokens = 800 } = req.body;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://couplesync-health.vercel.app',
      'X-Title': 'Better Together',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-exp:free',
      max_tokens,
      messages: [{ role: 'system', content: system }, ...messages],
    }),
  });

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? 'Coba lagi ya!';
  return res.status(200).json({ content: [{ type: 'text', text }] });
}

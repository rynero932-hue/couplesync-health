// api/chat.js — Vercel Serverless Function
// AI proxy menggunakan OpenRouter (free models)
// API key aman di server, tidak pernah expose ke browser

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // API key — dari env var (Vercel)
  const apiKey = process.env.OPENROUTER_API_KEY;

  const { system, messages, max_tokens = 800 } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://couplesync-health.vercel.app',
        'X-Title': 'Better Together — Health App',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        max_tokens,
        messages: [
          { role: 'system', content: system },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[AI] OpenRouter error:', response.status, errText);

      // Fallback ke model lain kalau gemini rate limit
      if (response.status === 429 || response.status === 503) {
        return await fallbackModel(apiKey, system, messages, max_tokens, res);
      }

      return res.status(response.status).json({ error: errText });
    }

    const data  = await response.json();
    const text  = data.choices?.[0]?.message?.content ?? 'Maaf, tidak ada respons.';

    // Return format konsisten dengan frontend
    return res.status(200).json({
      content: [{ type: 'text', text }]
    });

  } catch (err) {
    console.error('[AI] Error:', err);
    return res.status(500).json({ error: err.message });
  }
}

// Fallback ke llama kalau gemini rate limit
async function fallbackModel(apiKey, system, messages, max_tokens, res) {
  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://couplesync-health.vercel.app',
        'X-Title': 'Better Together — Health App',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        max_tokens,
        messages: [
          { role: 'system', content: system },
          ...messages,
        ],
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      return res.status(r.status).json({ error: err });
    }

    const data = await r.json();
    const text = data.choices?.[0]?.message?.content ?? 'Maaf, coba lagi sebentar.';
    return res.status(200).json({ content: [{ type: 'text', text }] });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

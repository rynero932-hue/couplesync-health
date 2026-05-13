// api/chat.js — Vercel Serverless Function
// API key dibaca dari Vercel Environment Variables (server-side only)
// Set OPENROUTER_API_KEY di Vercel → Settings → Environment Variables

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // API key HANYA dari environment variable — tidak hardcoded
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'OPENROUTER_API_KEY belum diset di Vercel Environment Variables'
    });
  }

  const { system, messages, max_tokens = 800 } = req.body;

  try {
    // Primary: gemini-2.0-flash-exp:free
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://couplesync-health.vercel.app',
        'X-Title': 'Better Together Health App',
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
      // Fallback: llama-3.1-8b:free kalau gemini rate limit
      if (response.status === 429 || response.status === 503) {
        return await callFallback(apiKey, system, messages, max_tokens, res);
      }
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content ?? 'Maaf, tidak ada respons.';
    return res.status(200).json({ content: [{ type: 'text', text }] });

  } catch (err) {
    console.error('[AI proxy]', err);
    return res.status(500).json({ error: err.message });
  }
}

async function callFallback(apiKey, system, messages, max_tokens, res) {
  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://couplesync-health.vercel.app',
        'X-Title': 'Better Together Health App',
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
    const data = await r.json();
    const text = data.choices?.[0]?.message?.content ?? 'Coba lagi sebentar.';
    return res.status(200).json({ content: [{ type: 'text', text }] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

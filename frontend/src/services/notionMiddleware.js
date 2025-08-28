// Notion Middleware Utility
// Handles authentication and request formatting for Notion API

// Use Vite env variable for Notion API key
const NOTION_API_KEY = import.meta.env.VITE_NOTION_API_KEY
const NOTION_API_BASE = import.meta.env.VITE_NOTION_API_BASE // '/api' in dev, not used in prod
const NOTION_VERSION = '2022-06-28'

export async function notionRequest(endpoint, options = {}) {
  if (import.meta.env.PROD) {
    // In production (Vercel), use /api/notionProxy
    const res = await fetch('/api/all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint, options }),
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.error || 'Notion API error')
    }
    return res.json()
  } else {
    // In development, use Vite proxy
    const res = await fetch(NOTION_API_BASE + endpoint, {
      ...options,
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error || 'Notion API error')
    }
    return res.json()
  }
}

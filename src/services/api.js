/**
 * WeMood API Service
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  Articles & Search  →  Mario's FastAPI backend              │
 * │                        Python / PostgreSQL / Mistral AI     │
 * │                        GET /api/v1/articles/:id             │
 * │                        GET /api/v1/search/?q=...            │
 * │                                                             │
 * │  Auth, Bookmarks,   →  Supabase                            │
 * │  Mood logs              (user-specific data)                │
 * └─────────────────────────────────────────────────────────────┘
 *
 * In development the Vite proxy forwards /api/v1/* to Mario's local
 * server on port 8000 (see vite.config.js).
 * In production set VITE_BACKEND_URL=https://your-server.com in .env
 */

import { supabase } from '../lib/supabase.js'

// ── Backend base URL ──────────────────────────────────────────────────
const BACKEND = (import.meta.env.VITE_BACKEND_URL || 'https://164-92-243-35.sslip.io') + '/api/v1'

// ── Fetch wrapper for Mario's FastAPI ─────────────────────────────────
async function apiFetch(path, options = {}) {
  // FastAPI requires trailing slash before query params.
  // Ensure /search?q=x becomes /search/?q=x
  const normalised = path.replace(/\?/, (match, offset, str) => {
    return str[offset - 1] === '/' ? match : '/?' 
  })
  const res = await fetch(`${BACKEND}${normalised}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail || body.message || `Fehler ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

// ── Supabase error helper ─────────────────────────────────────────────
function throwIfError(error) {
  if (error) throw new Error(error.message || 'Datenbankfehler')
}

// ─────────────────────────────────────────────────────────────────────
// SEARCH  →  Mario's FastAPI + Mistral AI
// ─────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/search?q=<query>
 *
 * The backend:
 *   1. Sends the query to Mistral AI — extracts semantic tags, detects intent
 *   2. Detects emergency automatically (suicidal ideation, self-harm, crisis)
 *   3. Runs hybrid full-text + overlap-coefficient tag search in PostgreSQL
 *   4. Returns ranked articles + optional emergency_resources with hotlines
 *
 * Maps backend shape → shape SearchResultView expects:
 *   { id, title, description, emoji, confidence }
 */
export async function searchArticles(query, _emotions = []) {
  if (!query?.trim()) return []

  const data = await apiFetch(`/search/?q=${encodeURIComponent(query.trim())}`)

  // Stash emergency resources so SearchResultView can pick them up after the call
  searchArticles._emergency = data.emergency_resources || null

  return (data.results || []).map(r => ({
    id:          r.id,
    title:       r.title,
    description: r.summary,
    emoji:       categoryToEmoji(r.category),
    confidence:  Math.round((r.relevance_score || 0) * 100),
    tags:        r.tags || [],
    sentiment:   r.sentiment,
    category:    r.category
  }))
}

searchArticles.getEmergencyResources = () => searchArticles._emergency || null

// ─────────────────────────────────────────────────────────────────────
// ARTICLES  →  Mario's FastAPI
// ─────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/articles/:id
 *
 * Backend returns:
 *   { id, title, content, source, url, publication_date,
 *     ai_analysis: { tags, scientific_disciplines, summary,
 *                    sentiment, category, confidence_score } }
 *
 * Maps → shape ArticleDetailView expects:
 *   { id, title, emoji, readTime, overview, facts,
 *     literature, videos, conclusion, takeaways }
 */
export async function getArticleById(id) {
  const r = await apiFetch(`/articles/${id}`)
  return mapFullArticle(r)
}

/**
 * Load articles for the library.
 *
 * GET /api/v1/articles/ requires a FastAPI JWT token (admin only).
 * Since end-users authenticate via Supabase (separate system),
 * we use the public /search/ endpoint with a broad query instead.
 *
 * Maps → shape LibraryView expects: { id, title, description, emoji, readTime }
 */
export async function getAllArticles() {
  const data = await apiFetch(`/search/?q=psychologie`)
  return (data.results || []).map(r => ({
    id:          r.id,
    title:       r.title,
    description: r.summary || '',
    emoji:       categoryToEmoji(r.category),
    readTime:    estimateReadTime(null)
  }))
}

// ── Mappers ───────────────────────────────────────────────────────────

function mapListArticle(r) {
  const a = r.ai_analysis || {}
  return {
    id:          r.id,
    title:       r.title,
    description: a.summary || r.content?.slice(0, 120) + '…' || '',
    emoji:       categoryToEmoji(a.category),
    readTime:    estimateReadTime(r.content)
  }
}

function mapFullArticle(r) {
  if (!r) return null
  const a = r.ai_analysis || {}

  const paragraphs = (r.content || '').split(/\n{2,}/).map(p => p.trim()).filter(Boolean)
  const overview   = paragraphs.slice(0, 2).join('\n\n') || a.summary || ''
  const conclusion = paragraphs.at(-1) || a.summary || ''

  // Scientific disciplines → numbered facts
  const facts = (a.scientific_disciplines || []).map(d => `Wissenschaftliche Disziplin: ${d}`)

  // Top AI tags → key takeaways
  const takeaways = (a.tags || []).slice(0, 8)

  // Source → literature entry
  const literature = r.source ? [{ title: r.source, author: 'Quelle', description: r.url || '' }] : []

  return {
    id:         r.id,
    title:      r.title,
    emoji:      categoryToEmoji(a.category),
    readTime:   estimateReadTime(r.content),
    overview,
    facts,
    literature,
    videos:     [],
    conclusion,
    takeaways,
    source:     r.source,
    url:        r.url,
    tags:       a.tags || [],
    sentiment:  a.sentiment,
    category:   a.category,
    summary:    a.summary
  }
}

function estimateReadTime(content) {
  if (!content) return '5 Min. Lesezeit'
  const mins = Math.max(1, Math.round(content.split(/\s+/).length / 200))
  return `${mins} Min. Lesezeit`
}

function categoryToEmoji(category) {
  if (!category) return '📄'
  const c = category.toLowerCase()
  if (c.includes('studie') || c.includes('study'))         return '🔬'
  if (c.includes('review') || c.includes('meta'))          return '📚'
  if (c.includes('angst') || c.includes('anxiety'))        return '😰'
  if (c.includes('depress'))                               return '😔'
  if (c.includes('stress'))                                return '😤'
  if (c.includes('achtsamkeit') || c.includes('mindful'))  return '🧘‍♀️'
  if (c.includes('schlaf') || c.includes('sleep'))         return '🌙'
  if (c.includes('trauma'))                                return '💙'
  if (c.includes('selbst') || c.includes('self'))          return '✨'
  if (c.includes('resilienz') || c.includes('resilience')) return '🌺'
  return '📄'
}

// ─────────────────────────────────────────────────────────────────────
// BOOKMARKS  →  Supabase
// ─────────────────────────────────────────────────────────────────────

export async function bookmarkArticle(articleId) {
  const { data, error } = await supabase
    .from('bookmarks')
    .insert({ article_id: articleId })
    .select()
    .single()
  if (error && error.code !== '23505') throwIfError(error)
  return data
}

export async function removeBookmark(articleId) {
  const { error } = await supabase.from('bookmarks').delete().eq('article_id', articleId)
  throwIfError(error)
}

export async function getBookmarks() {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('id, article_id, created_at')
    .order('created_at', { ascending: false })
  throwIfError(error)
  return data || []
}

// ─────────────────────────────────────────────────────────────────────
// MOOD LOGS  →  Supabase
// ─────────────────────────────────────────────────────────────────────

export async function logMood({ emotion, note = null }) {
  const { data, error } = await supabase
    .from('mood_logs').insert({ emotion, note }).select().single()
  throwIfError(error)
  return data
}

export async function getMoodHistory({ from = null, to = null, limit = 50 } = {}) {
  let q = supabase
    .from('mood_logs').select('id, emotion, note, created_at')
    .order('created_at', { ascending: false }).limit(limit)
  if (from) q = q.gte('created_at', from)
  if (to)   q = q.lte('created_at', to)
  const { data, error } = await q
  throwIfError(error)
  return data || []
}
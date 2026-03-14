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
 * Results are cached in memory so repeated visits don't re-trigger
 * the Mistral AI analysis pipeline.
 *
 * Maps → shape LibraryView expects: { id, title, description, emoji, readTime }
 */
let _libraryCache = null
let _libraryCacheTime = 0
const LIBRARY_CACHE_TTL = 30 * 60 * 1000 // 30 minutes

export async function getAllArticles({ forceRefresh = false } = {}) {
  const now = Date.now()
  if (!forceRefresh && _libraryCache && (now - _libraryCacheTime) < LIBRARY_CACHE_TTL) {
    return _libraryCache
  }

  const data = await apiFetch(`/search/?q=alle`)
  _libraryCache = (data.results || []).map(r => ({
    id:          r.id,
    title:       r.title,
    description: r.summary || r.ai_analysis?.summary || r.content?.slice(0, 120) + '…' || '',
    emoji:       categoryToEmoji(r.category || r.ai_analysis?.category),
    readTime:    estimateReadTime(r.content)
  }))
  _libraryCacheTime = now
  return _libraryCache
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

  // Full content as overview, fall back to ai summary
  const overview = r.content?.trim() || a.summary || ''

  // Fazit: use dedicated fazit field if available, otherwise ai summary (not a content duplicate)
  const conclusion = r.fazit?.trim() || a.summary || ''

  // Facts: scientific disciplines without redundant prefix label
  const facts = (a.scientific_disciplines || [])

  // Takeaways: filter out short acronym-style tags, keep meaningful ones
  const takeaways = (a.tags || []).filter(t => t.length > 4).slice(0, 8)

  // Literature: prefer dedicated field, fall back to sources array or single source
  let literature = []
  if (Array.isArray(r.literature) && r.literature.length) {
    literature = r.literature
  } else if (Array.isArray(r.sources) && r.sources.length) {
    literature = r.sources.map(src => ({
      title:       src,
      author:      r.publication_date ? `Veröffentlicht: ${r.publication_date}` : 'Quelle',
      description: r.url || ''
    }))
  } else if (r.source) {
    literature = [{ title: r.source, author: 'Quelle', description: r.url || '' }]
  }

  // Videos: use dedicated videos field if available, else empty
  const videos = Array.isArray(r.videos) && r.videos.length ? r.videos : []

  return {
    id:         r.id,
    title:      r.title,
    emoji:      categoryToEmoji(a.category),
    readTime:   estimateReadTime(r.content),
    overview,
    facts,
    literature,
    videos,
    conclusion,
    takeaways,
    source:     r.sources?.[0] || r.source,
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
// ─────────────────────────────────────────────────────────────────────
// FAVORITES  →  Supabase
// Table: favorites (id, user_id, article_id, article_title, article_emoji, created_at)
// ─────────────────────────────────────────────────────────────────────

export async function addFavorite({ articleId, articleTitle, articleEmoji }) {
  const { data, error } = await supabase
    .from('favorites')
    .insert({ article_id: articleId, article_title: articleTitle, article_emoji: articleEmoji })
    .select()
    .single()
  if (error && error.code !== '23505') throwIfError(error)
  return data
}

export async function removeFavorite(articleId) {
  const { error } = await supabase.from('favorites').delete().eq('article_id', articleId)
  throwIfError(error)
}

export async function getFavorites() {
  const { data, error } = await supabase
    .from('favorites')
    .select('id, article_id, article_title, article_emoji, created_at')
    .order('created_at', { ascending: false })
  throwIfError(error)
  return data || []
}

export async function isFavorited(articleId) {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('article_id', articleId)
    .maybeSingle()
  if (error) return false
  return !!data
}

// ─────────────────────────────────────────────────────────────────────
// ARTICLE HISTORY  →  Supabase
// Table: article_history (id, user_id, article_id, article_title, article_emoji, viewed_at)
// ─────────────────────────────────────────────────────────────────────

export async function trackArticleView({ articleId, articleTitle, articleEmoji }) {
  // Upsert: update viewed_at if already exists, insert otherwise
  const { error } = await supabase
    .from('article_history')
    .upsert(
      { article_id: articleId, article_title: articleTitle, article_emoji: articleEmoji, viewed_at: new Date().toISOString() },
      { onConflict: 'user_id,article_id' }
    )
  if (error) console.warn('[history] Could not track view:', error.message)
}

export async function getArticleHistory({ limit = 30 } = {}) {
  const { data, error } = await supabase
    .from('article_history')
    .select('id, article_id, article_title, article_emoji, viewed_at')
    .order('viewed_at', { ascending: false })
    .limit(limit)
  throwIfError(error)
  return data || []
}

export async function clearArticleHistory() {
  const { error } = await supabase.from('article_history').delete().neq('id', 0)
  throwIfError(error)
}
// ─────────────────────────────────────────────────────────────────────
// PROFILES  →  Supabase
// Table: profiles (id, name, role, created_at)
// ─────────────────────────────────────────────────────────────────────

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, role, created_at')
    .eq('id', user.id)
    .maybeSingle()
  if (error) return null
  return data
}

export async function isAdmin() {
  const profile = await getProfile()
  return profile?.role === 'admin'
}

// ─────────────────────────────────────────────────────────────────────
// FEEDBACK  →  Supabase
// Table: feedback (id, user_id, category, message, status, created_at)
// ─────────────────────────────────────────────────────────────────────

export async function submitFeedback({ category, message }) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('feedback')
    .insert({ category, message, user_id: user?.id ?? null })
    .select()
    .single()
  throwIfError(error)
  return data
}

export async function getMyFeedback() {
  const { data, error } = await supabase
    .from('feedback')
    .select('id, category, message, status, created_at')
    .order('created_at', { ascending: false })
  throwIfError(error)
  return data || []
}

// ─────────────────────────────────────────────────────────────────────
// ADMIN  →  Supabase (admin role required via RLS)
// ─────────────────────────────────────────────────────────────────────

export async function adminGetAllFeedback() {
  const { data, error } = await supabase
    .from('feedback')
    .select('id, user_id, category, message, status, created_at')
    .order('created_at', { ascending: false })
  throwIfError(error)
  return data || []
}

export async function adminDeleteFeedback(id) {
  const { error } = await supabase.from('feedback').delete().eq('id', id)
  throwIfError(error)
}

export async function adminResolveFeedback(id) {
  const { error } = await supabase
    .from('feedback')
    .update({ status: 'resolved' })
    .eq('id', id)
  throwIfError(error)
}

export async function adminGetAllProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, role, created_at')
    .order('created_at', { ascending: false })
  throwIfError(error)
  return data || []
}

// ─────────────────────────────────────────────────────────────────────
// ARTICLE RATINGS  →  Supabase
// Table: article_ratings (id, user_id, article_id, article_title, rating, comment, created_at, updated_at)
// ─────────────────────────────────────────────────────────────────────

export async function getMyArticleRating(articleId) {
  const { data, error } = await supabase
    .from('article_ratings')
    .select('id, rating, comment, updated_at')
    .eq('article_id', articleId)
    .maybeSingle()
  if (error) return null
  return data
}

export async function upsertArticleRating({ articleId, articleTitle, rating, comment = null }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Nicht eingeloggt')
  const { data, error } = await supabase
    .from('article_ratings')
    .upsert(
      {
        user_id:       user.id,
        article_id:    articleId,
        article_title: articleTitle,
        rating,
        comment:       comment || null,
        updated_at:    new Date().toISOString(),
      },
      { onConflict: 'user_id,article_id' }
    )
    .select()
    .single()
  throwIfError(error)
  return data
}

export async function deleteMyArticleRating(articleId) {
  const { error } = await supabase
    .from('article_ratings')
    .delete()
    .eq('article_id', articleId)
  throwIfError(error)
}

export async function getArticleRatingSummary(articleId) {
  // Returns average rating and total count for an article (readable by anyone
  // because we use an aggregate, not individual user rows)
  const { data, error } = await supabase
    .from('article_ratings')
    .select('rating')
    .eq('article_id', articleId)
  if (error) return { average: null, count: 0 }
  if (!data || data.length === 0) return { average: null, count: 0 }
  const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length
  return { average: Math.round(avg * 10) / 10, count: data.length }
}

// ── Admin: all ratings ────────────────────────────────────────────────
export async function adminGetAllRatings() {
  const { data, error } = await supabase
    .from('article_ratings')
    .select('id, user_id, article_id, article_title, rating, comment, updated_at')
    .order('updated_at', { ascending: false })
  throwIfError(error)
  return data || []
}

export async function adminDeleteRating(id) {
  const { error } = await supabase.from('article_ratings').delete().eq('id', id)
  throwIfError(error)
}
// ─────────────────────────────────────────────────────────────────────
// ACCOUNT DELETION  →  Supabase RPC
// Calls the security-definer function delete_own_account() which
// removes all user data and the auth.users row server-side.
// ─────────────────────────────────────────────────────────────────────

export async function deleteOwnAccount() {
  const { error } = await supabase.rpc('delete_own_account')
  if (error) throw new Error(error.message || 'Konto konnte nicht gelöscht werden.')
}
/**
 * useDynamicTheme — WeMood Dynamic Design Composable
 *
 * Analyses the user's article history and favourites to determine
 * the most relevant theme and applies it site-wide when enabled.
 *
 * Storage keys (localStorage):
 *   wemood_dynamic_design        → 'true' | 'false'  (feature on/off)
 *   wemood_dynamic_design_toast  → 'dismissed'        (never show again)
 */

import { ref, watch } from 'vue'
import { getArticleHistory, getFavorites } from '../services/api.js'

// ── Singleton state ───────────────────────────────────────────────────
const dynamicDesignEnabled = ref(
  localStorage.getItem('wemood_dynamic_design') === 'true'
)
const calculatedTheme = ref(null)

// ── Category → theme mapping (mirrors ArticleDetailView) ──────────────
function titleToTheme(title) {
  if (!title) return null
  const h = title.toLowerCase()
  if (h.includes('depress'))                                     return 'depression'
  if (h.includes('angst') || h.includes('anx') || h.includes('panik') || h.includes('panic')) return 'anxiety'
  if (h.includes('stress') || h.includes('wut') || h.includes('anger') || h.includes('burnout')) return 'anger'
  if (h.includes('schlaf') || h.includes('sleep') || h.includes('insom')) return 'sleep'
  if (h.includes('mindful') || h.includes('achtsamkeit') || h.includes('meditation')) return 'mindfulness'
  if (h.includes('resilienz') || h.includes('resilience'))       return 'resilience'
  if (h.includes('liebe') || h.includes('love') || h.includes('beziehung')) return 'love'
  if (h.includes('trauma') || h.includes('ptbs') || h.includes('ptsd')) return 'calm'
  if (h.includes('selbst') || h.includes('self') || h.includes('vertrauen')) return 'trust'
  if (h.includes('fokus') || h.includes('focus') || h.includes('konzentr') || h.includes('adhs')) return 'focus'
  if (h.includes('hoffnung') || h.includes('hope') || h.includes('zuversicht')) return 'hope'
  if (h.includes('dankbar') || h.includes('gratit') || h.includes('wertschätz')) return 'gratitude'
  if (h.includes('freude') || h.includes('joy') || h.includes('glück') || h.includes('happiness')) return 'joy'
  if (h.includes('ruhe') || h.includes('calm') || h.includes('entspan')) return 'calm'
  if (h.includes('überrasch') || h.includes('surprise')) return 'surprise'
  if (h.includes('vorfreude') || h.includes('anticipation')) return 'anticipation'
  return null
}

/**
 * Analyse history + favourites and return the most dominant theme.
 * Favourites are weighted 2x over history.
 */
async function calculateTheme() {
  try {
    const [history, favorites] = await Promise.all([
      getArticleHistory({ limit: 30 }),
      getFavorites(),
    ])

    const scores = {}

    history.forEach(h => {
      const t = titleToTheme(h.article_title)
      if (t) scores[t] = (scores[t] || 0) + 1
    })

    favorites.forEach(f => {
      const t = titleToTheme(f.article_title)
      if (t) scores[t] = (scores[t] || 0) + 2  // favourites weighted double
    })

    if (Object.keys(scores).length === 0) return null

    // Return the theme with the highest score
    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
  } catch (e) {
    console.warn('[dynamicTheme] Could not calculate theme:', e.message)
    return null
  }
}

export function useDynamicTheme() {
  function setEnabled(val) {
    dynamicDesignEnabled.value = val
    localStorage.setItem('wemood_dynamic_design', val ? 'true' : 'false')
  }

  function toggleEnabled() {
    setEnabled(!dynamicDesignEnabled.value)
  }

  /**
   * Called from App.vue on mount and on login.
   * Calculates the best theme and applies it to currentTheme if enabled.
   */
  async function applyDynamicTheme(currentTheme) {
    if (!dynamicDesignEnabled.value) return
    const theme = await calculateTheme()
    if (theme) {
      calculatedTheme.value = theme
      currentTheme.value = theme
    }
  }

  /**
   * Returns the theme to restore to after leaving an article.
   * If dynamic design is on and a calculated theme exists, use that.
   * Otherwise fall back to 'default'.
   */
  function getRestoreTheme() {
    if (dynamicDesignEnabled.value && calculatedTheme.value) {
      return calculatedTheme.value
    }
    return 'default'
  }

  return {
    dynamicDesignEnabled,
    calculatedTheme,
    setEnabled,
    toggleEnabled,
    applyDynamicTheme,
    getRestoreTheme,
  }
}
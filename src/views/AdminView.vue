<template>
  <div class="min-h-screen">

    <!-- Top Bar -->
    <div class="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6">
      <router-link
        to="/"
        class="flex flex-col items-center gap-1 group transition-opacity hover:opacity-85"
      >
        <ChevronUpIcon class="nav-icon-dark w-9 h-9 sm:w-10 sm:h-10 text-white/90 stroke-[2.5] group-hover:text-white transition-colors" />
        <span class="nav-label-dark text-xl sm:text-2xl font-quicksand text-white font-bold group-hover:text-white transition-colors">
          Zurück
        </span>
      </router-link>
      <h1 class="text-2xl sm:text-3xl font-quicksand font-bold text-white nav-label-dark">Admin</h1>
      <div class="flex items-center gap-2 glass-subtle rounded-full px-3 py-1.5">
        <ShieldIcon class="w-4 h-4 text-purple-300" />
        <span class="text-xs font-medium text-white/80 nav-label-dark">Administrator</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-3">
      <LoaderIcon class="w-8 h-8 text-white/60 animate-spin" />
      <p class="text-sm text-white/60 nav-label-dark">Dashboard wird geladen…</p>
    </div>

    <!-- Access denied -->
    <div v-else-if="!isAdminUser" class="flex flex-col items-center justify-center py-32 gap-4 text-center px-4">
      <div class="w-16 h-16 glass-subtle rounded-2xl flex items-center justify-center">
        <ShieldOffIcon class="w-8 h-8 text-red-400" />
      </div>
      <p class="text-white/80 font-semibold nav-label-dark">Kein Zugriff</p>
      <p class="text-sm text-white/50 nav-label-dark max-w-xs">Du hast keine Administratorrechte für diesen Bereich.</p>
      <router-link to="/" class="mt-2 px-5 py-2 glass hover:bg-white/30 text-gray-700 text-sm font-medium rounded-full transition-all nav-label">
        Zur Startseite
      </router-link>
    </div>

    <!-- Dashboard -->
    <div v-else class="px-4 sm:px-8 pb-12">

      <!-- Tab bar -->
      <div class="flex items-center gap-1 mb-6 flex-wrap">
        <button
          v-for="tab in tabs" :key="tab.key"
          @click="activeTab = tab.key"
          class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
          :class="activeTab === tab.key
            ? 'glass-strong text-gray-800 nav-label'
            : 'glass-subtle text-white/80 nav-label-dark hover:text-white'"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
          <span v-if="tab.key === 'feedback' && openFeedbackCount > 0"
            class="text-xs bg-red-400/80 text-white rounded-full px-1.5 py-0.5 leading-none font-bold">
            {{ openFeedbackCount }}
          </span>
        </button>
      </div>

      <!-- ── ÜBERSICHT ── -->
      <div v-if="activeTab === 'overview'" class="max-w-3xl mx-auto space-y-4">

        <!-- Stats row -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="glass-strong rounded-2xl p-4 text-center">
            <p class="text-2xl font-quicksand font-bold text-gray-800 nav-label">{{ stats.totalUsers }}</p>
            <p class="text-xs text-gray-500 nav-label-dark mt-1">Nutzer</p>
          </div>
          <div class="glass-strong rounded-2xl p-4 text-center">
            <p class="text-2xl font-quicksand font-bold text-gray-800 nav-label">{{ stats.totalFeedback }}</p>
            <p class="text-xs text-gray-500 nav-label-dark mt-1">Feedbacks</p>
          </div>
          <div class="glass-strong rounded-2xl p-4 text-center">
            <p class="text-2xl font-quicksand font-bold text-red-500 nav-label">{{ stats.openFeedback }}</p>
            <p class="text-xs text-gray-500 nav-label-dark mt-1">Offen</p>
          </div>
          <div class="glass-strong rounded-2xl p-4 text-center">
            <p class="text-2xl font-quicksand font-bold text-amber-500 nav-label">{{ stats.totalRatings }}</p>
            <p class="text-xs text-gray-500 nav-label-dark mt-1">Bewertungen</p>
          </div>
        </div>

        <!-- Average rating -->
        <div v-if="stats.totalRatings > 0" class="glass-strong rounded-3xl p-6">
          <div class="flex items-center gap-2 mb-2">
            <StarIcon class="w-4 h-4 text-amber-400" />
            <h2 class="text-base font-semibold text-gray-700 nav-label-dark">Durchschnittliche Artikelbewertung</h2>
          </div>
          <div class="flex items-center gap-3 mt-3">
            <div class="flex items-center gap-1">
              <StarIcon
                v-for="s in 5" :key="s"
                class="w-5 h-5"
                :class="s <= Math.round(stats.avgRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'"
              />
            </div>
            <span class="text-xl font-bold text-gray-800 nav-label">{{ stats.avgRating }}</span>
            <span class="text-sm text-gray-500 nav-label-dark">von {{ stats.totalRatings }} Bewertungen</span>
          </div>
        </div>

        <!-- Top articles by views -->
        <div class="glass-strong rounded-3xl p-6">
          <div class="flex items-center gap-2 mb-4">
            <BarChart2Icon class="w-4 h-4 text-gray-500" />
            <h2 class="text-base font-semibold text-gray-700 nav-label-dark">Meistgelesene Artikel</h2>
          </div>
          <div v-if="historyStatsLoading" class="flex justify-center py-6">
            <LoaderIcon class="w-5 h-5 text-white/50 animate-spin" />
          </div>
          <div v-else-if="topArticles.length === 0" class="text-center py-6">
            <p class="text-sm text-white/50 nav-label-dark">Noch keine Aktivität vorhanden.</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="(art, i) in topArticles" :key="art.article_id" class="flex items-center gap-3">
              <span class="text-xs font-bold text-gray-400 nav-label-dark w-5 shrink-0">{{ i + 1 }}</span>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-800 nav-label truncate">{{ art.article_title || 'Artikel #' + art.article_id }}</p>
                <div class="mt-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all"
                    style="background: rgba(160,130,220,0.6)"
                    :style="{ width: (art.count / topArticles[0].count * 100) + '%' }"
                  />
                </div>
              </div>
              <span class="text-xs text-gray-500 nav-label-dark shrink-0">{{ art.count }}x</span>
            </div>
          </div>
        </div>

        <!-- Feedback by category -->
        <div class="glass-strong rounded-3xl p-6">
          <div class="flex items-center gap-2 mb-4">
            <PieChartIcon class="w-4 h-4 text-gray-500" />
            <h2 class="text-base font-semibold text-gray-700 nav-label-dark">Feedback nach Kategorie</h2>
          </div>
          <div v-if="feedbackByCategory.length === 0" class="text-center py-4">
            <p class="text-sm text-white/50 nav-label-dark">Noch kein Feedback eingegangen.</p>
          </div>
          <div v-else class="space-y-2.5">
            <div v-for="cat in feedbackByCategory" :key="cat.name" class="flex items-center gap-3">
              <span class="text-xs text-gray-600 nav-label-dark w-36 shrink-0 truncate">{{ cat.name }}</span>
              <div class="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full"
                  :style="{ width: (cat.count / stats.totalFeedback * 100) + '%', background: cat.color }"
                />
              </div>
              <span class="text-xs text-gray-500 nav-label-dark w-6 shrink-0 text-right">{{ cat.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── FEEDBACK ── -->
      <div v-else-if="activeTab === 'feedback'" class="max-w-3xl mx-auto space-y-4">

        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="f in feedbackFilters" :key="f.value"
            @click="feedbackFilter = f.value"
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            :class="feedbackFilter === f.value
              ? 'glass border-white/40 text-gray-800 shadow-md bg-white/30 nav-label'
              : 'glass-subtle text-gray-600 hover:bg-white/25 nav-label-dark'"
          >
            {{ f.label }}
          </button>
        </div>

        <div v-if="feedbackLoading" class="flex justify-center py-16">
          <LoaderIcon class="w-7 h-7 text-white/60 animate-spin" />
        </div>
        <div v-else-if="filteredFeedback.length === 0" class="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <div class="w-14 h-14 glass-subtle rounded-2xl flex items-center justify-center">
            <InboxIcon class="w-7 h-7 text-white/40" />
          </div>
          <p class="text-white/80 font-medium nav-label-dark">Kein Feedback</p>
          <p class="text-sm text-white/50 nav-label-dark">Für den gewählten Filter gibt es keine Einträge.</p>
        </div>
        <div v-else class="space-y-3">
          <p class="text-xs text-white/50 nav-label-dark px-1">{{ filteredFeedback.length }} Einträge</p>
          <div v-for="item in filteredFeedback" :key="item.id" class="glass-strong rounded-2xl p-4">
            <div class="flex items-start justify-between gap-3 mb-2">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/30 text-gray-700 nav-label">
                  {{ item.category }}
                </span>
                <span
                  class="text-xs px-2 py-0.5 rounded-full font-medium"
                  :class="item.status === 'resolved' ? 'bg-green-100/50 text-green-700' : 'bg-orange-100/50 text-orange-700'"
                >
                  {{ item.status === 'resolved' ? 'Erledigt' : 'Offen' }}
                </span>
              </div>
              <span class="text-xs text-white/40 nav-label-dark shrink-0">{{ formatRelativeDate(item.created_at) }}</span>
            </div>
            <p class="text-sm text-gray-700 nav-label-dark leading-relaxed mb-3">{{ item.message }}</p>
            <p class="text-xs text-white/35 nav-label-dark font-mono mb-3">
              User: {{ item.user_id ? item.user_id.slice(0, 8) + '…' : 'Anonym' }}
            </p>
            <div class="flex items-center gap-2">
              <button
                v-if="item.status === 'open'"
                @click="handleResolve(item)"
                class="flex items-center gap-1.5 px-3 py-1.5 glass hover:bg-white/30 text-gray-700 text-xs font-medium rounded-full transition-all nav-label"
              >
                <CheckIcon class="w-3.5 h-3.5 text-green-500" />
                Als erledigt markieren
              </button>
              <button
                @click="handleDeleteFeedback(item)"
                class="flex items-center gap-1.5 px-3 py-1.5 glass hover:bg-red-100/30 text-red-500 text-xs font-medium rounded-full transition-all nav-label-dark"
              >
                <TrashIcon class="w-3.5 h-3.5" />
                Löschen
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── BEWERTUNGEN ── -->
      <div v-else-if="activeTab === 'ratings'" class="max-w-3xl mx-auto space-y-4">

        <div v-if="ratingsLoading" class="flex justify-center py-16">
          <LoaderIcon class="w-7 h-7 text-white/60 animate-spin" />
        </div>
        <div v-else-if="allRatings.length === 0" class="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <div class="w-14 h-14 glass-subtle rounded-2xl flex items-center justify-center">
            <StarIcon class="w-7 h-7 text-white/40" />
          </div>
          <p class="text-white/80 font-medium nav-label-dark">Noch keine Bewertungen</p>
          <p class="text-sm text-white/50 nav-label-dark">Nutzer können Artikel am Ende des Lesebereichs bewerten.</p>
        </div>
        <div v-else class="space-y-3">
          <p class="text-xs text-white/50 nav-label-dark px-1">{{ allRatings.length }} Bewertungen</p>
          <div v-for="item in allRatings" :key="item.id" class="glass-strong rounded-2xl p-4">
            <div class="flex items-start justify-between gap-3 mb-2">
              <div>
                <p class="text-sm font-semibold text-gray-800 nav-label truncate max-w-xs">
                  {{ item.article_title || 'Artikel #' + item.article_id }}
                </p>
                <div class="flex items-center gap-1 mt-1">
                  <StarIcon
                    v-for="s in 5" :key="s"
                    class="w-3.5 h-3.5"
                    :class="s <= item.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'"
                  />
                  <span class="text-xs text-gray-500 nav-label-dark ml-1">{{ item.rating }}/5</span>
                </div>
              </div>
              <span class="text-xs text-white/40 nav-label-dark shrink-0">{{ formatRelativeDate(item.updated_at) }}</span>
            </div>
            <p v-if="item.comment" class="text-sm text-gray-600 nav-label-dark leading-relaxed italic mb-3">
              „{{ item.comment }}"
            </p>
            <p class="text-xs text-white/35 nav-label-dark font-mono mb-3">
              User: {{ item.user_id ? item.user_id.slice(0, 8) + '…' : '—' }}
            </p>
            <button
              @click="handleDeleteRating(item)"
              class="flex items-center gap-1.5 px-3 py-1.5 glass hover:bg-red-100/30 text-red-500 text-xs font-medium rounded-full transition-all nav-label-dark"
            >
              <TrashIcon class="w-3.5 h-3.5" />
              Löschen
            </button>
          </div>
        </div>
      </div>

      <!-- ── NUTZER ── -->
      <div v-else-if="activeTab === 'users'" class="max-w-3xl mx-auto space-y-4">
        <div v-if="usersLoading" class="flex justify-center py-16">
          <LoaderIcon class="w-7 h-7 text-white/60 animate-spin" />
        </div>
        <div v-else-if="profiles.length === 0" class="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <div class="w-14 h-14 glass-subtle rounded-2xl flex items-center justify-center">
            <UsersIcon class="w-7 h-7 text-white/40" />
          </div>
          <p class="text-white/80 font-medium nav-label-dark">Keine Nutzer gefunden</p>
        </div>
        <div v-else class="space-y-3">
          <p class="text-xs text-white/50 nav-label-dark px-1">{{ profiles.length }} registrierte Nutzer</p>
          <div
            v-for="user in profiles" :key="user.id"
            class="glass-strong rounded-2xl p-4 flex items-center gap-4"
          >
            <div class="w-10 h-10 bg-gray-800/70 rounded-xl flex items-center justify-center shrink-0">
              <span class="text-base font-quicksand font-bold text-white">
                {{ (user.name || '?').charAt(0).toUpperCase() }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-800 nav-label truncate">{{ user.name || 'Kein Name' }}</p>
              <p class="text-xs text-gray-500 nav-label-dark font-mono">{{ user.id.slice(0, 12) }}…</p>
            </div>
            <span
              class="text-xs px-2.5 py-1 rounded-full font-semibold shrink-0"
              :class="user.role === 'admin'
                ? 'bg-purple-100/60 text-purple-700'
                : 'bg-white/20 text-gray-600 nav-label-dark'"
            >
              {{ user.role === 'admin' ? 'Admin' : 'Nutzer' }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  ChevronUp       as ChevronUpIcon,
  Loader          as LoaderIcon,
  Shield          as ShieldIcon,
  ShieldOff       as ShieldOffIcon,
  Check           as CheckIcon,
  Trash2          as TrashIcon,
  Inbox           as InboxIcon,
  Users           as UsersIcon,
  BarChart2       as BarChart2Icon,
  PieChart        as PieChartIcon,
  MessageSquare   as MessageSquareIcon,
  LayoutDashboard as LayoutDashboardIcon,
  UserCog         as UserCogIcon,
  Star            as StarIcon,
} from 'lucide-vue-next'
import {
  isAdmin,
  adminGetAllFeedback,
  adminDeleteFeedback,
  adminResolveFeedback,
  adminGetAllProfiles,
  adminGetAllRatings,
  adminDeleteRating,
} from '../services/api.js'
import { supabase } from '../lib/supabase.js'

const loading     = ref(true)
const isAdminUser = ref(false)
const activeTab   = ref('overview')

// Feedback
const allFeedback     = ref([])
const feedbackLoading = ref(false)
const feedbackFilter  = ref('all')
const feedbackFilters = [
  { label: 'Alle',             value: 'all'      },
  { label: 'Offen',            value: 'open'     },
  { label: 'Erledigt',         value: 'resolved' },
  { label: 'Bug Report',       value: 'Bug Report'       },
  { label: 'Feature Request',  value: 'Feature Request'  },
  { label: 'Content Feedback', value: 'Content Feedback' },
  { label: 'General Feedback', value: 'General Feedback' },
]

// Ratings
const allRatings    = ref([])
const ratingsLoading = ref(false)

// Users
const profiles     = ref([])
const usersLoading = ref(false)

// History stats
const topArticles         = ref([])
const historyStatsLoading = ref(false)

const tabs = [
  { key: 'overview', label: 'Übersicht',   icon: LayoutDashboardIcon },
  { key: 'feedback', label: 'Feedback',    icon: MessageSquareIcon   },
  { key: 'ratings',  label: 'Bewertungen', icon: StarIcon            },
  { key: 'users',    label: 'Nutzer',      icon: UserCogIcon         },
]

// ── Computed ──────────────────────────────────────────────────────────

const filteredFeedback = computed(() => {
  if (feedbackFilter.value === 'all') return allFeedback.value
  if (feedbackFilter.value === 'open' || feedbackFilter.value === 'resolved') {
    return allFeedback.value.filter(f => f.status === feedbackFilter.value)
  }
  return allFeedback.value.filter(f => f.category === feedbackFilter.value)
})

const openFeedbackCount = computed(() =>
  allFeedback.value.filter(f => f.status === 'open').length
)

const stats = computed(() => {
  const totalRatings = allRatings.value.length
  const avgRating    = totalRatings > 0
    ? Math.round(allRatings.value.reduce((s, r) => s + r.rating, 0) / totalRatings * 10) / 10
    : null
  return {
    totalUsers:      profiles.value.length,
    totalFeedback:   allFeedback.value.length,
    openFeedback:    allFeedback.value.filter(f => f.status === 'open').length,
    resolvedFeedback: allFeedback.value.filter(f => f.status === 'resolved').length,
    totalRatings,
    avgRating,
  }
})

const categoryColors = {
  'Bug Report':       'rgba(248,113,113,0.7)',
  'Feature Request':  'rgba(96,165,250,0.7)',
  'Content Feedback': 'rgba(52,211,153,0.7)',
  'General Feedback': 'rgba(167,139,250,0.7)',
}

const feedbackByCategory = computed(() => {
  const counts = {}
  allFeedback.value.forEach(f => { counts[f.category] = (counts[f.category] || 0) + 1 })
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count, color: categoryColors[name] || 'rgba(200,200,200,0.5)' }))
    .sort((a, b) => b.count - a.count)
})

// ── Lifecycle ─────────────────────────────────────────────────────────

onMounted(async () => {
  isAdminUser.value = await isAdmin()
  loading.value = false
  if (!isAdminUser.value) return

  await Promise.all([
    loadFeedback(),
    loadRatings(),
    loadUsers(),
    loadHistoryStats(),
  ])
})

// ── Loaders ───────────────────────────────────────────────────────────

async function loadFeedback() {
  feedbackLoading.value = true
  try { allFeedback.value = await adminGetAllFeedback() }
  catch (e) { console.warn('[admin feedback]', e) }
  finally { feedbackLoading.value = false }
}

async function loadRatings() {
  ratingsLoading.value = true
  try { allRatings.value = await adminGetAllRatings() }
  catch (e) { console.warn('[admin ratings]', e) }
  finally { ratingsLoading.value = false }
}

async function loadUsers() {
  usersLoading.value = true
  try { profiles.value = await adminGetAllProfiles() }
  catch (e) { console.warn('[admin users]', e) }
  finally { usersLoading.value = false }
}

async function loadHistoryStats() {
  historyStatsLoading.value = true
  try {
    const { data, error } = await supabase
      .from('article_history')
      .select('article_id, article_title')
    if (error) throw error
    const counts = {}
    const titles = {}
    ;(data || []).forEach(row => {
      counts[row.article_id] = (counts[row.article_id] || 0) + 1
      if (!titles[row.article_id] && row.article_title) titles[row.article_id] = row.article_title
    })
    topArticles.value = Object.entries(counts)
      .map(([article_id, count]) => ({ article_id, article_title: titles[article_id] || null, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  } catch (e) {
    console.warn('[admin history stats]', e)
  } finally {
    historyStatsLoading.value = false
  }
}

// ── Actions ───────────────────────────────────────────────────────────

async function handleResolve(item) {
  try {
    await adminResolveFeedback(item.id)
    item.status = 'resolved'
  } catch (e) { console.warn('[admin resolve]', e) }
}

async function handleDeleteFeedback(item) {
  if (!confirm('Diesen Feedback-Eintrag wirklich löschen?')) return
  try {
    await adminDeleteFeedback(item.id)
    allFeedback.value = allFeedback.value.filter(f => f.id !== item.id)
  } catch (e) { console.warn('[admin delete feedback]', e) }
}

async function handleDeleteRating(item) {
  if (!confirm('Diese Bewertung wirklich löschen?')) return
  try {
    await adminDeleteRating(item.id)
    allRatings.value = allRatings.value.filter(r => r.id !== item.id)
  } catch (e) { console.warn('[admin delete rating]', e) }
}

// ── Helpers ───────────────────────────────────────────────────────────

function formatRelativeDate(dateStr) {
  if (!dateStr) return ''
  const date      = new Date(dateStr)
  const diffMs    = Date.now() - date
  const diffMins  = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays  = Math.floor(diffMs / 86400000)
  if (diffMins  < 2)  return 'Gerade eben'
  if (diffMins  < 60) return `Vor ${diffMins} Minuten`
  if (diffHours < 24) return `Vor ${diffHours} Stunden`
  if (diffDays === 1) return 'Gestern'
  if (diffDays  < 7)  return `Vor ${diffDays} Tagen`
  return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.nav-label-dark { text-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 0 8px rgba(0,0,0,0.15); }
.nav-label      { text-shadow: 0 1px 4px rgba(255,255,255,0.6), 0 0 12px rgba(255,255,255,0.4); }
.nav-icon-dark  { filter: drop-shadow(0 1px 3px rgba(0,0,0,0.3)); }
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.25s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
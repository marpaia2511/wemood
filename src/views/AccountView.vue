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
      <h1 class="text-2xl sm:text-3xl font-quicksand font-bold text-white nav-label-dark">Konto</h1>
      <div class="text-xl sm:text-2xl font-quicksand font-bold text-white nav-label-dark">WeMood</div>
    </div>

    <!-- Tab bar -->
    <div class="flex items-center gap-1 px-4 sm:px-8 mb-6 flex-wrap">
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
      </button>
    </div>

    <!-- ── KONTO TAB ── -->
    <div v-if="activeTab === 'konto'" class="px-4 sm:px-8 max-w-xl mx-auto space-y-4 pb-12">

      <!-- Profile card -->
      <div class="glass-strong rounded-3xl p-6 sm:p-8">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-14 h-14 sm:w-16 sm:h-16 bg-gray-800/80 rounded-2xl flex items-center justify-center shrink-0">
            <span class="text-2xl sm:text-3xl font-quicksand font-bold text-white">{{ currentUser?.avatar || '?' }}</span>
          </div>
          <div>
            <p class="text-lg sm:text-xl font-semibold text-gray-800 nav-label">{{ currentUser?.name }}</p>
            <p class="text-sm text-gray-500 nav-label-dark">{{ currentUser?.email }}</p>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 nav-label-dark mb-1.5">Anzeigename ändern</label>
          <div class="flex gap-2">
            <input
              v-model="newName" type="text" :placeholder="currentUser?.name"
              @keyup.enter="handleUpdateName"
              class="flex-1 glass-subtle rounded-2xl px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:bg-white/30 transition-all nav-label-dark"
            />
            <button
              @click="handleUpdateName"
              :disabled="authLoading || !newName.trim() || newName.trim() === currentUser?.name"
              class="px-4 py-2.5 glass hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed text-gray-800 text-sm font-medium rounded-2xl transition-all nav-label flex items-center gap-1.5"
            >
              <LoaderIcon v-if="authLoading" class="w-3.5 h-3.5 animate-spin" />
              <span>{{ authLoading ? '…' : 'Speichern' }}</span>
            </button>
          </div>
          <Transition name="fade-slide">
            <p v-if="saveSuccess" class="text-xs text-green-600 mt-2 ml-1 flex items-center gap-1 nav-label-dark">
              <CheckCircleIcon class="w-3.5 h-3.5" /> Name erfolgreich gespeichert
            </p>
          </Transition>
        </div>
      </div>

      <!-- Info card -->
      <div class="glass-strong rounded-3xl p-6 sm:p-8">
        <h2 class="text-base font-semibold text-gray-700 nav-label-dark mb-4">Kontoinformationen</h2>
        <div class="space-y-3">
          <div class="flex items-center justify-between py-2 border-b border-white/20">
            <span class="text-sm text-gray-500 nav-label-dark">E-Mail</span>
            <span class="text-sm font-medium text-gray-800 nav-label">{{ currentUser?.email }}</span>
          </div>
          <div class="flex items-center justify-between py-2 border-b border-white/20">
            <span class="text-sm text-gray-500 nav-label-dark">Konto erstellt</span>
            <span class="text-sm font-medium text-gray-800 nav-label">{{ formattedDate }}</span>
          </div>
          <div class="flex items-center justify-between py-2">
            <span class="text-sm text-gray-500 nav-label-dark">Konto-ID</span>
            <span class="text-xs font-mono text-gray-400 nav-label-dark">{{ currentUser?.id?.slice(0, 8) }}…</span>
          </div>
        </div>
      </div>

      <!-- Admin card (visible to admins only) -->
      <Transition name="fade-slide">
        <div v-if="userIsAdmin" class="glass-strong rounded-3xl p-6 sm:p-8">
          <router-link to="/admin" class="w-full flex items-center justify-between group">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 glass-subtle rounded-xl flex items-center justify-center">
                <ShieldIcon class="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <span class="text-base font-medium text-gray-800 nav-label">Admin-Bereich</span>
                <p class="text-xs text-gray-500 nav-label-dark">Feedback &amp; Nutzerverwaltung</p>
              </div>
            </div>
            <ChevronRightIcon class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </router-link>
        </div>
      </Transition>

      <!-- Logout card -->
      <div class="glass-strong rounded-3xl p-6 sm:p-8">
        <button @click="handleLogout" class="w-full flex items-center justify-between group">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 glass-subtle rounded-xl flex items-center justify-center">
              <LogOutIcon class="w-4 h-4 text-red-400" />
            </div>
            <span class="text-base font-medium text-gray-800 nav-label">Abmelden</span>
          </div>
          <ChevronRightIcon class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>
      </div>
    </div>

    <!-- ── FAVORITEN TAB ── -->
    <div v-else-if="activeTab === 'favoriten'" class="px-4 sm:px-8 max-w-xl mx-auto pb-12">
      <div v-if="favLoading" class="flex flex-col items-center justify-center py-20 gap-3">
        <LoaderIcon class="w-7 h-7 text-white/60 animate-spin" />
        <p class="text-sm text-white/60 nav-label-dark">Wird geladen…</p>
      </div>
      <div v-else-if="favorites.length === 0" class="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <div class="w-14 h-14 glass-subtle rounded-2xl flex items-center justify-center">
          <HeartIcon class="w-7 h-7 text-white/40" />
        </div>
        <p class="text-white/80 font-medium nav-label-dark">Noch keine Favoriten</p>
        <p class="text-sm text-white/50 nav-label-dark max-w-xs">Tippe auf das Herz-Symbol in einem Artikel, um ihn hier zu speichern.</p>
      </div>
      <div v-else class="space-y-3">
        <p class="text-xs text-white/50 nav-label-dark mb-4">{{ favorites.length }} gespeicherte Artikel</p>
        <router-link
          v-for="item in favorites" :key="item.id"
          :to="'/article/' + item.article_id"
          class="flex items-center gap-4 glass-strong rounded-2xl p-4 hover:bg-white/25 transition-all group"
        >
          <div class="w-11 h-11 glass-subtle rounded-xl flex items-center justify-center text-xl shrink-0">
            {{ item.article_emoji || '📄' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-800 nav-label truncate">{{ item.article_title }}</p>
            <p class="text-xs text-gray-500 nav-label-dark mt-0.5">{{ formatRelativeDate(item.created_at) }}</p>
          </div>
          <button @click.prevent="unfavorite(item.article_id)" class="p-2 glass-subtle rounded-full hover:bg-red-100/30 transition-colors shrink-0" title="Entfernen">
            <HeartIcon class="w-4 h-4 fill-red-400 text-red-400" />
          </button>
        </router-link>
      </div>
    </div>

    <!-- ── VERLAUF TAB ── -->
    <div v-else-if="activeTab === 'verlauf'" class="px-4 sm:px-8 max-w-xl mx-auto pb-12">
      <div v-if="historyLoading" class="flex flex-col items-center justify-center py-20 gap-3">
        <LoaderIcon class="w-7 h-7 text-white/60 animate-spin" />
        <p class="text-sm text-white/60 nav-label-dark">Wird geladen…</p>
      </div>
      <div v-else-if="history.length === 0" class="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <div class="w-14 h-14 glass-subtle rounded-2xl flex items-center justify-center">
          <ClockIcon class="w-7 h-7 text-white/40" />
        </div>
        <p class="text-white/80 font-medium nav-label-dark">Noch kein Verlauf</p>
        <p class="text-sm text-white/50 nav-label-dark">Artikel, die du öffnest, erscheinen hier automatisch.</p>
      </div>
      <div v-else class="space-y-3">
        <div class="flex items-center justify-between mb-4">
          <p class="text-xs text-white/50 nav-label-dark">{{ history.length }} besuchte Artikel</p>
          <button @click="handleClearHistory" class="text-xs text-red-400 hover:text-red-300 transition-colors nav-label-dark">
            Verlauf löschen
          </button>
        </div>
        <router-link
          v-for="item in history" :key="item.id"
          :to="'/article/' + item.article_id"
          class="flex items-center gap-4 glass-strong rounded-2xl p-4 hover:bg-white/25 transition-all group"
        >
          <div class="w-11 h-11 glass-subtle rounded-xl flex items-center justify-center text-xl shrink-0">
            {{ item.article_emoji || '📄' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-800 nav-label truncate">{{ item.article_title }}</p>
            <p class="text-xs text-gray-500 nav-label-dark mt-0.5">{{ formatRelativeDate(item.viewed_at) }}</p>
          </div>
          <ChevronRightIcon class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0" />
        </router-link>
      </div>
    </div>

    <!-- ── FEEDBACK TAB ── -->
    <div v-else-if="activeTab === 'feedback'" class="px-4 sm:px-8 max-w-xl mx-auto pb-12">
      <div class="glass-strong rounded-3xl p-6 sm:p-8">
        <h2 class="text-base font-semibold text-gray-700 nav-label-dark mb-1">Feedback senden</h2>
        <p class="text-xs text-gray-500 nav-label-dark mb-5">Dein Feedback hilft uns, WeMood kontinuierlich zu verbessern.</p>

        <!-- Success state — replaces form after submit -->
        <Transition name="fade-slide">
          <div v-if="feedbackSuccess" class="flex flex-col items-center gap-4 py-8 text-center">
            <div class="w-14 h-14 glass-subtle rounded-2xl flex items-center justify-center">
              <CheckCircleIcon class="w-7 h-7 text-green-500" />
            </div>
            <div>
              <p class="text-base font-semibold text-gray-800 nav-label">Vielen Dank!</p>
              <p class="text-sm text-gray-500 nav-label-dark mt-1">Dein Feedback wurde übermittelt und wird geprüft.</p>
            </div>
            <button
              @click="resetFeedbackForm"
              class="mt-2 px-5 py-2 glass hover:bg-white/30 text-gray-700 text-sm font-medium rounded-full transition-all nav-label"
            >
              Weiteres Feedback senden
            </button>
          </div>
        </Transition>

        <!-- Form — hidden after success -->
        <div v-if="!feedbackSuccess">
          <!-- Category -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-600 nav-label-dark mb-2">Kategorie</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="cat in feedbackCategories" :key="cat"
                @click="feedbackCategory = cat"
                class="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                :class="feedbackCategory === cat
                  ? 'glass border-white/40 text-gray-800 shadow-md bg-white/30 nav-label'
                  : 'glass-subtle text-gray-600 hover:bg-white/25 nav-label-dark'"
              >
                {{ cat }}
              </button>
            </div>
          </div>

          <!-- Message -->
          <div class="mb-5">
            <label class="block text-sm font-medium text-gray-600 nav-label-dark mb-1.5">Nachricht</label>
            <textarea
              v-model="feedbackMessage"
              placeholder="Beschreibe dein Anliegen…"
              rows="4"
              maxlength="1000"
              class="w-full glass-subtle rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:bg-white/30 transition-all nav-label-dark resize-none"
            />
            <p class="text-xs text-gray-400 nav-label-dark text-right mt-1">{{ feedbackMessage.length }}/1000</p>
          </div>

          <!-- Error -->
          <Transition name="fade-slide">
            <p v-if="feedbackError" class="text-xs text-red-500 mb-3 ml-1 nav-label-dark">{{ feedbackError }}</p>
          </Transition>

          <button
            @click="handleSubmitFeedback"
            :disabled="feedbackLoading || !feedbackMessage.trim() || !feedbackCategory"
            class="w-full py-3 glass hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed text-gray-800 text-sm font-semibold rounded-2xl transition-all nav-label flex items-center justify-center gap-2"
          >
            <LoaderIcon v-if="feedbackLoading" class="w-4 h-4 animate-spin" />
            <SendIcon v-else class="w-4 h-4" />
            {{ feedbackLoading ? 'Wird gesendet…' : 'Feedback senden' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChevronUp     as ChevronUpIcon,
  LogOut        as LogOutIcon,
  ChevronRight  as ChevronRightIcon,
  Loader        as LoaderIcon,
  CheckCircle   as CheckCircleIcon,
  Heart         as HeartIcon,
  Clock         as ClockIcon,
  User          as UserIcon,
  Send          as SendIcon,
  MessageSquare as MessageSquareIcon,
  Shield     as ShieldIcon,
} from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth.js'
import {
  getFavorites, removeFavorite,
  getArticleHistory, clearArticleHistory,
  submitFeedback,
  getProfile,
} from '../services/api.js'

const router = useRouter()
const { currentUser, logout, updateProfile, authLoading } = useAuth()

const userIsAdmin = ref(false)
onMounted(async () => { const p = await getProfile(); userIsAdmin.value = p?.role === 'admin' })

const activeTab      = ref('konto')
const newName        = ref('')
const saveSuccess    = ref(false)
const favorites      = ref([])
const favLoading     = ref(false)
const history        = ref([])
const historyLoading = ref(false)

// Feedback state
const feedbackCategories = ['Bug Report', 'Feature Request', 'Content Feedback', 'General Feedback']
const feedbackCategory   = ref('')
const feedbackMessage    = ref('')
const feedbackLoading    = ref(false)
const feedbackError      = ref('')
const feedbackSuccess    = ref(false)

const tabs = [
  { key: 'konto',     label: 'Konto',     icon: UserIcon          },
  { key: 'favoriten', label: 'Favoriten', icon: HeartIcon         },
  { key: 'verlauf',   label: 'Verlauf',   icon: ClockIcon         },
  { key: 'feedback',  label: 'Feedback',  icon: MessageSquareIcon },
]

const formattedDate = computed(() => {
  if (!currentUser.value?.createdAt) return '—'
  return new Date(currentUser.value.createdAt).toLocaleDateString('de-DE', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
})

watch(activeTab, async (tab) => {
  if (tab === 'favoriten' && favorites.value.length === 0) await loadFavorites()
  if (tab === 'verlauf'   && history.value.length === 0)   await loadHistory()
  if (tab !== 'feedback') {
    feedbackError.value = ''
  }
})

async function loadFavorites() {
  favLoading.value = true
  try { favorites.value = await getFavorites() }
  catch (e) { console.warn(e) }
  finally { favLoading.value = false }
}

async function loadHistory() {
  historyLoading.value = true
  try { history.value = await getArticleHistory() }
  catch (e) { console.warn(e) }
  finally { historyLoading.value = false }
}

async function unfavorite(articleId) {
  await removeFavorite(articleId)
  favorites.value = favorites.value.filter(f => f.article_id !== articleId)
}

async function handleClearHistory() {
  if (!confirm('Verlauf wirklich löschen?')) return
  await clearArticleHistory()
  history.value = []
}

async function handleUpdateName() {
  if (!newName.value.trim() || newName.value.trim() === currentUser.value?.name) return
  const success = await updateProfile({ name: newName.value })
  if (success) {
    newName.value = ''
    saveSuccess.value = true
    setTimeout(() => { saveSuccess.value = false }, 2500)
  }
}

async function handleSubmitFeedback() {
  feedbackError.value = ''

  if (!feedbackCategory.value) {
    feedbackError.value = 'Bitte wähle eine Kategorie aus.'
    return
  }
  if (feedbackMessage.value.trim().length < 10) {
    feedbackError.value = 'Deine Nachricht ist zu kurz (min. 10 Zeichen).'
    return
  }

  feedbackLoading.value = true
  try {
    await submitFeedback({
      category: feedbackCategory.value,
      message:  feedbackMessage.value.trim(),
    })
    feedbackSuccess.value  = true
    feedbackCategory.value = ''
    feedbackMessage.value  = ''
  } catch (e) {
    feedbackError.value = 'Fehler beim Senden. Bitte versuche es erneut.'
    console.warn('[feedback]', e)
  } finally {
    feedbackLoading.value = false
  }
}

function resetFeedbackForm() {
  feedbackSuccess.value  = false
  feedbackError.value    = ''
  feedbackCategory.value = ''
  feedbackMessage.value  = ''
}

function handleLogout() {
  logout()
  router.push('/')
}

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
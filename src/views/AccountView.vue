<template>
  <div class="min-h-screen">

    <!-- Top Bar -->
    <div class="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6">
      <div class="flex items-center gap-3 sm:gap-4">
        <router-link to="/" class="p-2 sm:p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
          <ArrowLeftIcon class="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        </router-link>
        <h1 class="text-2xl sm:text-3xl font-quicksand font-semibold text-gray-800">Konto</h1>
      </div>
      <div class="text-xl sm:text-2xl font-quicksand font-semibold text-gray-800">WeMood</div>
    </div>

    <!-- Tab bar -->
    <div class="flex items-center gap-1 px-4 sm:px-8 mb-6">
      <button
        v-for="tab in tabs" :key="tab.key"
        @click="activeTab = tab.key"
        class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
        :class="activeTab === tab.key ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        {{ tab.label }}
      </button>
    </div>

    <!-- KONTO TAB -->
    <div v-if="activeTab === 'konto'" class="px-4 sm:px-8 max-w-xl mx-auto space-y-4 pb-12">
      <div class="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-14 h-14 sm:w-16 sm:h-16 bg-gray-800 rounded-2xl flex items-center justify-center shrink-0">
            <span class="text-2xl sm:text-3xl font-quicksand font-bold text-white">{{ currentUser?.avatar || '?' }}</span>
          </div>
          <div>
            <p class="text-lg sm:text-xl font-semibold text-gray-800">{{ currentUser?.name }}</p>
            <p class="text-sm text-gray-400">{{ currentUser?.email }}</p>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Anzeigename ändern</label>
          <div class="flex gap-2">
            <input v-model="newName" type="text" :placeholder="currentUser?.name" @keyup.enter="handleUpdateName"
              class="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 focus:bg-white transition-all" />
            <button @click="handleUpdateName"
              :disabled="authLoading || !newName.trim() || newName.trim() === currentUser?.name"
              class="px-4 py-2.5 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-2xl transition-all flex items-center gap-1.5">
              <LoaderIcon v-if="authLoading" class="w-3.5 h-3.5 animate-spin" />
              <span>{{ authLoading ? '…' : 'Speichern' }}</span>
            </button>
          </div>
          <Transition name="fade-slide">
            <p v-if="saveSuccess" class="text-xs text-green-600 mt-2 ml-1 flex items-center gap-1">
              <CheckCircleIcon class="w-3.5 h-3.5" /> Name erfolgreich gespeichert
            </p>
          </Transition>
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8">
        <h2 class="text-base font-semibold text-gray-700 mb-4">Kontoinformationen</h2>
        <div class="space-y-3">
          <div class="flex items-center justify-between py-2 border-b border-gray-50">
            <span class="text-sm text-gray-500">E-Mail</span>
            <span class="text-sm font-medium text-gray-800">{{ currentUser?.email }}</span>
          </div>
          <div class="flex items-center justify-between py-2 border-b border-gray-50">
            <span class="text-sm text-gray-500">Konto erstellt</span>
            <span class="text-sm font-medium text-gray-800">{{ formattedDate }}</span>
          </div>
          <div class="flex items-center justify-between py-2">
            <span class="text-sm text-gray-500">Konto-ID</span>
            <span class="text-xs font-mono text-gray-400">{{ currentUser?.id?.slice(0, 8) }}…</span>
          </div>
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8">
        <button @click="handleLogout" class="w-full flex items-center justify-between group">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
              <LogOutIcon class="w-4 h-4 text-red-500" />
            </div>
            <span class="text-base font-medium text-gray-800">Abmelden</span>
          </div>
          <ChevronRightIcon class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>
      </div>
    </div>

    <!-- FAVORITEN TAB -->
    <div v-else-if="activeTab === 'favoriten'" class="px-4 sm:px-8 max-w-xl mx-auto pb-12">
      <div v-if="favLoading" class="flex flex-col items-center justify-center py-20 gap-3">
        <LoaderIcon class="w-7 h-7 text-gray-400 animate-spin" />
        <p class="text-sm text-gray-400">Wird geladen…</p>
      </div>
      <div v-else-if="favorites.length === 0" class="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <div class="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
          <HeartIcon class="w-7 h-7 text-gray-300" />
        </div>
        <p class="text-gray-500 font-medium">Noch keine Favoriten</p>
        <p class="text-sm text-gray-400 max-w-xs">Tippe auf das Herz-Symbol in einem Artikel, um ihn hier zu speichern.</p>
      </div>
      <div v-else class="space-y-3">
        <p class="text-xs text-gray-400 mb-4">{{ favorites.length }} gespeicherte Artikel</p>
        <router-link v-for="item in favorites" :key="item.id" :to="'/article/' + item.article_id"
          class="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-sm hover:border-gray-300 transition-all group">
          <div class="w-11 h-11 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-xl shrink-0">
            {{ item.article_emoji || '📄' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-800 truncate">{{ item.article_title }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ formatRelativeDate(item.created_at) }}</p>
          </div>
          <button @click.prevent="unfavorite(item.article_id)" class="p-2 rounded-full hover:bg-red-50 transition-colors shrink-0" title="Entfernen">
            <HeartIcon class="w-4 h-4 fill-red-400 text-red-400" />
          </button>
        </router-link>
      </div>
    </div>

    <!-- VERLAUF TAB -->
    <div v-else-if="activeTab === 'verlauf'" class="px-4 sm:px-8 max-w-xl mx-auto pb-12">
      <div v-if="historyLoading" class="flex flex-col items-center justify-center py-20 gap-3">
        <LoaderIcon class="w-7 h-7 text-gray-400 animate-spin" />
        <p class="text-sm text-gray-400">Wird geladen…</p>
      </div>
      <div v-else-if="history.length === 0" class="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <div class="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
          <ClockIcon class="w-7 h-7 text-gray-300" />
        </div>
        <p class="text-gray-500 font-medium">Noch kein Verlauf</p>
        <p class="text-sm text-gray-400">Artikel, die du öffnest, erscheinen hier automatisch.</p>
      </div>
      <div v-else class="space-y-3">
        <div class="flex items-center justify-between mb-4">
          <p class="text-xs text-gray-400">{{ history.length }} besuchte Artikel</p>
          <button @click="handleClearHistory" class="text-xs text-red-400 hover:text-red-600 transition-colors">
            Verlauf löschen
          </button>
        </div>
        <router-link v-for="item in history" :key="item.id" :to="'/article/' + item.article_id"
          class="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-sm hover:border-gray-300 transition-all group">
          <div class="w-11 h-11 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-xl shrink-0">
            {{ item.article_emoji || '📄' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-800 truncate">{{ item.article_title }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ formatRelativeDate(item.viewed_at) }}</p>
          </div>
          <ChevronRightIcon class="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
        </router-link>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft    as ArrowLeftIcon,
  LogOut       as LogOutIcon,
  ChevronRight as ChevronRightIcon,
  Loader       as LoaderIcon,
  CheckCircle  as CheckCircleIcon,
  Heart        as HeartIcon,
  Clock        as ClockIcon,
  User         as UserIcon
} from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth.js'
import { getFavorites, removeFavorite, getArticleHistory, clearArticleHistory } from '../services/api.js'

const router = useRouter()
const { currentUser, logout, updateProfile, authLoading } = useAuth()

const activeTab    = ref('konto')
const newName      = ref('')
const saveSuccess  = ref(false)
const favorites    = ref([])
const favLoading   = ref(false)
const history      = ref([])
const historyLoading = ref(false)

const tabs = [
  { key: 'konto',     label: 'Konto',     icon: UserIcon  },
  { key: 'favoriten', label: 'Favoriten', icon: HeartIcon },
  { key: 'verlauf',   label: 'Verlauf',   icon: ClockIcon }
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

function handleLogout() {
  logout()
  router.push('/')
}

function formatRelativeDate(dateStr) {
  if (!dateStr) return ''
  const date     = new Date(dateStr)
  const diffMs   = Date.now() - date
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
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.25s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
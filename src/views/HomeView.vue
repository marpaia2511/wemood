<template>
  <div class="min-h-screen flex flex-col">

    <!-- Top Bar -->
    <div class="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6">
      <div class="text-xl sm:text-2xl text-gray-800 font-quicksand font-semibold">WeMood</div>
      <div class="flex items-center gap-2 sm:gap-3">
        <button
          @click="$emit('openEmergency')"
          :class="['relative px-3 sm:px-6 py-2 text-white text-sm sm:text-base rounded-full transition-all duration-500 overflow-visible', sensitiveDetected ? 'bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.25)] scale-105' : 'bg-red-500 hover:bg-red-600']"
        >
          <span v-if="sensitiveDetected" class="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-60 pointer-events-none" />
          <span class="relative">Notfall-Hilfe</span>
        </button>
        <router-link v-if="isLoggedIn" to="/account" class="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors shrink-0" :title="currentUser?.name">
          <span class="text-sm sm:text-base font-bold text-white font-quicksand">{{ currentUser?.avatar }}</span>
        </router-link>
        <router-link v-else to="/login" class="px-3 sm:px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm sm:text-base rounded-full transition-colors font-medium">Anmelden</router-link>
        <router-link to="/settings" class="p-2 sm:p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
          <SettingsIcon class="w-5 h-5 text-gray-700" />
        </router-link>
      </div>
    </div>

    <!-- Sensitive Banner -->
    <Transition name="banner-slide">
      <div v-if="sensitiveDetected" class="mx-4 sm:mx-8 mb-2 overflow-hidden">
        <div class="relative flex items-center gap-3 sm:gap-4 bg-red-50 border border-red-100 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 cursor-pointer group" @click="$emit('openEmergency')">
          <span class="relative flex h-3 w-3 shrink-0">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
          <p class="text-sm sm:text-base text-red-700 leading-snug flex-1">
            <span class="font-semibold">Du scheinst gerade etwas Schweres zu durchleben.</span>
            <span class="text-red-500"> Hier findest du sofortige Hilfe und Unterstützung. →</span>
          </p>
          <button class="shrink-0 p-1 rounded-full hover:bg-red-100 transition-colors" @click.stop="dismissBanner">
            <XIcon class="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>
    </Transition>

    <!-- Main -->
    <div class="flex-1 flex flex-col items-center justify-center px-4 sm:px-6">
      <div class="w-full max-w-3xl">

        <!-- Greeting -->
        <div class="text-center mb-8 sm:mb-12">
          <h1 class="text-5xl sm:text-7xl md:text-8xl font-quicksand font-bold text-gray-800">WeMood</h1>
          <Transition name="greeting-fade">
            <p v-if="isLoggedIn" class="text-gray-500 mt-3 text-base sm:text-lg">
              Hallo, <span class="font-semibold text-gray-700">{{ currentUser?.name }}</span> 👋
            </p>
          </Transition>
        </div>

        <!-- Search -->
        <form @submit.prevent="handleSearch" class="mb-6 sm:mb-8">
          <div class="relative" ref="searchContainer">
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="Suche nach Themen..."
              autocomplete="off"
              @focus="showSuggestions = true"
              @keydown.down.prevent="moveSuggestion(1)"
              @keydown.up.prevent="moveSuggestion(-1)"
              @keydown.enter.prevent="selectOrSearch"
              @keydown.escape="showSuggestions = false"
              :class="[
                'w-full bg-white border rounded-full px-6 sm:px-8 py-3 sm:py-5 pr-28 sm:pr-32 text-base sm:text-lg placeholder:text-gray-400 text-gray-800 outline-none transition-all duration-300',
                searchError
                  ? 'border-orange-300 shadow-[0_0_0_3px_rgba(251,146,60,0.15)] focus:border-orange-400'
                  : sensitiveDetected
                    ? 'border-red-300 shadow-[0_0_0_3px_rgba(239,68,68,0.12)] focus:border-red-400'
                    : 'border-gray-300 focus:border-gray-500 focus:shadow-md'
              ]"
            />
            <button type="submit" class="absolute right-2 top-1/2 -translate-y-1/2 px-4 sm:px-8 py-2 sm:py-3 bg-gray-700 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2 text-white text-sm sm:text-base">
              <SearchIcon class="w-4 h-4 sm:w-5 sm:h-5" />
              <span class="hidden sm:inline">Suchen</span>
            </button>

            <!-- Autocomplete dropdown -->
            <Transition name="dropdown">
              <div v-if="showSuggestions && visibleSuggestions.length > 0" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden z-50">
                <button
                  v-for="(s, i) in visibleSuggestions" :key="s.text"
                  type="button"
                  @mousedown.prevent="selectSuggestion(s.text)"
                  class="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                  :class="{ 'bg-gray-50': activeSuggestion === i }"
                >
                  <component :is="s.icon" class="w-4 h-4 shrink-0" :class="s.iconClass" />
                  <span class="text-sm text-gray-800 flex-1">
                    <span class="font-semibold">{{ s.text.slice(0, searchQuery.length) }}</span>{{ s.text.slice(searchQuery.length) }}
                  </span>
                  <span class="text-xs text-gray-400">{{ s.hint }}</span>
                </button>
              </div>
            </Transition>
          </div>

          <Transition name="fade-slide">
            <p v-if="searchError" class="text-sm text-orange-500 mt-2 ml-4">
              Bitte gib etwas ein, bevor du suchst 🔍
            </p>
          </Transition>
        </form>

        <!-- Emotion Tags -->
        <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 sm:mb-16">
          <button
            v-for="emotion in emotions" :key="emotion.value"
            @click="toggleEmotion(emotion.value)"
            :class="['px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border transition-colors text-sm sm:text-base', selectedEmotions.includes(emotion.value) ? 'bg-gray-700 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100']"
          >
            {{ emotion.label }}
          </button>
        </div>

        <!-- Personalized Recommendations (logged in only) -->
        <Transition name="fade-slide">
          <div v-if="isLoggedIn && recommendations.length > 0" class="mb-8 sm:mb-10">
            <div class="flex items-center gap-2 mb-3 px-1">
              <SparklesIcon class="w-4 h-4 text-gray-400" />
              <span class="text-sm text-gray-500 font-medium">{{ recommendationLabel }}</span>
            </div>
            <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <router-link
                v-for="rec in recommendations" :key="rec.id"
                :to="'/article/' + rec.id"
                class="flex-shrink-0 flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 hover:shadow-sm hover:border-gray-300 transition-all max-w-xs"
              >
                <span class="text-2xl">{{ rec.emoji }}</span>
                <span class="text-sm font-medium text-gray-700 line-clamp-2 leading-snug">{{ rec.title }}</span>
              </router-link>
            </div>
          </div>
        </Transition>

        <!-- Bibliothek -->
        <div class="flex flex-col items-center gap-3 sm:gap-4">
          <router-link to="/library" class="px-8 sm:px-12 py-3 sm:py-4 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
            <span class="text-base sm:text-lg text-gray-700">Bibliothek</span>
          </router-link>
          <router-link to="/library" class="bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition-colors">
            <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </router-link>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search as SearchIcon,
  Settings as SettingsIcon,
  ChevronDown as ChevronDownIcon,
  X as XIcon,
  Sparkles as SparklesIcon,
  Clock as ClockIcon,
  Heart as HeartIcon,
  TrendingUp as TrendingUpIcon
} from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth.js'
import { getArticleHistory, getFavorites, getAllArticles } from '../services/api.js'

const router = useRouter()
const { currentUser, isLoggedIn } = useAuth()

defineEmits(['openEmergency'])

// ── Search state ──────────────────────────────────────────────────────
const searchQuery      = ref('')
const searchError      = ref(false)
const selectedEmotions = ref([])
const bannerDismissed  = ref(false)
const searchContainer  = ref(null)
const searchInput      = ref(null)
const showSuggestions  = ref(false)
const activeSuggestion = ref(-1)

// ── Recommendations ───────────────────────────────────────────────────
const recommendations    = ref([])
const recommendationLabel = ref('Empfehlungen für dich')
const allArticles        = ref([])

// ── Suggestion pool (static German mental health terms) ───────────────
const suggestionPool = [
  'Angststörung', 'Angst', 'Angstattacke', 'Angstbewältigung',
  'Depression', 'Depressionen', 'Depressiv',
  'Stress', 'Stressbewältigung', 'Stressabbau',
  'Trauma', 'Traumabewältigung', 'PTBS',
  'Schlafstörung', 'Schlafprobleme', 'Schlafen',
  'Burnout', 'Erschöpfung',
  'Panikattacke', 'Panikstörung',
  'Selbstwert', 'Selbstvertrauen', 'Selbstfürsorge',
  'Achtsamkeit', 'Meditation', 'Entspannung',
  'Einsamkeit', 'Soziale Angst',
  'Essstörung', 'Magersucht', 'Bulimie',
  'Kognitive Verhaltenstherapie', 'KVT', 'Psychotherapie',
  'Resilienz', 'Wohlbefinden', 'Mentale Gesundheit',
  'Trauer', 'Verlust', 'Traurigkeit',
  'Konzentration', 'Konzentrationsprobleme', 'ADHS',
  'Sucht', 'Abhängigkeit'
]

const sensitiveKeywords = [
  'suizid', 'suicide', 'selbstmord', 'selbstverletzung', 'self-harm', 'self harm',
  'sterben', 'sterben wollen', 'nicht mehr leben', 'tod', 'töten', 'umbringen',
  'hoffnungslos', 'hoffnungslosigkeit', 'depression', 'verzweiflung', 'krise',
  'crisis', 'harming', 'cutting', 'overdose', 'überdosis', 'missbrauch', 'abuse',
  'trauma', 'panic attack', 'panikattacke', 'angststörung', 'eating disorder',
  'essstörung', 'magersucht', 'anorexia', 'bulimia'
]

const sensitiveDetected = computed(() => {
  if (bannerDismissed.value) return false
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return false
  return sensitiveKeywords.some(kw => q.includes(kw))
})

// ── Autocomplete ──────────────────────────────────────────────────────
const visibleSuggestions = computed(() => {
  const q = searchQuery.value.trim()
  if (!q || q.length < 2) return []

  const qLower = q.toLowerCase()
  const results = []

  // History matches first
  historyTitles.value
    .filter(t => t.toLowerCase().startsWith(qLower))
    .slice(0, 2)
    .forEach(t => results.push({ text: t, hint: 'Verlauf', icon: ClockIcon, iconClass: 'text-gray-400' }))

  // Favorites matches
  favoriteTitles.value
    .filter(t => t.toLowerCase().startsWith(qLower) && !results.find(r => r.text === t))
    .slice(0, 2)
    .forEach(t => results.push({ text: t, hint: 'Favorit', icon: HeartIcon, iconClass: 'text-red-400' }))

  // Static pool
  suggestionPool
    .filter(t => t.toLowerCase().startsWith(qLower) && !results.find(r => r.text.toLowerCase() === t.toLowerCase()))
    .slice(0, 5 - results.length)
    .forEach(t => results.push({ text: t, hint: 'Vorschlag', icon: SearchIcon, iconClass: 'text-gray-300' }))

  return results.slice(0, 6)
})

const historyTitles  = ref([])
const favoriteTitles = ref([])

watch(searchQuery, () => { activeSuggestion.value = -1 })

function moveSuggestion(dir) {
  const max = visibleSuggestions.value.length - 1
  if (max < 0) return
  activeSuggestion.value = Math.max(-1, Math.min(max, activeSuggestion.value + dir))
}

function selectSuggestion(text) {
  searchQuery.value = text
  showSuggestions.value = false
  activeSuggestion.value = -1
}

function selectOrSearch() {
  if (activeSuggestion.value >= 0 && visibleSuggestions.value[activeSuggestion.value]) {
    selectSuggestion(visibleSuggestions.value[activeSuggestion.value].text)
  } else {
    handleSearch()
  }
}

function handleClickOutside(e) {
  if (searchContainer.value && !searchContainer.value.contains(e.target)) {
    showSuggestions.value = false
  }
}

// ── Recommendations engine ────────────────────────────────────────────
async function loadRecommendations() {
  if (!isLoggedIn.value) return
  try {
    const [history, favorites, articles] = await Promise.all([
      getArticleHistory({ limit: 20 }),
      getFavorites(),
      getAllArticles()
    ])

    allArticles.value = articles
    historyTitles.value  = history.map(h => h.article_title).filter(Boolean)
    favoriteTitles.value = favorites.map(f => f.article_title).filter(Boolean)

    // Build a tag frequency map from history + favorites (favorites count double)
    const tagScore = {}
    const seen = new Set([...history.map(h => h.article_id), ...favorites.map(f => f.article_id)])

    // Score tags from history
    history.forEach(h => {
      // Use emoji/title keywords as proxy for tags since history only stores title+emoji
      tokenize(h.article_title).forEach(t => { tagScore[t] = (tagScore[t] || 0) + 1 })
    })
    // Favorites count double
    favorites.forEach(f => {
      tokenize(f.article_title).forEach(t => { tagScore[t] = (tagScore[t] || 0) + 2 })
    })

    if (Object.keys(tagScore).length === 0) return

    // Score all library articles
    const scored = articles
      .filter(a => !seen.has(a.id)) // exclude already-seen
      .map(a => ({
        ...a,
        score: tokenize(a.title).reduce((sum, t) => sum + (tagScore[t] || 0), 0)
      }))
      .sort((a, b) => b.score - a.score)

    const top = scored.filter(a => a.score > 0).slice(0, 6)

    if (top.length > 0) {
      recommendations.value = top
      if (favorites.length > 0) {
        recommendationLabel.value = 'Basierend auf deinen Favoriten'
      } else {
        recommendationLabel.value = 'Basierend auf deinem Verlauf'
      }
    } else if (articles.length > 0) {
      // Fallback: just show random articles if no signal yet
      recommendations.value = articles.slice(0, 4)
      recommendationLabel.value = 'Entdecke diese Artikel'
    }
  } catch (e) {
    console.warn('Recommendations failed:', e.message)
  }
}

function tokenize(title) {
  if (!title) return []
  return title.toLowerCase()
    .replace(/[–\-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 3)
}

// ── Misc ──────────────────────────────────────────────────────────────
watch(searchQuery, (newVal, oldVal) => {
  if (newVal.toLowerCase().trim() !== oldVal.toLowerCase().trim()) {
    bannerDismissed.value = false
  }
  showSuggestions.value = true
})

function dismissBanner() { bannerDismissed.value = true }

const emotions = [
  { label: 'Fear',      value: 'fear'      },
  { label: 'Sadness',   value: 'sadness'   },
  { label: 'Happiness', value: 'happiness' },
  { label: 'Stress',    value: 'stress'    },
  { label: 'Energy',    value: 'energy'    },
  { label: 'Calm',      value: 'calm'      }
]

function toggleEmotion(emotion) {
  if (selectedEmotions.value.includes(emotion)) {
    selectedEmotions.value = selectedEmotions.value.filter(e => e !== emotion)
  } else {
    selectedEmotions.value = [...selectedEmotions.value, emotion]
  }
}

function handleSearch() {
  if (!searchQuery.value.trim()) {
    searchError.value = true
    setTimeout(() => { searchError.value = false }, 2500)
    return
  }
  searchError.value = false
  showSuggestions.value = false
  router.push({
    name: 'search',
    query: { q: searchQuery.value.trim(), emotions: selectedEmotions.value.join(',') }
  })
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (isLoggedIn.value) loadRecommendations()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.25s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(-4px); }

.dropdown-enter-active { transition: all 0.15s ease; }
.dropdown-leave-active { transition: all 0.1s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px); }

.greeting-fade-enter-active { transition: all 0.4s ease; }
.greeting-fade-enter-from { opacity: 0; transform: translateY(4px); }

.banner-slide-enter-active { animation: bannerIn 0.4s cubic-bezier(0.34, 1.2, 0.64, 1); }
.banner-slide-leave-active { animation: bannerOut 0.25s ease-in forwards; }

@keyframes bannerIn {
  from { opacity: 0; transform: translateY(-8px) scale(0.98); max-height: 0; }
  to   { opacity: 1; transform: translateY(0)    scale(1);    max-height: 200px; }
}
@keyframes bannerOut {
  from { opacity: 1; max-height: 200px; }
  to   { opacity: 0; max-height: 0; }
}

.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
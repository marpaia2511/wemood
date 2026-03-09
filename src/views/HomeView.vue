<template>
  <div class="min-h-screen flex flex-col">

    <!-- Top Bar -->
    <div class="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6">

      <!-- Logo -->
      <div class="text-xl sm:text-2xl text-gray-800 font-quicksand font-semibold">
        WeMood
      </div>

      <!-- Rechte Seite -->
      <div class="flex items-center gap-2 sm:gap-3">

        <!-- Notfall-Hilfe Button -->
        <button
          @click="$emit('openEmergency')"
          :class="[
            'relative px-3 sm:px-6 py-2 text-white text-sm sm:text-base rounded-full transition-all duration-500 overflow-visible',
            sensitiveDetected
              ? 'bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.25)] scale-105'
              : 'bg-red-500 hover:bg-red-600'
          ]"
        >
          <span v-if="sensitiveDetected" class="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-60 pointer-events-none" />
          <span class="relative">Notfall-Hilfe</span>
        </button>

        <!-- Logged in: avatar button → account page -->
        <router-link
          v-if="isLoggedIn"
          to="/account"
          class="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors shrink-0"
          :title="currentUser?.name"
        >
          <span class="text-sm sm:text-base font-bold text-white font-quicksand">
            {{ currentUser?.avatar }}
          </span>
        </router-link>

        <!-- Not logged in: login button -->
        <router-link
          v-else
          to="/login"
          class="px-3 sm:px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm sm:text-base rounded-full transition-colors font-medium"
        >
          Anmelden
        </router-link>

        <!-- Einstellungen -->
        <router-link
          to="/settings"
          class="p-2 sm:p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
        >
          <SettingsIcon class="w-5 h-5 text-gray-700" />
        </router-link>
      </div>
    </div>

    <!-- Sensitive Topic Banner -->
    <Transition name="banner-slide">
      <div v-if="sensitiveDetected" class="mx-4 sm:mx-8 mb-2 overflow-hidden">
        <div
          class="relative flex items-center gap-3 sm:gap-4 bg-red-50 border border-red-100 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 cursor-pointer group"
          @click="$emit('openEmergency')"
        >
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

    <!-- Zentrum -->
    <div class="flex-1 flex flex-col items-center justify-center px-4 sm:px-6">
      <div class="w-full max-w-3xl">

        <!-- Greeting / Logo -->
        <div class="text-center mb-8 sm:mb-12">
          <h1 class="text-5xl sm:text-7xl md:text-8xl font-quicksand font-bold text-gray-800">
            WeMood
          </h1>
          <Transition name="greeting-fade">
            <p v-if="isLoggedIn" class="text-gray-500 mt-3 text-base sm:text-lg">
              Hallo, <span class="font-semibold text-gray-700">{{ currentUser?.name }}</span> 👋
            </p>
          </Transition>
        </div>

        <!-- Suchleiste -->
        <form @submit.prevent="handleSearch" class="mb-6 sm:mb-8">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Suche nach Themen..."
              :class="[
                'w-full bg-white border rounded-full px-6 sm:px-8 py-3 sm:py-5 pr-28 sm:pr-32 text-base sm:text-lg placeholder:text-gray-400 text-gray-800 outline-none transition-all duration-300',
                searchError
                  ? 'border-orange-300 shadow-[0_0_0_3px_rgba(251,146,60,0.15)] focus:border-orange-400'
                  : sensitiveDetected
                    ? 'border-red-300 shadow-[0_0_0_3px_rgba(239,68,68,0.12)] focus:border-red-400'
                    : 'border-gray-300 focus:border-gray-500 focus:shadow-md'
              ]"
            />
            <button
              type="submit"
              class="absolute right-2 top-1/2 -translate-y-1/2 px-4 sm:px-8 py-2 sm:py-3 bg-gray-700 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2 text-white text-sm sm:text-base"
            >
              <SearchIcon class="w-4 h-4 sm:w-5 sm:h-5" />
              <span class="hidden sm:inline">Suchen</span>
            </button>
          </div>
          <Transition name="fade-slide">
            <p v-if="searchError" class="text-sm text-orange-500 mt-2 ml-4">
              Bitte gib etwas ein, bevor du suchst 🔍
            </p>
          </Transition>
        </form>

        <!-- Emotion Filter Tags -->
        <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 sm:mb-16">
          <button
            v-for="emotion in emotions"
            :key="emotion.value"
            @click="toggleEmotion(emotion.value)"
            :class="[
              'px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border transition-colors text-sm sm:text-base',
              selectedEmotions.includes(emotion.value)
                ? 'bg-gray-700 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
            ]"
          >
            {{ emotion.label }}
          </button>
        </div>

        <!-- Bibliothek Button -->
        <div class="flex flex-col items-center gap-3 sm:gap-4">
          <router-link
            to="/library"
            class="px-8 sm:px-12 py-3 sm:py-4 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
          >
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
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search as SearchIcon, Settings as SettingsIcon, ChevronDown as ChevronDownIcon, X as XIcon } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { currentUser, isLoggedIn } = useAuth()

defineEmits(['openEmergency'])

const searchQuery = ref('')
const searchError = ref(false)
const selectedEmotions = ref([])
const bannerDismissed = ref(false)

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

watch(searchQuery, (newVal, oldVal) => {
  if (newVal.toLowerCase().trim() !== oldVal.toLowerCase().trim()) {
    bannerDismissed.value = false
  }
})

function dismissBanner() { bannerDismissed.value = true }

const emotions = [
  { label: 'Fear', value: 'fear' },
  { label: 'Sadness', value: 'sadness' },
  { label: 'Happiness', value: 'happiness' },
  { label: 'Stress', value: 'stress' },
  { label: 'Energy', value: 'energy' },
  { label: 'Calm', value: 'calm' }
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
  router.push({
    name: 'search',
    query: { q: searchQuery.value.trim(), emotions: selectedEmotions.value.join(',') }
  })
}
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.25s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(-4px); }

.banner-slide-enter-active { animation: bannerIn 0.4s cubic-bezier(0.34, 1.2, 0.64, 1); }
.banner-slide-leave-active { animation: bannerOut 0.25s ease-in forwards; }

@keyframes bannerIn {
  from { opacity: 0; transform: translateY(-8px) scale(0.98); max-height: 0; }
  to   { opacity: 1; transform: translateY(0) scale(1);       max-height: 120px; }
}
@keyframes bannerOut {
  from { opacity: 1; transform: translateY(0) scale(1);        max-height: 120px; }
  to   { opacity: 0; transform: translateY(-6px) scale(0.98);  max-height: 0; }
}

.greeting-fade-enter-active, .greeting-fade-leave-active { transition: all 0.4s ease; }
.greeting-fade-enter-from, .greeting-fade-leave-to { opacity: 0; transform: translateY(6px); }
</style>
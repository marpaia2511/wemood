<template>
  <div class="min-h-screen flex flex-col">

    <!-- Top Bar -->
    <div class="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6">

      <!-- Logo oben links -->
      <div class="text-xl sm:text-2xl text-gray-800 font-quicksand font-semibold">
        WeMood
      </div>

      <!-- Rechte Seite: Notfall-Button & Einstellungen -->
      <div class="flex items-center gap-2 sm:gap-4">

        <!-- Notfall-Hilfe Button (nicht funktional) -->
        <button
            class="px-3 sm:px-6 py-2 bg-red-500 text-white text-sm sm:text-base rounded-full hover:bg-red-600 transition-colors"
        >
          NotWfall-Hilfe
        </button>

        <!-- Einstellungen Icon (noch nicht funktional) -->
        <button
            class="p-2 sm:p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
        >
          <SettingsIcon class="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>

    <!-- Zentrum: Logo + Suchleiste + Emotions + Bibliothek -->
    <div class="flex-1 flex flex-col items-center justify-center px-4 sm:px-6">
      <div class="w-full max-w-3xl">

        <!-- Großes Logo -->
        <div class="text-center mb-8 sm:mb-12">
          <h1 class="text-5xl sm:text-7xl md:text-8xl font-quicksand font-bold text-gray-800">
            WeMood
          </h1>
        </div>

        <!-- Suchleiste -->
        <form @submit.prevent="handleSearch" class="mb-6 sm:mb-8">
          <div class="relative">
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Suche nach Themen..."
                class="w-full bg-white border border-gray-300 rounded-full px-6 sm:px-8 py-3 sm:py-5 pr-28 sm:pr-32 text-base sm:text-lg placeholder:text-gray-400 text-gray-800 outline-none transition-all focus:border-gray-500 focus:shadow-md"
            />
            <button
                type="submit"
                class="absolute right-2 top-1/2 -translate-y-1/2 px-4 sm:px-8 py-2 sm:py-3 bg-gray-700 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2 text-white text-sm sm:text-base"
            >
              <SearchIcon class="w-4 h-4 sm:w-5 sm:h-5" />
              <span class="hidden sm:inline">Suchen</span>
            </button>
          </div>
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

          <!-- Pfeil nach unten -->
          <router-link to="/library" class="bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition-colors">
            <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search as SearchIcon, Settings as SettingsIcon, ChevronDown as ChevronDownIcon } from 'lucide-vue-next'

const searchQuery = ref('')
const selectedEmotions = ref([])

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
  // Noch nicht funktional - wird in Commit 3 implementiert
  console.log('Suche:', searchQuery.value, 'Emotionen:', selectedEmotions.value)
}
</script>
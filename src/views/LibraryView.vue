<template>
  <div class="min-h-screen px-4 md:px-8 py-6 sm:py-8">

    <!-- Home Navigation -->
    <div class="flex justify-center mb-6 sm:mb-8">
      <router-link
          to="/"
          class="flex flex-col items-center gap-1 group transition-opacity hover:opacity-85"
      >
        <ChevronUpIcon class="nav-icon-dark w-10 h-10 sm:w-12 sm:h-12 text-white/90 stroke-[2.5] group-hover:text-white transition-colors" />
        <span class="nav-label-dark text-3xl sm:text-4xl font-quicksand text-white font-bold group-hover:text-white transition-colors">
          Home
        </span>
      </router-link>
    </div>

    <!-- Suchleiste -->
    <div class="max-w-3xl mx-auto mb-8 sm:mb-10">
      <div class="relative">
        <SearchIcon class="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Durchsuche die Bibliothek..."
            class="w-full glass rounded-full pl-14 sm:pl-16 pr-6 sm:pr-8 py-3 sm:py-4
                 text-base sm:text-lg placeholder:text-gray-400/70 text-gray-800 font-semibold
                 outline-none transition-all focus:bg-white/30 focus:shadow-lg"
        />
      </div>
    </div>

    <!-- Titel -->
    <div class="text-center mb-8 sm:mb-12">
      <div class="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        <SparklesIcon class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-quicksand font-bold text-gray-800 nav-label">
          Deine Reise beginnt hier
        </h1>
        <SparklesIcon class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
      </div>
      <p class="text-base sm:text-lg text-gray-500 nav-label">Entdecke Inhalte für dein Wohlbefinden</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-3">
      <LoaderIcon class="w-8 h-8 text-gray-400 animate-spin" />
      <p class="text-gray-400 text-sm nav-label-dark">Artikel werden geladen…</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="max-w-md mx-auto text-center py-20">
      <div class="w-14 h-14 glass rounded-2xl flex items-center justify-center mx-auto mb-4">
        <AlertCircleIcon class="w-7 h-7 text-red-400" />
      </div>
      <p class="text-gray-700 font-medium mb-2 nav-label-dark">Artikel konnten nicht geladen werden</p>
      <p class="text-gray-500 text-sm mb-6 nav-label-dark">{{ error }}</p>
      <button @click="load" class="px-6 py-2.5 glass hover:bg-white/30 text-gray-800 font-bold rounded-full text-sm transition-all nav-label">
        Erneut versuchen
      </button>
    </div>

    <!-- Empty -->
    <div v-else-if="filteredItems.length === 0" class="text-center py-20">
      <p class="text-gray-500 nav-label-dark">Keine Artikel gefunden für „{{ searchQuery }}"</p>
    </div>

    <!-- Grid -->
    <div v-else class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-12">
        <router-link
            v-for="(item, index) in filteredItems"
            :key="item.id"
            :to="'/article/' + item.id"
            class="transform hover:scale-105 transition-all duration-300"
            :style="{ animationDelay: index * 0.1 + 's' }"
        >
          <div class="group glass rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-lg hover:bg-white/25 transition-all cursor-pointer h-full">

            <!-- Emoji Bereich -->
            <div class="relative h-40 sm:h-48 bg-white/15 flex items-center justify-center overflow-hidden">
              <div class="text-5xl sm:text-7xl group-hover:scale-110 transition-transform duration-300">
                {{ item.emoji }}
              </div>
              <div class="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 sm:p-2.5 bg-violet-600 rounded-full text-white">
                <FileTextIcon class="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div class="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 px-3 sm:px-4 py-1.5 sm:py-2 glass-subtle rounded-full text-xs sm:text-sm text-gray-600">
                {{ item.readTime }}
              </div>
            </div>

            <!-- Inhalt -->
            <div class="p-4 sm:p-6">
              <h3 class="text-lg sm:text-xl mb-1 sm:mb-2 font-quicksand font-bold text-gray-800 nav-label">
                {{ item.title }}
              </h3>
              <p class="text-gray-500 mb-3 sm:mb-4 text-xs sm:text-sm">{{ item.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-xs sm:text-sm text-gray-600 font-medium">Artikel</span>
                <span class="text-gray-600 group-hover:translate-x-2 transition-transform text-xs sm:text-sm">
                  Entdecken →
                </span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  ChevronUp as ChevronUpIcon,
  Search as SearchIcon,
  Sparkles as SparklesIcon,
  FileText as FileTextIcon,
  Loader as LoaderIcon,
  AlertCircle as AlertCircleIcon,
} from 'lucide-vue-next'
import { getAllArticles } from '../services/api.js'

const searchQuery = ref('')
const articles    = ref([])
const loading     = ref(true)
const error       = ref(null)

async function load() {
  loading.value = true
  error.value   = null
  try {
    articles.value = await getAllArticles()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(load)

const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) return articles.value
  const q = searchQuery.value.toLowerCase()
  return articles.value.filter(
    item => item.title?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q)
  )
})
</script>

<style scoped>
.nav-label-dark {
  text-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 0 8px rgba(0,0,0,0.15);
}
.nav-label {
  text-shadow: 0 1px 4px rgba(255,255,255,0.6), 0 0 12px rgba(255,255,255,0.4);
}
.nav-icon-dark {
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.3));
}
</style>
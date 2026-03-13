<template>
  <!--
    LibrarySection.vue – Wiederverwendbare Bibliothek-Komponente.
    Wird sowohl in HomeView (als Scroll-Sektion) als auch in LibraryView (als eigene Seite) verwendet.

    Quellen:
    - Tailwind CSS Grid: https://tailwindcss.com/docs/grid-template-columns
    - Vue 3 computed(): https://vuejs.org/guide/essentials/computed.html
    - Vue 3 onMounted(): https://vuejs.org/api/composition-api-lifecycle.html
    - Lucide Vue Next: https://lucide.dev/guide/packages/lucide-vue-next
  -->
  <div>
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
                 outline-none transition-all
                 focus:bg-white/30 focus:shadow-lg"
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
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Artikel werden geladen...</p>
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
          <div class="group glass
                      rounded-2xl sm:rounded-3xl overflow-hidden
                      hover:shadow-lg hover:bg-white/25 transition-all cursor-pointer h-full">

            <!-- Icon Bereich -->
            <div class="relative h-40 sm:h-48 bg-white/15 flex items-center justify-center overflow-hidden">
              <div class="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 sm:p-2.5 bg-violet-600 rounded-full text-white">
                <FileTextIcon class="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div class="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 px-3 sm:px-4 py-1.5 sm:py-2
                          glass-subtle rounded-full
                          text-xs sm:text-sm text-gray-600">
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
  Search as SearchIcon,
  Sparkles as SparklesIcon,
  FileText as FileTextIcon
} from 'lucide-vue-next'
import { getAllArticles } from '../services/api.js'

const searchQuery = ref('')
const articles = ref([])
const loading = ref(true)

onMounted(async () => {
  articles.value = await getAllArticles()
  loading.value = false
})

const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) return articles.value
  const q = searchQuery.value.toLowerCase()
  return articles.value.filter(
      item => item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
  )
})
</script>

<style scoped>
.nav-label {
  text-shadow:
      0 1px 4px rgba(255, 255, 255, 0.6),
      0 0 12px rgba(255, 255, 255, 0.4);
}
</style>
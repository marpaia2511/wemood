<template>
  <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
    <div class="w-full max-w-4xl">

      <!-- Zurück -->
      <router-link
          to="/"
          class="mb-6 sm:mb-8 inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 glass rounded-full hover:bg-white/30 transition-all"
      >
        <ArrowLeftIcon class="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        <span class="text-sm sm:text-base text-gray-700 font-semibold nav-label">Zurück</span>
      </router-link>

      <!-- Loading -->
      <div v-if="loading" class="glass rounded-2xl sm:rounded-3xl p-6 sm:p-12">
        <div class="flex flex-col items-center gap-3 py-8">
          <LoaderIcon class="w-8 h-8 text-gray-500 animate-spin" />
          <p class="text-gray-500 text-sm nav-label-dark">KI analysiert deine Anfrage…</p>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="glass rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center">
        <div class="w-14 h-14 glass-subtle rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircleIcon class="w-7 h-7 text-red-400" />
        </div>
        <p class="text-gray-700 font-medium mb-2 nav-label-dark">Suche fehlgeschlagen</p>
        <p class="text-gray-500 text-sm mb-6 nav-label-dark">{{ error }}</p>
        <button @click="doSearch" class="px-6 py-2.5 glass hover:bg-white/30 text-gray-800 font-bold rounded-full text-sm transition-all nav-label">
          Erneut suchen
        </button>
      </div>

      <template v-else>

        <!-- Emergency resources banner -->
        <Transition name="banner-slide">
          <div v-if="emergencyResources" class="mb-4">
            <div class="bg-red-100/60 border border-red-200/50 backdrop-blur-sm rounded-2xl p-5 sm:p-6">
              <div class="flex items-start gap-3 mb-4">
                <span class="relative flex h-3 w-3 mt-1 shrink-0">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                </span>
                <p class="font-semibold text-red-700 text-sm sm:text-base leading-snug">
                  {{ emergencyResources.message }}
                </p>
              </div>

              <!-- Hotlines -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                <a
                  v-for="h in emergencyResources.hotlines"
                  :key="h.number"
                  :href="'tel:' + h.number.replace(/\s/g, '')"
                  class="flex items-center gap-3 glass rounded-xl p-3 hover:bg-white/25 transition-colors"
                >
                  <div class="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center shrink-0">
                    <PhoneIcon class="w-4 h-4 text-white" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-bold text-gray-800 leading-tight nav-label-dark">{{ h.number }}</p>
                    <p class="text-xs text-gray-600 truncate nav-label-dark">{{ h.name }}</p>
                    <p class="text-xs text-gray-500 truncate nav-label-dark">{{ h.description }}</p>
                  </div>
                </a>
              </div>

              <!-- Online help links -->
              <div class="flex flex-wrap gap-2">
                <a
                  v-for="o in emergencyResources.online_help"
                  :key="o.url"
                  :href="o.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-xs px-3 py-1.5 glass rounded-full text-red-600 hover:bg-white/25 transition-colors"
                >
                  {{ o.name }} →
                </a>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Results panel -->
        <div class="glass-strong rounded-2xl sm:rounded-3xl p-6 sm:p-12">

          <div class="mb-8 sm:mb-10 text-center">
            <h2 class="text-2xl sm:text-3xl mb-4 sm:mb-6 font-quicksand font-bold text-gray-800 nav-label">
              Deine Analyse
            </h2>
            <p class="text-base sm:text-xl text-gray-600 leading-relaxed nav-label-dark">
              Basierend auf deiner Suche nach
              <span class="font-semibold text-gray-800">„{{ searchQueryText }}"</span>
              haben wir folgende Themen erkannt:
            </p>
          </div>

          <!-- No results -->
          <div v-if="searchResults.length === 0" class="text-center py-8">
            <p class="text-gray-500 mb-2 nav-label-dark">Keine Artikel gefunden.</p>
            <p class="text-sm text-gray-400 nav-label-dark">Versuche einen anderen Suchbegriff.</p>
          </div>

          <!-- Result cards -->
          <div v-else class="space-y-4 sm:space-y-6">
            <h3 class="text-lg sm:text-xl text-gray-700 mb-3 sm:mb-4 nav-label-dark">Relevante Themen für dich:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <router-link
                  v-for="result in searchResults"
                  :key="result.id"
                  :to="'/article/' + result.id"
                  class="group glass rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/25 transition-all text-left"
              >
                <div class="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl glass-subtle flex items-center justify-center text-2xl sm:text-3xl shrink-0">
                    {{ result.emoji }}
                  </div>
                  <div>
                    <h4 class="text-xl sm:text-2xl font-quicksand font-bold text-gray-800 nav-label">
                      {{ result.title }}
                    </h4>
                    <span v-if="result.confidence" class="text-xs sm:text-sm text-gray-500 nav-label-dark">
                      {{ result.confidence }}% Übereinstimmung
                    </span>
                  </div>
                </div>
                <p class="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3 nav-label-dark">
                  {{ result.description }}
                </p>
                <div class="mt-3 sm:mt-4 text-gray-600 group-hover:translate-x-2 transition-transform text-sm nav-label-dark">
                  Mehr erfahren →
                </div>
              </router-link>
            </div>
          </div>

          <div class="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/20">
            <router-link
                to="/library"
                class="block w-full py-3 sm:py-4 glass hover:bg-white/30 rounded-full text-gray-700 font-bold text-base sm:text-lg text-center transition-all nav-label"
            >
              Zur Bibliothek für weitere Ressourcen
            </router-link>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft as ArrowLeftIcon,
  Loader as LoaderIcon,
  AlertCircle as AlertCircleIcon,
  Phone as PhoneIcon
} from 'lucide-vue-next'
import { searchArticles } from '../services/api.js'

const route              = useRoute()
const searchResults      = ref([])
const loading            = ref(true)
const error              = ref(null)
const searchQueryText    = ref('')
const emergencyResources = ref(null)

async function doSearch() {
  loading.value            = true
  error.value              = null
  emergencyResources.value = null
  try {
    searchResults.value      = await searchArticles(searchQueryText.value)
    emergencyResources.value = searchArticles.getEmergencyResources()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  searchQueryText.value = route.query.q || ''
  doSearch()
})
</script>

<style scoped>
.nav-label-dark { text-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 0 8px rgba(0,0,0,0.15); }
.nav-label { text-shadow: 0 1px 4px rgba(255,255,255,0.6), 0 0 12px rgba(255,255,255,0.4); }
.banner-slide-enter-active { animation: bannerIn 0.4s cubic-bezier(0.34, 1.1, 0.64, 1); }
.banner-slide-leave-active { animation: bannerOut 0.2s ease-in forwards; }
@keyframes bannerIn  { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes bannerOut { from { opacity: 1; } to { opacity: 0; } }
.line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
</style>
<template>
  <div class="min-h-screen px-4 sm:px-6 py-6 sm:py-10">

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center min-h-screen gap-3">
      <LoaderIcon class="w-8 h-8 text-gray-400 animate-spin" />
      <p class="text-gray-400 text-sm nav-label-dark">Artikel wird geladen…</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-screen gap-4 text-center">
      <div class="w-14 h-14 glass-subtle rounded-2xl flex items-center justify-center">
        <AlertCircleIcon class="w-7 h-7 text-red-400" />
      </div>
      <p class="text-gray-700 font-medium nav-label-dark">Artikel konnte nicht geladen werden</p>
      <p class="text-gray-500 text-sm nav-label-dark">{{ error }}</p>
      <button @click="goBack" class="px-6 py-2.5 glass hover:bg-white/30 text-gray-800 font-bold rounded-full text-sm transition-all nav-label">
        Zurück
      </button>
    </div>

    <template v-else>

      <!-- Top Bar -->
      <div class="flex items-center justify-between mb-6 sm:mb-8 max-w-5xl mx-auto">

        <!-- Zurück -->
        <button @click="goBack" class="flex flex-col items-center gap-1 group cursor-pointer">
          <ChevronUpIcon class="w-10 h-10 sm:w-12 sm:h-12 text-white/90 nav-icon-dark stroke-[1.2] group-hover:opacity-100" />
          <span class="text-xl sm:text-2xl font-quicksand text-white font-bold nav-label-dark group-hover:opacity-100 transition-opacity">
            Zurück
          </span>
        </button>

        <!-- Favorite button -->
        <button
            @click="toggleFavorite"
            :disabled="favLoading"
            class="p-2.5 sm:p-3 glass rounded-full transition-all"
            :class="favorited ? 'bg-red-400/20 border-red-300/50' : 'hover:bg-white/25'"
            :title="favorited ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'"
        >
          <HeartIcon
            class="w-5 h-5 sm:w-6 sm:h-6 transition-all"
            :class="favorited ? 'fill-red-500 text-red-500' : 'text-gray-500'"
          />
        </button>
      </div>

      <!-- Progress dots -->
      <div class="flex items-center justify-center gap-3 mb-6 sm:mb-8 max-w-5xl mx-auto">
        <button
            v-for="(screen, index) in screens"
            :key="index"
            @click="scrollToScreen(index)"
            class="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-sm font-medium"
            :class="currentScreen === index
              ? 'glass text-violet-800'
              : 'text-violet-400 hover:text-violet-600'"
        >
          <span>{{ screen }}</span>
          <div
              class="w-1.5 h-1.5 rounded-full transition-colors"
              :class="currentScreen === index ? 'bg-violet-600' : 'bg-violet-300'"
          />
        </button>
      </div>

      <!-- Card scroll container -->
      <div class="max-w-5xl mx-auto">
        <div
            ref="scrollContainer"
            @scroll="onScroll"
            class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-6"
            style="-webkit-overflow-scrolling: touch; scrollbar-width: none;"
        >

          <!-- Card 1: Überblick -->
          <div class="snap-center flex-shrink-0 w-full">
            <div class="glass-strong rounded-2xl sm:rounded-3xl p-6 sm:p-10">

              <div class="text-center mb-6 sm:mb-8">
                <div class="text-5xl sm:text-7xl mb-4">{{ article.emoji }}</div>
                <h2 class="text-2xl sm:text-3xl font-quicksand font-semibold text-violet-800 mb-2">
                  {{ article.title }}
                </h2>
              </div>

              <div class="mb-6 sm:mb-8">
                <h3 class="text-lg sm:text-xl font-quicksand font-semibold text-violet-800 mb-3">Überblick</h3>
                <p class="text-sm sm:text-base text-violet-600 leading-relaxed">{{ article.overview }}</p>
              </div>

              <div class="mb-6 sm:mb-8" v-if="article.facts?.length">
                <h3 class="text-lg sm:text-xl font-quicksand font-semibold text-violet-800 mb-3">Wichtige Fakten</h3>
                <div class="space-y-3">
                  <div v-for="(fact, index) in article.facts" :key="index" class="flex items-start gap-3">
                    <div class="w-7 h-7 glass-subtle rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span class="text-xs font-semibold text-gray-700">{{ index + 1 }}</span>
                    </div>
                    <p class="text-sm sm:text-base text-violet-600 leading-relaxed">{{ fact }}</p>
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <button @click="scrollToScreen(1)" class="nav-btn">
                  <span class="text-sm text-gray-700">Literatur & Vorschläge</span>
                  <ChevronRightIcon class="w-4 h-4 text-violet-500" />
                </button>
              </div>
            </div>
          </div>

          <!-- Card 2: Literatur -->
          <div class="snap-center flex-shrink-0 w-full">
            <div class="glass-strong rounded-2xl sm:rounded-3xl p-6 sm:p-10">

              <div class="text-center mb-6 sm:mb-8">
                <BookOpenIcon class="w-10 h-10 text-violet-400 mx-auto mb-3" />
                <h2 class="text-2xl sm:text-3xl font-quicksand font-semibold text-gray-800 nav-label">
                  Literatur & Vorschläge
                </h2>
              </div>

              <div class="space-y-4 mb-6 sm:mb-8">
                <div v-for="(book, index) in article.literature" :key="index" class="glass-subtle rounded-xl sm:rounded-2xl p-4 sm:p-5">
                  <div class="flex items-start gap-3 sm:gap-4">
                    <div class="w-10 h-10 glass-subtle rounded-xl flex items-center justify-center shrink-0">
                      <BookOpenIcon class="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <h4 class="text-sm sm:text-base font-semibold text-violet-800 mb-0.5">{{ book.title }}</h4>
                      <p class="text-xs sm:text-sm text-violet-500 mb-1">{{ book.author }}</p>
                      <p class="text-xs sm:text-sm text-violet-600 leading-relaxed">{{ book.description }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-between">
                <button @click="scrollToScreen(0)" class="nav-btn">
                  <ChevronLeftIcon class="w-4 h-4 text-violet-500" />
                  <span class="text-sm text-gray-700">Zurück</span>
                </button>
                <button @click="scrollToScreen(2)" class="nav-btn">
                  <span class="text-sm text-gray-700">Videos & Filme</span>
                  <ChevronRightIcon class="w-4 h-4 text-violet-500" />
                </button>
              </div>
            </div>
          </div>

          <!-- Card 3: Videos -->
          <div class="snap-center flex-shrink-0 w-full">
            <div class="glass-strong rounded-2xl sm:rounded-3xl p-6 sm:p-10">

              <div class="text-center mb-6 sm:mb-8">
                <PlayCircleIcon class="w-10 h-10 text-violet-400 mx-auto mb-3" />
                <h2 class="text-2xl sm:text-3xl font-quicksand font-semibold text-gray-800 nav-label">
                  Videos & Filme
                </h2>
              </div>

              <div class="space-y-4 mb-6 sm:mb-8">
                <div v-for="(video, index) in article.videos" :key="index" class="glass-subtle rounded-xl sm:rounded-2xl p-4 sm:p-5">
                  <div class="flex items-start gap-3 sm:gap-4">
                    <div class="w-10 h-10 glass-subtle rounded-xl flex items-center justify-center shrink-0">
                      <PlayCircleIcon class="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <h4 class="text-sm sm:text-base font-semibold text-violet-800 mb-0.5">{{ video.title }}</h4>
                      <p class="text-xs sm:text-sm text-violet-500 mb-1">{{ video.duration }}</p>
                      <p class="text-xs sm:text-sm text-violet-600 leading-relaxed">{{ video.description }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-between">
                <button @click="scrollToScreen(1)" class="nav-btn">
                  <ChevronLeftIcon class="w-4 h-4 text-violet-500" />
                  <span class="text-sm text-gray-700">Zurück</span>
                </button>
                <button @click="scrollToScreen(3)" class="nav-btn">
                  <span class="text-sm text-gray-700">Fazit</span>
                  <ChevronRightIcon class="w-4 h-4 text-violet-500" />
                </button>
              </div>
            </div>
          </div>

          <!-- Card 4: Fazit -->
          <div class="snap-center flex-shrink-0 w-full">
            <div class="glass-strong rounded-2xl sm:rounded-3xl p-6 sm:p-10">

              <div class="text-center mb-6 sm:mb-8">
                <CheckCircleIcon class="w-10 h-10 text-violet-400 mx-auto mb-3" />
                <h2 class="text-2xl sm:text-3xl font-quicksand font-semibold text-gray-800 nav-label">Fazit</h2>
              </div>

              <div class="mb-6 sm:mb-8">
                <p class="text-sm sm:text-base text-violet-600 leading-relaxed">{{ article.conclusion }}</p>
              </div>

              <div class="mb-6 sm:mb-8" v-if="article.takeaways?.length">
                <h3 class="text-lg sm:text-xl font-quicksand font-semibold text-violet-800 mb-3">Wichtigste Erkenntnisse</h3>
                <div class="space-y-3">
                  <div v-for="(takeaway, index) in article.takeaways" :key="index" class="flex items-start gap-3">
                    <CheckCircleIcon class="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    <p class="text-sm sm:text-base text-gray-700">{{ takeaway }}</p>
                  </div>
                </div>
              </div>

              <div class="flex justify-between">
                <button @click="scrollToScreen(2)" class="nav-btn">
                  <ChevronLeftIcon class="w-4 h-4 text-violet-500" />
                  <span class="text-sm text-gray-700">Zurück</span>
                </button>
                <button
                    @click="goBack"
                    class="flex items-center gap-2 px-5 py-2.5 bg-violet-600/90 text-white rounded-full hover:bg-violet-600 transition-colors"
                >
                  <CheckCircleIcon class="w-4 h-4" />
                  <span class="text-sm font-semibold">Fertig</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ChevronUp as ChevronUpIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  BookOpen as BookOpenIcon,
  PlayCircle as PlayCircleIcon,
  CheckCircle as CheckCircleIcon,
  Heart as HeartIcon,
  Loader as LoaderIcon,
  AlertCircle as AlertCircleIcon,
} from 'lucide-vue-next'
import { getArticleById, trackArticleView, addFavorite, removeFavorite, isFavorited } from '../services/api.js'

const route   = useRoute()
const router  = useRouter()

const screens       = ['Überblick', 'Literatur', 'Videos', 'Fazit']
const currentScreen = ref(0)
const loading       = ref(true)
const error         = ref(null)
const article       = ref({})
const favorited     = ref(false)
const favLoading    = ref(false)
const scrollContainer = ref(null)

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    article.value = await getArticleById(id)
    if (!article.value) throw new Error('Artikel nicht gefunden.')
    trackArticleView({ articleId: id, articleTitle: article.value.title, articleEmoji: article.value.emoji }).catch(() => {})
    isFavorited(id).then(v => { favorited.value = v }).catch(() => {})
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

async function toggleFavorite() {
  if (favLoading.value) return
  favLoading.value = true
  try {
    if (favorited.value) {
      await removeFavorite(article.value.id)
      favorited.value = false
    } else {
      await addFavorite({ articleId: article.value.id, articleTitle: article.value.title, articleEmoji: article.value.emoji })
      favorited.value = true
    }
  } catch (e) {
    console.warn('Favorite toggle failed:', e.message)
  } finally {
    favLoading.value = false
  }
}

function onScroll() {
  const container   = scrollContainer.value
  const screenWidth = container.clientWidth
  currentScreen.value = Math.round(container.scrollLeft / screenWidth)
}

function scrollToScreen(index) {
  if (!scrollContainer.value) return
  scrollContainer.value.scrollTo({
    left: index * scrollContainer.value.clientWidth,
    behavior: 'smooth'
  })
}

function goBack() { router.back() }
</script>

<style scoped>
.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 9999px;
  transition: all 0.2s;
}
.nav-btn:hover { background: rgba(255, 255, 255, 0.3); }

.nav-label-dark { text-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 0 8px rgba(0,0,0,0.15); }
.nav-label      { text-shadow: 0 1px 4px rgba(255,255,255,0.6), 0 0 12px rgba(255,255,255,0.4); }
.nav-icon-dark  { filter: drop-shadow(0 1px 3px rgba(0,0,0,0.3)); }

div::-webkit-scrollbar { display: none; }
</style>
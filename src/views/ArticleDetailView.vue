<template>
  <div class="min-h-screen px-4 sm:px-6 py-6 sm:py-10">

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center min-h-screen gap-3">
      <LoaderIcon class="w-8 h-8 text-gray-400 animate-spin" />
      <p class="text-gray-400 text-sm">Artikel wird geladen…</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-screen gap-4 text-center">
      <div class="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
        <AlertCircleIcon class="w-7 h-7 text-red-400" />
      </div>
      <p class="text-gray-600 font-medium">Artikel konnte nicht geladen werden</p>
      <p class="text-gray-400 text-sm">{{ error }}</p>
      <button @click="goBack" class="px-6 py-2.5 bg-gray-800 text-white rounded-full text-sm hover:bg-gray-900 transition-colors">
        Zurück
      </button>
    </div>

    <template v-else>

      <!-- Top Bar -->
      <div class="flex items-center justify-between mb-6 sm:mb-8 max-w-5xl mx-auto">
        <button
            @click="goBack"
            class="flex items-center gap-3 px-6 sm:px-8 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
        >
          <div class="bg-gray-100 border border-gray-200 rounded-full p-1.5 sm:p-2">
            <ChevronUpIcon class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </div>
          <span class="text-base sm:text-lg text-gray-700">Zurück</span>
        </button>
        <button
            @click="toggleFavorite"
            :disabled="favLoading"
            class="p-2.5 sm:p-3 bg-white border rounded-full transition-all"
            :class="favorited ? 'border-red-300 hover:bg-red-50' : 'border-gray-300 hover:bg-gray-100'"
            :title="favorited ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'"
        >
          <HeartIcon class="w-5 h-5 sm:w-6 sm:h-6 transition-all" :class="favorited ? 'fill-red-500 text-red-500' : 'text-gray-500'" />
        </button>
      </div>

      <!-- Progress dots -->
      <div class="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <button
            v-for="(screen, index) in screens"
            :key="index"
            @click="scrollToScreen(index)"
            class="flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full transition-all duration-300"
            :class="currentScreen === index
              ? 'bg-white border border-gray-300 text-gray-800'
              : 'text-gray-400 hover:text-gray-600'"
        >
          <div
              class="w-2 h-2 rounded-full transition-all duration-300"
              :class="currentScreen === index ? 'bg-gray-700' : 'bg-gray-300'"
          ></div>
          <span class="text-xs sm:text-sm">{{ screen }}</span>
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
          <div class="w-full flex-shrink-0 snap-center">
            <div class="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-10">
              <div class="text-center mb-6 sm:mb-8">
                <div class="text-4xl sm:text-5xl mb-3">{{ article.emoji }}</div>
                <h2 class="text-2xl sm:text-3xl font-quicksand font-semibold text-gray-800 mb-2">
                  {{ article.title }}
                </h2>
                <p class="text-sm text-gray-400">{{ article.readTime }}</p>
              </div>
              <div class="mb-6 sm:mb-8">
                <h3 class="text-lg sm:text-xl font-quicksand font-semibold text-gray-800 mb-3">Überblick</h3>
                <p class="text-sm sm:text-base text-gray-600 leading-relaxed">{{ article.overview }}</p>
              </div>
              <div class="mb-6 sm:mb-8" v-if="article.facts?.length">
                <h3 class="text-lg sm:text-xl font-quicksand font-semibold text-gray-800 mb-3">Wichtige Fakten</h3>
                <div class="space-y-3">
                  <div v-for="(fact, index) in article.facts" :key="index" class="flex items-start gap-3">
                    <div class="w-7 h-7 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span class="text-xs font-semibold text-gray-600">{{ index + 1 }}</span>
                    </div>
                    <p class="text-sm sm:text-base text-gray-600 leading-relaxed">{{ fact }}</p>
                  </div>
                </div>
              </div>
              <div class="flex justify-center">
                <button @click="scrollToScreen(1)" class="flex items-center gap-2 px-5 py-2.5 bg-gray-100 border border-gray-200 rounded-full hover:bg-gray-200 transition-colors">
                  <span class="text-sm text-gray-600">Literatur & Vorschläge</span>
                  <ChevronRightIcon class="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          <!-- Card 2: Literatur -->
          <div class="w-full flex-shrink-0 snap-center">
            <div class="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-10">
              <div class="text-center mb-6 sm:mb-8">
                <BookOpenIcon class="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h2 class="text-2xl sm:text-3xl font-quicksand font-semibold text-gray-800">
                  Literatur & Vorschläge
                </h2>
              </div>
              <div class="space-y-4 mb-6 sm:mb-8">
                <div v-for="(book, index) in article.literature" :key="index" class="bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-5">
                  <div class="flex items-start gap-3">
                    <div class="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpenIcon class="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <h4 class="text-sm sm:text-base font-semibold text-gray-800 mb-0.5">{{ book.title }}</h4>
                      <p class="text-xs sm:text-sm text-gray-500 mb-1">{{ book.author }}</p>
                      <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">{{ book.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex justify-center">
                <button @click="scrollToScreen(2)" class="flex items-center gap-2 px-5 py-2.5 bg-gray-100 border border-gray-200 rounded-full hover:bg-gray-200 transition-colors">
                  <span class="text-sm text-gray-600">Videos & Filme</span>
                  <ChevronRightIcon class="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          <!-- Card 3: Videos -->
          <div class="w-full flex-shrink-0 snap-center">
            <div class="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-10">
              <div class="text-center mb-6 sm:mb-8">
                <PlayCircleIcon class="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h2 class="text-2xl sm:text-3xl font-quicksand font-semibold text-gray-800">
                  Videos & Filme
                </h2>
              </div>
              <div class="space-y-4 mb-6 sm:mb-8">
                <div v-for="(video, index) in article.videos" :key="index" class="bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-5">
                  <div class="flex items-start gap-3">
                    <div class="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <PlayCircleIcon class="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <h4 class="text-sm sm:text-base font-semibold text-gray-800 mb-0.5">{{ video.title }}</h4>
                      <p class="text-xs sm:text-sm text-gray-500 mb-1">{{ video.duration }}</p>
                      <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">{{ video.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex justify-center">
                <button @click="scrollToScreen(3)" class="flex items-center gap-2 px-5 py-2.5 bg-gray-100 border border-gray-200 rounded-full hover:bg-gray-200 transition-colors">
                  <span class="text-sm text-gray-600">Fazit</span>
                  <ChevronRightIcon class="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          <!-- Card 4: Fazit -->
          <div class="w-full flex-shrink-0 snap-center">
            <div class="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-10">
              <div class="text-center mb-6 sm:mb-8">
                <CheckCircleIcon class="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h2 class="text-2xl sm:text-3xl font-quicksand font-semibold text-gray-800">Fazit</h2>
              </div>
              <div class="mb-6 sm:mb-8">
                <p class="text-sm sm:text-base text-gray-600 leading-relaxed">{{ article.conclusion }}</p>
              </div>
              <div class="mb-6 sm:mb-8" v-if="article.takeaways?.length">
                <h3 class="text-lg sm:text-xl font-quicksand font-semibold text-gray-800 mb-3">Wichtigste Erkenntnisse</h3>
                <div class="space-y-3">
                  <div v-for="(takeaway, index) in article.takeaways" :key="index" class="flex items-start gap-3">
                    <CheckCircleIcon class="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p class="text-sm sm:text-base text-gray-600">{{ takeaway }}</p>
                  </div>
                </div>
              </div>
              <div class="flex justify-center">
                <button @click="goBack" class="flex items-center gap-2 px-5 py-2.5 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors">
                  <ArrowLeftIcon class="w-4 h-4" />
                  <span class="text-sm">Zurück</span>
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
  ArrowLeft as ArrowLeftIcon,
  ChevronUp as ChevronUpIcon,
  Heart as HeartIcon,
  ChevronRight as ChevronRightIcon,
  BookOpen as BookOpenIcon,
  PlayCircle as PlayCircleIcon,
  CheckCircle as CheckCircleIcon,
  Loader as LoaderIcon,
  AlertCircle as AlertCircleIcon
} from 'lucide-vue-next'
import { getArticleById, trackArticleView, addFavorite, removeFavorite, isFavorited } from '../services/api.js'

const route           = useRoute()
const router          = useRouter()
const scrollContainer = ref(null)
const currentScreen   = ref(0)
const loading         = ref(true)
const error           = ref(null)
const article         = ref({})
const favorited       = ref(false)
const favLoading      = ref(false)

const screens = ['Überblick', 'Literatur', 'Videos', 'Fazit']

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
  if (!scrollContainer.value) return
  const container  = scrollContainer.value
  const screenWidth = container.clientWidth
  currentScreen.value = Math.round(container.scrollLeft / screenWidth)
}

function scrollToScreen(index) {
  if (!scrollContainer.value) return
  scrollContainer.value.scrollTo({
    left: scrollContainer.value.clientWidth * index,
    behavior: 'smooth'
  })
}

function goBack() { router.back() }
</script>

<style scoped>
div::-webkit-scrollbar { display: none; }
</style>
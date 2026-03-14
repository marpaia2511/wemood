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

      <!-- AppHeader -->
      <AppHeader @open-emergency="$emit('openEmergency')" />

      <!-- Progress indicators -->
      <div class="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
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

      <!-- Favorite button -->
      <div class="flex justify-end mb-2 max-w-5xl mx-auto">
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

      <!-- Card scroll container -->
      <div class="max-w-5xl mx-auto">
        <div
            ref="scrollContainer"
            @scroll="onScroll"
            class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-6
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >

          <!-- Card 1: Überblick -->
          <div class="w-full flex-shrink-0 snap-center">
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
          <div class="w-full flex-shrink-0 snap-center">
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
          <div class="w-full flex-shrink-0 snap-center">
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
          <div class="w-full flex-shrink-0 snap-center">
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
                <button @click="scrollToScreen(4)" class="nav-btn">
                  <span class="text-sm text-gray-700">Bewertung</span>
                  <ChevronRightIcon class="w-4 h-4 text-violet-500" />
                </button>
              </div>
            </div>
          </div>

          <!-- Card 5: Bewertung -->
          <div class="w-full flex-shrink-0 snap-center">
            <div class="glass-strong rounded-2xl sm:rounded-3xl p-6 sm:p-10">

              <div class="text-center mb-6 sm:mb-8">
                <StarIcon class="w-10 h-10 text-violet-400 mx-auto mb-3" />
                <h2 class="text-2xl sm:text-3xl font-quicksand font-semibold text-gray-800 nav-label">
                  Artikel bewerten
                </h2>
                <p class="text-sm text-violet-500 mt-2">
                  Deine Bewertung hilft uns, die Qualität der Inhalte zu verbessern.
                </p>
              </div>

              <!-- Not logged in -->
              <div v-if="!isLoggedIn" class="flex flex-col items-center gap-4 py-6 text-center">
                <div class="w-14 h-14 glass-subtle rounded-2xl flex items-center justify-center">
                  <UserIcon class="w-7 h-7 text-violet-300" />
                </div>
                <p class="text-violet-600 text-sm leading-relaxed">
                  Melde dich an, um diesen Artikel zu bewerten.
                </p>
                <router-link to="/login" class="px-5 py-2.5 bg-violet-600/90 text-white rounded-full text-sm font-semibold hover:bg-violet-600 transition-colors">
                  Anmelden
                </router-link>
              </div>

              <!-- Logged in -->
              <div v-else>

                <!-- Overall average -->
                <div v-if="ratingSummary.count > 0" class="flex items-center justify-center gap-3 mb-6 glass-subtle rounded-2xl p-3">
                  <div class="flex items-center gap-1">
                    <StarIcon
                      v-for="s in 5" :key="s"
                      class="w-4 h-4"
                      :class="s <= Math.round(ratingSummary.average) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'"
                    />
                  </div>
                  <span class="text-sm font-semibold text-gray-700">{{ ratingSummary.average }}</span>
                  <span class="text-xs text-gray-500">({{ ratingSummary.count }} {{ ratingSummary.count === 1 ? 'Bewertung' : 'Bewertungen' }})</span>
                </div>

                <!-- Already rated -->
                <div v-if="existingRating" class="space-y-4">
                  <div class="glass-subtle rounded-2xl p-5">
                    <p class="text-xs text-gray-500 mb-2">Deine Bewertung</p>
                    <div class="flex items-center gap-1 mb-3">
                      <StarIcon
                        v-for="s in 5" :key="s"
                        class="w-6 h-6"
                        :class="s <= existingRating.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'"
                      />
                    </div>
                    <p v-if="existingRating.comment" class="text-sm text-violet-600 leading-relaxed italic">
                      „{{ existingRating.comment }}"
                    </p>
                    <p v-else class="text-xs text-gray-400">Kein Kommentar</p>
                  </div>
                  <button
                    @click="handleDeleteRating"
                    :disabled="ratingLoading"
                    class="w-full py-2.5 glass hover:bg-red-100/30 text-red-500 text-sm font-medium rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <LoaderIcon v-if="ratingLoading" class="w-4 h-4 animate-spin" />
                    <Trash2Icon v-else class="w-4 h-4" />
                    Bewertung löschen
                  </button>
                </div>

                <!-- New rating form -->
                <div v-else class="space-y-5">

                  <!-- Stars -->
                  <div>
                    <p class="text-sm font-medium text-gray-600 mb-3 text-center">
                      {{ ratingDraft === 0 ? 'Wie hilfreich war dieser Artikel?' : ratingLabels[ratingDraft - 1] }}
                    </p>
                    <div class="flex items-center justify-center gap-2">
                      <button
                        v-for="s in 5" :key="s"
                        @click="ratingDraft = s"
                        @mouseenter="ratingHover = s"
                        @mouseleave="ratingHover = 0"
                        class="transition-transform hover:scale-110 active:scale-95"
                      >
                        <StarIcon
                          class="w-9 h-9 transition-colors"
                          :class="s <= (ratingHover || ratingDraft) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'"
                        />
                      </button>
                    </div>
                  </div>

                  <!-- Optional comment -->
                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1.5">
                      Kommentar <span class="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      v-model="commentDraft"
                      placeholder="Was hat dir an diesem Artikel gefallen oder gefehlt?"
                      rows="3"
                      maxlength="500"
                      class="w-full glass-subtle rounded-2xl px-4 py-3 text-sm text-violet-700 placeholder:text-gray-400 outline-none focus:bg-white/30 transition-all resize-none"
                    />
                    <p class="text-xs text-gray-400 text-right mt-1">{{ commentDraft.length }}/500</p>
                  </div>

                  <!-- Error -->
                  <Transition name="fade-slide">
                    <p v-if="ratingError" class="text-xs text-red-500 ml-1">{{ ratingError }}</p>
                  </Transition>

                  <button
                    @click="handleSubmitRating"
                    :disabled="ratingLoading || ratingDraft === 0"
                    class="w-full py-3 bg-violet-600/90 hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <LoaderIcon v-if="ratingLoading" class="w-4 h-4 animate-spin" />
                    <StarIcon v-else class="w-4 h-4" />
                    Bewertung abschicken
                  </button>
                </div>

              </div>

              <!-- Nav -->
              <div class="flex justify-between mt-6">
                <button @click="scrollToScreen(3)" class="nav-btn">
                  <ChevronLeftIcon class="w-4 h-4 text-violet-500" />
                  <span class="text-sm text-gray-700">Zurück</span>
                </button>
                <button
                  @click="goBack"
                  class="flex items-center gap-2 px-5 py-2.5 bg-violet-600/90 text-white rounded-full hover:bg-violet-600 transition-colors"
                >
                  <ArrowLeftIcon class="w-4 h-4" />
                  <span class="text-sm">Fertig</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      <!-- Desktop: fixed left back button -->
      <button
          @click="goBack"
          class="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-40
                 flex-col items-center gap-1 group cursor-pointer"
      >
        <ChevronLeftIcon class="w-14 h-14 text-white/90 nav-icon-dark
                                stroke-[2.5] group-hover:opacity-100 transition-opacity" />
        <span class="text-sm font-quicksand text-white font-bold nav-label-dark
                     group-hover:opacity-100 transition-opacity">
          Zurück
        </span>
      </button>

      <!-- Mobile: inline back button -->
      <div class="lg:hidden mt-8 sm:mt-10 mb-4">
        <button @click="goBack" class="flex items-center gap-1.5 group cursor-pointer">
          <ChevronLeftIcon class="w-10 h-10 text-white/90 nav-icon-dark
                                  stroke-[2.5] group-hover:opacity-100 transition-opacity" />
          <span class="text-base font-quicksand text-white font-bold nav-label-dark
                       group-hover:opacity-100 transition-opacity">
            Zurück
          </span>
        </button>
      </div>

    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft    as ArrowLeftIcon,
  ChevronLeft  as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  BookOpen     as BookOpenIcon,
  PlayCircle   as PlayCircleIcon,
  CheckCircle  as CheckCircleIcon,
  Heart        as HeartIcon,
  Loader       as LoaderIcon,
  AlertCircle  as AlertCircleIcon,
  Star         as StarIcon,
  Trash2       as Trash2Icon,
  User         as UserIcon,
} from 'lucide-vue-next'
import {
  getArticleById, trackArticleView,
  addFavorite, removeFavorite, isFavorited,
  getMyArticleRating, upsertArticleRating,
  deleteMyArticleRating, getArticleRatingSummary,
} from '../services/api.js'
import { useAuth } from '../composables/useAuth.js'
import { useDynamicTheme } from '../composables/useDynamicTheme.js'
import AppHeader from '../components/AppHeader.vue'

defineEmits(['openEmergency'])

const route        = useRoute()
const router       = useRouter()
const currentTheme = inject('currentTheme')
const { isLoggedIn } = useAuth()
const { getRestoreTheme } = useDynamicTheme()

// ── Theme mapping ─────────────────────────────────────────────────────
function categoryToTheme(article) {
  const cat      = (article.category || '').toLowerCase()
  const tags     = (article.tags || []).join(' ').toLowerCase()
  const haystack = cat + ' ' + tags

  if (haystack.includes('depress'))                            return 'depression'
  if (haystack.includes('angst') || haystack.includes('anx')) return 'anxiety'
  if (haystack.includes('stress') || haystack.includes('anger') || haystack.includes('wut')) return 'anger'
  if (haystack.includes('schlaf') || haystack.includes('sleep'))                             return 'sleep'
  if (haystack.includes('mindful') || haystack.includes('achtsamkeit'))                      return 'mindfulness'
  if (haystack.includes('resilienz') || haystack.includes('resilience'))                     return 'resilience'
  if (haystack.includes('love') || haystack.includes('liebe') || haystack.includes('beziehung') || haystack.includes('relationship')) return 'love'
  if (haystack.includes('trauma'))                            return 'calm'
  if (haystack.includes('selbst') || haystack.includes('self') || haystack.includes('esteem')) return 'trust'
  if (haystack.includes('focus') || haystack.includes('konzentr'))                           return 'focus'
  if (haystack.includes('hoffnung') || haystack.includes('hope'))                            return 'hope'
  if (haystack.includes('dankbar') || haystack.includes('gratit'))                           return 'gratitude'
  if (haystack.includes('freude') || haystack.includes('joy') || haystack.includes('glück'))  return 'joy'
  if (haystack.includes('vertrauen') || haystack.includes('trust'))                          return 'trust'
  const sentiment = (article.sentiment || '').toLowerCase()
  if (sentiment === 'positive') return 'hope'
  if (sentiment === 'negative') return 'depression'
  return 'calm'
}

// ── State ─────────────────────────────────────────────────────────────
const screens         = ['Überblick', 'Literatur', 'Videos', 'Fazit', 'Bewertung']
const currentScreen   = ref(0)
const loading         = ref(true)
const error           = ref(null)
const article         = ref({})
const favorited       = ref(false)
const favLoading      = ref(false)
const scrollContainer = ref(null)
let previousTheme     = null

// Rating state
const existingRating = ref(null)
const ratingDraft    = ref(0)
const ratingHover    = ref(0)
const commentDraft   = ref('')
const ratingLoading  = ref(false)
const ratingError    = ref('')
const ratingSummary  = ref({ average: null, count: 0 })

const ratingLabels = ['Nicht hilfreich', 'Wenig hilfreich', 'In Ordnung', 'Hilfreich', 'Sehr hilfreich']

// ── Lifecycle ─────────────────────────────────────────────────────────
onMounted(async () => {
  try {
    const id = Number(route.params.id)
    article.value = await getArticleById(id)
    if (!article.value) throw new Error('Artikel nicht gefunden.')

    if (currentTheme) {
      previousTheme = currentTheme.value
      currentTheme.value = categoryToTheme(article.value)
    }

    trackArticleView({ articleId: id, articleTitle: article.value.title, articleEmoji: article.value.emoji }).catch(() => {})
    isFavorited(id).then(v => { favorited.value = v }).catch(() => {})

    if (isLoggedIn.value) {
      getMyArticleRating(id).then(r => { existingRating.value = r }).catch(() => {})
    }
    getArticleRatingSummary(id).then(s => { ratingSummary.value = s }).catch(() => {})

  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (currentTheme && previousTheme !== null) {
    // Restore to dynamic theme if enabled, otherwise original theme
    currentTheme.value = getRestoreTheme() !== 'default' ? getRestoreTheme() : previousTheme
  }
})

// ── Favorite ──────────────────────────────────────────────────────────
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

// ── Rating ────────────────────────────────────────────────────────────
async function handleSubmitRating() {
  ratingError.value = ''
  if (ratingDraft.value === 0) {
    ratingError.value = 'Bitte wähle eine Bewertung aus.'
    return
  }
  ratingLoading.value = true
  try {
    const saved = await upsertArticleRating({
      articleId:    article.value.id,
      articleTitle: article.value.title,
      rating:       ratingDraft.value,
      comment:      commentDraft.value.trim() || null,
    })
    existingRating.value = saved
    ratingDraft.value    = 0
    commentDraft.value   = ''
    ratingSummary.value  = await getArticleRatingSummary(article.value.id)
  } catch (e) {
    ratingError.value = 'Fehler beim Speichern. Bitte versuche es erneut.'
    console.warn('[rating]', e)
  } finally {
    ratingLoading.value = false
  }
}

async function handleDeleteRating() {
  if (!confirm('Deine Bewertung wirklich löschen?')) return
  ratingLoading.value = true
  try {
    await deleteMyArticleRating(article.value.id)
    existingRating.value = null
    ratingSummary.value  = await getArticleRatingSummary(article.value.id)
  } catch (e) {
    console.warn('[rating delete]', e)
  } finally {
    ratingLoading.value = false
  }
}

// ── Scroll ────────────────────────────────────────────────────────────
function onScroll() {
  const container = scrollContainer.value
  currentScreen.value = Math.round(container.scrollLeft / container.clientWidth)
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

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.25s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(-4px); }

div::-webkit-scrollbar { display: none; }
</style>
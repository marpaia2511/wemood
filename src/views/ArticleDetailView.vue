<template>
  <div class="h-screen flex flex-col">

    <!-- Top Bar -->
    <div class="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 border-b border-gray-200 bg-white">
      <button
          @click="goBack"
          class="flex items-center gap-2 px-3 sm:px-5 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
      >
        <ArrowLeftIcon class="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        <span class="text-sm sm:text-base text-gray-700">Zurück</span>
      </button>

      <h2 class="text-base sm:text-lg font-quicksand font-semibold text-gray-800 truncate max-w-[50%] text-center">
        {{ article.title }}
      </h2>

      <div class="text-xl sm:text-2xl">{{ article.emoji }}</div>
    </div>

    <!-- Fortschrittsanzeige -->
    <div class="flex items-center justify-center gap-2 py-2 sm:py-3 bg-white border-b border-gray-100">
      <button
          v-for="(screen, index) in screens"
          :key="index"
          @click="scrollToScreen(index)"
          :class="[
          'w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300',
          currentScreen === index
            ? 'bg-gray-700 scale-125'
            : 'bg-gray-300 hover:bg-gray-400'
        ]"
      ></button>
    </div>

    <!-- Horizontaler Scroll Container -->
    <div
        ref="scrollContainer"
        @scroll="onScroll"
        class="flex-1 flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
        style="-webkit-overflow-scrolling: touch;"
    >

      <!-- Screen 1: Facts & Infos -->
      <div class="w-full flex-shrink-0 snap-center overflow-y-auto">
        <div class="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-10">

          <div class="text-center mb-6 sm:mb-8">
            <div class="text-5xl sm:text-6xl mb-4">{{ article.emoji }}</div>
            <h1 class="text-2xl sm:text-4xl font-quicksand font-bold text-gray-800 mb-3 sm:mb-4">
              {{ article.title }}
            </h1>
            <p class="text-sm sm:text-base text-gray-500">{{ article.readTime }}</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 mb-4 sm:mb-6">
            <h3 class="text-lg sm:text-xl font-quicksand font-semibold text-gray-800 mb-3 sm:mb-4">Überblick</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">{{ article.overview }}</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 mb-4 sm:mb-6">
            <h3 class="text-lg sm:text-xl font-quicksand font-semibold text-gray-800 mb-3 sm:mb-4">Wichtige Fakten</h3>
            <div class="space-y-3 sm:space-y-4">
              <div
                  v-for="(fact, index) in article.facts"
                  :key="index"
                  class="flex items-start gap-3"
              >
                <div class="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span class="text-xs sm:text-sm font-semibold text-gray-600">{{ index + 1 }}</span>
                </div>
                <p class="text-sm sm:text-base text-gray-600 leading-relaxed">{{ fact }}</p>
              </div>
            </div>
          </div>

          <!-- Pfeil nach rechts -->
          <div class="flex justify-center mt-6 sm:mt-8">
            <button
                @click="scrollToScreen(1)"
                class="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 border border-gray-200 rounded-full hover:bg-gray-200 transition-colors"
            >
              <span class="text-sm sm:text-base text-gray-600">Literatur & Vorschläge</span>
              <ChevronRightIcon class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <!-- Screen 2: Literatur & Vorschläge -->
      <div class="w-full flex-shrink-0 snap-center overflow-y-auto">
        <div class="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-10">

          <div class="text-center mb-6 sm:mb-8">
            <BookOpenIcon class="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h2 class="text-2xl sm:text-3xl font-quicksand font-bold text-gray-800">Literatur & Vorschläge</h2>
          </div>

          <div class="space-y-3 sm:space-y-4">
            <div
                v-for="(book, index) in article.literature"
                :key="index"
                class="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 hover:shadow-md transition-all"
            >
              <div class="flex items-start gap-3 sm:gap-4">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpenIcon class="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                </div>
                <div>
                  <h4 class="text-base sm:text-lg font-semibold text-gray-800 mb-1">{{ book.title }}</h4>
                  <p class="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">{{ book.author }}</p>
                  <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">{{ book.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Pfeil nach rechts -->
          <div class="flex justify-center mt-6 sm:mt-8">
            <button
                @click="scrollToScreen(2)"
                class="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 border border-gray-200 rounded-full hover:bg-gray-200 transition-colors"
            >
              <span class="text-sm sm:text-base text-gray-600">Videos & Filme</span>
              <ChevronRightIcon class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <!-- Screen 3: Videos & Filme -->
      <div class="w-full flex-shrink-0 snap-center overflow-y-auto">
        <div class="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-10">

          <div class="text-center mb-6 sm:mb-8">
            <PlayCircleIcon class="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h2 class="text-2xl sm:text-3xl font-quicksand font-bold text-gray-800">Videos & Filme</h2>
          </div>

          <div class="space-y-3 sm:space-y-4">
            <div
                v-for="(video, index) in article.videos"
                :key="index"
                class="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 hover:shadow-md transition-all"
            >
              <div class="flex items-start gap-3 sm:gap-4">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <PlayCircleIcon class="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                </div>
                <div>
                  <h4 class="text-base sm:text-lg font-semibold text-gray-800 mb-1">{{ video.title }}</h4>
                  <p class="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">{{ video.duration }}</p>
                  <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">{{ video.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Pfeil nach rechts -->
          <div class="flex justify-center mt-6 sm:mt-8">
            <button
                @click="scrollToScreen(3)"
                class="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 border border-gray-200 rounded-full hover:bg-gray-200 transition-colors"
            >
              <span class="text-sm sm:text-base text-gray-600">Fazit</span>
              <ChevronRightIcon class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <!-- Screen 4: Fazit -->
      <div class="w-full flex-shrink-0 snap-center overflow-y-auto">
        <div class="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-10">

          <div class="text-center mb-6 sm:mb-8">
            <CheckCircleIcon class="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h2 class="text-2xl sm:text-3xl font-quicksand font-bold text-gray-800">Fazit</h2>
          </div>

          <div class="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 mb-4 sm:mb-6">
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">{{ article.conclusion }}</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 mb-4 sm:mb-6">
            <h3 class="text-lg sm:text-xl font-quicksand font-semibold text-gray-800 mb-3 sm:mb-4">Wichtigste Erkenntnisse</h3>
            <div class="space-y-2 sm:space-y-3">
              <div
                  v-for="(takeaway, index) in article.takeaways"
                  :key="index"
                  class="flex items-start gap-3"
              >
                <CheckCircleIcon class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <p class="text-sm sm:text-base text-gray-600">{{ takeaway }}</p>
              </div>
            </div>
          </div>

          <!-- Zurück zur Bibliothek -->
          <div class="flex justify-center mt-6 sm:mt-8">
            <button
                @click="goBack"
                class="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              <ArrowLeftIcon class="w-4 h-4 sm:w-5 sm:h-5" />
              <span class="text-sm sm:text-base">Zurück zur Bibliothek</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft as ArrowLeftIcon,
  ChevronRight as ChevronRightIcon,
  BookOpen as BookOpenIcon,
  PlayCircle as PlayCircleIcon,
  CheckCircle as CheckCircleIcon
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const scrollContainer = ref(null)
const currentScreen = ref(0)

const screens = ['Facts', 'Literatur', 'Videos', 'Fazit']

// Artikel-Daten (Mock) - wird später vom Backend befüllt
const articles = {
  1: {
    title: 'Achtsamkeit für Anfänger',
    emoji: '🧘‍♀️',
    readTime: '5 Min. Lesezeit',
    overview: 'Achtsamkeit ist die Praxis, den gegenwärtigen Moment bewusst wahrzunehmen, ohne ihn zu bewerten. Sie hat ihren Ursprung in buddhistischen Meditationstraditionen und wird heute weltweit als wirksame Methode zur Stressreduktion und Förderung des Wohlbefindens eingesetzt.',
    facts: [
      'Regelmäßige Achtsamkeitsübungen können Stress und Angst nachweislich reduzieren.',
      'Bereits 10 Minuten tägliche Meditation können positive Veränderungen im Gehirn bewirken.',
      'Achtsamkeit verbessert die Konzentrationsfähigkeit und emotionale Regulierung.',
      'Die Methode wird in der klinischen Psychologie zur Behandlung von Depressionen eingesetzt.'
    ],
    literature: [
      { title: 'Gesund durch Meditation', author: 'Jon Kabat-Zinn', description: 'Das Standardwerk zur achtsamkeitsbasierten Stressreduktion (MBSR).' },
      { title: 'Achtsamkeit für Anfänger', author: 'Jon Kabat-Zinn', description: 'Ein zugänglicher Einstieg in die Praxis der Achtsamkeit.' },
      { title: 'Das Wunder der Achtsamkeit', author: 'Thich Nhat Hanh', description: 'Klassisches Werk über Achtsamkeit im Alltag.' }
    ],
    videos: [
      { title: 'Achtsamkeit erklärt in 5 Minuten', duration: '5:23', description: 'Eine kurze und verständliche Einführung in das Konzept der Achtsamkeit.' },
      { title: 'Geführte Meditation für Einsteiger', duration: '12:00', description: 'Eine einfache geführte Meditation zum Mitmachen.' },
      { title: 'Die Wissenschaft hinter Meditation', duration: '18:45', description: 'Wie Meditation das Gehirn verändert – wissenschaftlich erklärt.' }
    ],
    conclusion: 'Achtsamkeit ist eine einfache, aber wirkungsvolle Methode, um das eigene Wohlbefinden zu steigern. Schon wenige Minuten täglicher Praxis können einen spürbaren Unterschied machen. Der Schlüssel liegt in der Regelmäßigkeit – nicht in der Perfektion.',
    takeaways: [
      'Starte mit nur 5 Minuten täglich und steigere dich langsam.',
      'Bewertung loslassen: Beobachte deine Gedanken ohne sie zu beurteilen.',
      'Achtsamkeit kann überall praktiziert werden – beim Essen, Gehen oder Atmen.',
      'Sei geduldig mit dir selbst – Achtsamkeit ist eine Fähigkeit, die wächst.'
    ]
  },
  2: {
    title: 'Geführte Meditation',
    emoji: '🎧',
    readTime: '6 Min. Lesezeit',
    overview: 'Geführte Meditation ist eine Form der Meditation, bei der eine Stimme dich durch den Prozess leitet. Sie eignet sich besonders gut für Anfänger, da sie Struktur und Orientierung bietet.',
    facts: [
      'Geführte Meditationen können Schlafqualität um bis zu 65% verbessern.',
      'Sie aktivieren das parasympathische Nervensystem und fördern Entspannung.',
      'Regelmäßige Praxis kann den Blutdruck senken.',
      'Es gibt spezialisierte Meditationen für verschiedene Bedürfnisse wie Schlaf, Fokus oder Angst.'
    ],
    literature: [
      { title: 'Meditation für Skeptiker', author: 'Ulrich Ott', description: 'Wissenschaftlich fundierte Einführung in die Meditation.' },
      { title: 'Der Weg des Künstlers', author: 'Julia Cameron', description: 'Kreativität und Meditation als Werkzeuge der Selbstfindung.' }
    ],
    videos: [
      { title: '10 Minuten Meditation zum Einschlafen', duration: '10:00', description: 'Eine beruhigende Meditation für besseren Schlaf.' },
      { title: 'Morgen-Meditation für einen guten Start', duration: '8:30', description: 'Starte deinen Tag mit Klarheit und Energie.' }
    ],
    conclusion: 'Geführte Meditation ist der perfekte Einstieg in die Welt der Meditation. Lass dich von einer Stimme leiten und finde deinen eigenen Rhythmus.',
    takeaways: [
      'Nutze Apps oder Online-Ressourcen für geführte Meditationen.',
      'Finde einen ruhigen Ort und eine bequeme Position.',
      'Es ist normal, wenn die Gedanken abschweifen – bringe sie sanft zurück.',
      'Experimentiere mit verschiedenen Arten von geführten Meditationen.'
    ]
  },
  3: {
    title: 'Umgang mit Stress',
    emoji: '📖',
    readTime: '5 Min. Lesezeit',
    overview: 'Stress ist eine natürliche Reaktion des Körpers auf Herausforderungen. Chronischer Stress kann jedoch zu gesundheitlichen Problemen führen. Es gibt bewährte Strategien, um Stress effektiv zu bewältigen.',
    facts: [
      'Chronischer Stress kann das Immunsystem schwächen und zu Krankheiten führen.',
      'Bewegung ist eine der effektivsten Methoden zur Stressreduktion.',
      'Soziale Kontakte und ein starkes Netzwerk schützen vor den Folgen von Stress.',
      'Ausreichend Schlaf ist entscheidend für die Stressresistenz.'
    ],
    literature: [
      { title: 'Warum Zebras keine Magengeschwüre bekommen', author: 'Robert Sapolsky', description: 'Wie Stress den Körper beeinflusst – verständlich erklärt.' },
      { title: 'Die Stress-Lösung', author: 'Dr. Rangan Chatterjee', description: 'Praktische Strategien für weniger Stress im Alltag.' }
    ],
    videos: [
      { title: 'Stress verstehen und bewältigen', duration: '15:20', description: 'Was passiert im Körper bei Stress und wie man damit umgeht.' },
      { title: '5-Minuten Atemübung gegen Stress', duration: '5:00', description: 'Eine schnelle Übung für akute Stresssituationen.' }
    ],
    conclusion: 'Stress gehört zum Leben, aber er muss uns nicht beherrschen. Mit den richtigen Werkzeugen und einer bewussten Lebensweise können wir lernen, Stress zu managen und sogar als Wachstumschance zu nutzen.',
    takeaways: [
      'Identifiziere deine persönlichen Stressauslöser.',
      'Baue regelmäßige Pausen und Erholungszeiten in deinen Alltag ein.',
      'Bewegung, Natur und soziale Kontakte sind natürliche Stresskiller.',
      'Lerne, Nein zu sagen und Grenzen zu setzen.'
    ]
  }
}

// Fallback-Artikel für IDs ohne spezifische Daten
const defaultArticle = {
  title: 'Artikel',
  emoji: '📄',
  readTime: '5 Min. Lesezeit',
  overview: 'Dieser Artikel enthält wertvolle Informationen zum Thema psychische Gesundheit und Wohlbefinden.',
  facts: [
    'Psychische Gesundheit ist genauso wichtig wie körperliche Gesundheit.',
    'Frühzeitige Unterstützung kann langfristige Probleme verhindern.',
    'Jeder Mensch kann von Techniken zur Selbstfürsorge profitieren.'
  ],
  literature: [
    { title: 'Weiterführende Literatur', author: 'Verschiedene Autoren', description: 'Wird in einer späteren Version ergänzt.' }
  ],
  videos: [
    { title: 'Weiterführende Videos', duration: '-', description: 'Wird in einer späteren Version ergänzt.' }
  ],
  conclusion: 'Weitere Inhalte werden in Zusammenarbeit mit dem Backend-Team ergänzt.',
  takeaways: [
    'Bleib neugierig und offen für neue Erkenntnisse.',
    'Kleine Schritte führen zu großen Veränderungen.'
  ]
}

const articleId = Number(route.params.id)
const article = articles[articleId] || { ...defaultArticle }

function onScroll() {
  if (!scrollContainer.value) return
  const container = scrollContainer.value
  const screenWidth = container.clientWidth
  const scrollLeft = container.scrollLeft
  currentScreen.value = Math.round(scrollLeft / screenWidth)
}

function scrollToScreen(index) {
  if (!scrollContainer.value) return
  const screenWidth = scrollContainer.value.clientWidth
  scrollContainer.value.scrollTo({
    left: screenWidth * index,
    behavior: 'smooth'
  })
}

function goBack() {
  router.back()
}
</script>
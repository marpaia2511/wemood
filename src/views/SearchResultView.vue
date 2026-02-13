<template>
  <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
    <div class="w-full max-w-4xl">

      <!-- Zurück Button -->
      <router-link
          to="/"
          class="mb-6 sm:mb-8 inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
      >
        <ArrowLeftIcon class="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        <span class="text-sm sm:text-base text-gray-700">Zurück</span>
      </router-link>

      <!-- Analyse Panel -->
      <div class="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-12">

        <!-- Analyse Text -->
        <div class="mb-8 sm:mb-10 text-center">
          <h2 class="text-2xl sm:text-3xl mb-4 sm:mb-6 font-quicksand font-semibold text-gray-800">
            Deine Analyse
          </h2>
          <p class="text-base sm:text-xl text-gray-600 leading-relaxed">
            Laut deinem Prompt ist mir aufgefallen, dass dich Themen wie
            <span class="font-semibold text-gray-800">Trauer</span> und
            <span class="font-semibold text-gray-800">Stress</span> bedrücken.
          </p>
        </div>

        <!-- Themen Karten -->
        <div class="space-y-4 sm:space-y-6">
          <h3 class="text-lg sm:text-xl text-gray-700 mb-3 sm:mb-4">Relevante Themen für dich:</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <router-link
                v-for="topic in detectedTopics"
                :key="topic.id"
                :to="'/article/' + topic.articleId"
                class="group bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-gray-100 transition-all text-left"
            >
              <!-- Thema Header -->
              <div class="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gray-200 flex items-center justify-center text-2xl sm:text-3xl">
                  {{ topic.emoji }}
                </div>
                <h4 class="text-xl sm:text-2xl font-quicksand font-semibold text-gray-800">
                  {{ topic.name }}
                </h4>
              </div>

              <!-- Thema Beschreibung -->
              <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
                {{ topic.description }}
              </p>

              <!-- Pfeil -->
              <div class="mt-3 sm:mt-4 text-gray-500 group-hover:translate-x-2 transition-transform text-sm">
                Mehr erfahren →
              </div>
            </router-link>
          </div>
        </div>

        <!-- Link zur Bibliothek -->
        <div class="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
          <router-link
              to="/library"
              class="block w-full py-3 sm:py-4 bg-gray-100 border border-gray-200 rounded-full hover:bg-gray-200 transition-colors text-gray-700 text-base sm:text-lg text-center"
          >
            Zur Bibliothek für weitere Ressourcen
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft as ArrowLeftIcon } from 'lucide-vue-next'

const detectedTopics = [
  {
    id: 1,
    articleId: 2,
    name: 'Trauer',
    emoji: '😢',
    description: 'Verstehe und verarbeite deine Trauer mit bewährten Methoden'
  },
  {
    id: 2,
    articleId: 3,
    name: 'Stress',
    emoji: '😰',
    description: 'Lerne effektive Strategien zur Stressbewältigung'
  }
]
</script>
<template>
  <!--
    LibraryView.vue – Eigenständige Bibliothek-Seite.
    Wird angezeigt wenn man direkt /library aufruft (z.B. von SearchResultView).
    Verwendet die gleiche LibrarySection-Komponente wie HomeView.

    Quellen:
    - Vue 3 Single File Components: https://vuejs.org/guide/scaling-up/sfc.html
    - Lucide Vue Next: https://lucide.dev/guide/packages/lucide-vue-next
  -->
  <div class="min-h-screen px-4 md:px-8 py-6 sm:py-8">

    <!-- Home Navigation -->
    <div class="flex justify-center mb-6 sm:mb-8">
      <router-link
          to="/"
          class="flex flex-col items-center gap-1 group
               transition-opacity hover:opacity-85"
      >
        <ChevronUpIcon class="nav-icon-dark w-10 h-10 sm:w-12 sm:h-12 text-white/90
                              stroke-[2.5] group-hover:text-white transition-colors" />
        <span class="nav-label-dark text-3xl sm:text-4xl font-quicksand text-white font-bold
                     group-hover:text-white transition-colors">
          Home
        </span>
      </router-link>
    </div>

    <!-- Bibliothek Inhalt (wiederverwendbare Komponente) -->
    <LibrarySection />

  </div>
</template>

<script setup>
import { ChevronUp as ChevronUpIcon } from 'lucide-vue-next'
import LibrarySection from '../components/LibrarySection.vue'
</script>

<style scoped>
.nav-label-dark {
  text-shadow:
      0 1px 3px rgba(0, 0, 0, 0.3),
      0 0 8px rgba(0, 0, 0, 0.15);
}
.nav-label {
  text-shadow:
      0 1px 4px rgba(255, 255, 255, 0.6),
      0 0 12px rgba(255, 255, 255, 0.4);
}
.nav-icon-dark {
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3));
}
</style>
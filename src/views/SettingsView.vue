<template>
  <div class="min-h-screen px-4 sm:px-6 py-6 sm:py-8">

    <!-- Top Bar -->
    <div class="flex items-center justify-between mb-6 sm:mb-8 max-w-5xl mx-auto">
      <router-link
          to="/"
          class="flex flex-col items-center gap-1 group transition-opacity hover:opacity-85"
      >
        <ChevronUpIcon class="nav-icon-dark w-9 h-9 sm:w-10 sm:h-10 text-white/90 stroke-[2.5] group-hover:text-white transition-colors" />
        <span class="nav-label-dark text-xl sm:text-2xl font-quicksand text-white font-bold group-hover:text-white transition-colors">
          Zurück
        </span>
      </router-link>
      <h1 class="text-2xl sm:text-3xl font-quicksand font-bold text-gray-800 nav-label">
        Einstellungen
      </h1>
      <div class="text-xl sm:text-2xl font-quicksand font-bold text-gray-800 nav-label">
        ⚙️
      </div>
    </div>

    <div class="px-0 py-4 sm:py-6 max-w-5xl mx-auto space-y-4">

      <!-- Konto -->
      <div class="glass-strong rounded-2xl sm:rounded-3xl p-6 sm:p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 sm:w-12 sm:h-12 glass-subtle rounded-full flex items-center justify-center">
            <UserIcon class="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 nav-label">Konto</h2>
        </div>

        <!-- Logged in -->
        <router-link
          v-if="isLoggedIn"
          to="/account"
          class="flex items-center justify-between group p-3 sm:p-4 glass-subtle rounded-2xl hover:bg-white/25 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gray-800/80 rounded-xl flex items-center justify-center">
              <span class="text-base font-bold text-white font-quicksand">{{ currentUser?.avatar }}</span>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-800 nav-label-dark">{{ currentUser?.name }}</p>
              <p class="text-xs text-gray-500 nav-label-dark">{{ currentUser?.email }}</p>
            </div>
          </div>
          <ChevronRightIcon class="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
        </router-link>

        <!-- Guest -->
        <div v-else class="flex flex-col sm:flex-row gap-3">
          <router-link
            to="/login"
            class="flex-1 py-3 text-center glass hover:bg-white/30 text-gray-800 font-bold text-sm rounded-2xl transition-all nav-label"
          >
            Anmelden
          </router-link>
          <router-link
            to="/register"
            class="flex-1 py-3 text-center glass-subtle hover:bg-white/25 text-gray-700 text-sm font-medium rounded-2xl transition-all nav-label-dark"
          >
            Registrieren
          </router-link>
        </div>
      </div>

      <!-- Emotions-Theme + Erscheinungsbild in einer Karte -->
      <div class="glass-strong rounded-2xl sm:rounded-3xl p-6 sm:p-8">

        <!-- Emotions-Theme -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 sm:w-12 sm:h-12 glass-subtle rounded-full flex items-center justify-center">
            <PaletteIcon class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 nav-label">Emotions-Theme</h2>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          <button
              v-for="theme in emotionThemes"
              :key="theme.value"
              @click="currentTheme = theme.value"
              :class="[
              'p-3 sm:p-4 border-2 rounded-xl sm:rounded-2xl transition-all text-left',
              currentTheme === theme.value
                ? 'border-violet-600 bg-white/25 shadow-md'
                : 'border-white/20 glass-subtle hover:bg-white/25'
            ]"
          >
            <div
                class="w-full h-8 sm:h-10 rounded-lg sm:rounded-xl mb-2"
                :style="{ background: theme.preview }"
            />
            <p class="text-xs sm:text-sm text-gray-700 font-medium nav-label-dark">
              {{ theme.emoji }} {{ theme.label }}
            </p>
          </button>
        </div>

        <!-- Divider -->
        <div class="border-t border-white/20 mb-6"></div>

        <!-- Dark Mode -->
        <div class="flex items-center justify-between p-3 sm:p-4 glass-subtle rounded-xl sm:rounded-2xl mb-4">
          <div class="flex items-center gap-3">
            <MoonIcon class="w-5 h-5 text-gray-600" />
            <span class="text-base sm:text-lg text-gray-700 font-semibold nav-label">Dunkelmodus</span>
          </div>
          <button
              @click="darkMode = !darkMode"
              :class="[
              'w-12 sm:w-14 h-6 sm:h-7 rounded-full transition-all relative',
              darkMode ? 'bg-violet-600' : 'bg-violet-300'
            ]"
          >
            <div
                :class="[
                'w-4 sm:w-5 h-4 sm:h-5 bg-white rounded-full transition-all absolute top-1',
                darkMode ? 'right-1' : 'left-1'
              ]"
            />
          </button>
        </div>

        <!-- Reduzierte Animationen -->
        <div class="flex items-center justify-between p-3 sm:p-4 glass-subtle rounded-xl sm:rounded-2xl">
          <div class="flex items-center gap-3">
            <EyeIcon class="w-5 h-5 text-gray-600" />
            <div>
              <span class="text-base sm:text-lg text-gray-700 font-semibold nav-label block">Reduzierte Animationen</span>
              <span class="text-xs text-gray-500">Deaktiviert alle Hintergrund-Animationen</span>
            </div>
          </div>
          <button
              @click="reducedMotion = !reducedMotion"
              :class="[
              'w-12 sm:w-14 h-6 sm:h-7 rounded-full transition-all relative',
              reducedMotion ? 'bg-violet-600' : 'bg-violet-300'
            ]"
          >
            <div
                :class="[
                'w-4 sm:w-5 h-4 sm:h-5 bg-white rounded-full transition-all absolute top-1',
                reducedMotion ? 'right-1' : 'left-1'
              ]"
            />
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import {
  ChevronUp as ChevronUpIcon,
  ChevronRight as ChevronRightIcon,
  Palette as PaletteIcon,
  Moon as MoonIcon,
  Eye as EyeIcon,
  User as UserIcon,
} from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth.js'

const { currentUser, isLoggedIn } = useAuth()

const currentTheme  = inject('currentTheme')
const darkMode      = inject('darkMode')
const reducedMotion = inject('reducedMotion')

const emotionThemes = [
  { value: 'default',      label: 'Standard',      emoji: '🎨', preview: 'linear-gradient(135deg, #C4B5FD, #FDBA74, #A78BFA, #FB923C)' },
  { value: 'joy',          label: 'Freude',         emoji: '😊', preview: 'linear-gradient(135deg, #FDE68A, #FDBA74, #FEF9C3, #FB923C)' },
  { value: 'trust',        label: 'Vertrauen',      emoji: '🤝', preview: 'linear-gradient(135deg, #5EEAD4, #7DD3FC, #6EE7B7)' },
  { value: 'anxiety',      label: 'Angst',          emoji: '😨', preview: 'linear-gradient(135deg, #A5B4FC, #C4B5FD, #93C5FD)' },
  { value: 'surprise',     label: 'Überraschung',   emoji: '😮', preview: 'linear-gradient(135deg, #FDE68A, #F9A8D4, #93C5FD)' },
  { value: 'depression',   label: 'Depression',     emoji: '😢', preview: 'linear-gradient(135deg, #FDE68A, #6EE7B7, #A7F3D0)' },
  { value: 'anger',        label: 'Wut',            emoji: '😠', preview: 'linear-gradient(135deg, #FDA4AF, #FDBA74, #F9A8D4)' },
  { value: 'anticipation', label: 'Vorfreude',      emoji: '🤩', preview: 'linear-gradient(135deg, #FB923C, #FDE68A, #C4B5FD)' },
  { value: 'love',         label: 'Liebe',          emoji: '❤️', preview: 'linear-gradient(135deg, #F9A8D4, #FECDD3, #FDA4AF)' },
  { value: 'resilience',   label: 'Resilienz',      emoji: '💪', preview: 'linear-gradient(135deg, #A7F3D0, #FDE68A, #D1FAE5)' },
  { value: 'gratitude',    label: 'Dankbarkeit',    emoji: '🙏', preview: 'linear-gradient(135deg, #FEF3C7, #FED7AA, #FDE68A)' },
  { value: 'mindfulness',  label: 'Achtsamkeit',    emoji: '🧘', preview: 'linear-gradient(135deg, #A7F3D0, #99F6E4, #6EE7B7)' },
  { value: 'focus',        label: 'Fokus',          emoji: '🎯', preview: 'linear-gradient(135deg, #93C5FD, #FDBA74, #BAE6FD)' },
  { value: 'sleep',        label: 'Schlaf',         emoji: '🌙', preview: 'linear-gradient(135deg, #312E81, #1E1B4B, #4C1D95)' },
  { value: 'calm',         label: 'Ruhe',           emoji: '☁️', preview: 'linear-gradient(135deg, #A7F3D0, #C4B5FD, #6EE7B7)' },
  { value: 'hope',         label: 'Hoffnung',       emoji: '🌱', preview: 'linear-gradient(135deg, #A7F3D0, #FEF3C7, #99F6E4)' },
]
</script>

<style scoped>
.nav-label-dark { text-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 0 8px rgba(0,0,0,0.15); }
.nav-label      { text-shadow: 0 1px 4px rgba(255,255,255,0.6), 0 0 12px rgba(255,255,255,0.4); }
.nav-icon-dark  { filter: drop-shadow(0 1px 3px rgba(0,0,0,0.3)); }
</style>
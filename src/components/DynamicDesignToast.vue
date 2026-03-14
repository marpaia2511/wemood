<template>
  <Transition name="toast">
    <div
      v-if="visible"
      class="fixed bottom-6 right-4 sm:right-6 z-50 w-80 sm:w-96"
    >
      <div class="toast-glass rounded-2xl p-4 shadow-2xl">

        <!-- Header row -->
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex items-center gap-2.5">
            <!-- Animated sparkle icon -->
            <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 sparkle-bg">
              <SparklesIcon class="w-4 h-4 text-violet-600" />
            </div>
            <p class="text-sm font-semibold text-gray-800 leading-snug">
              Dynamisches Design
            </p>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <!-- Info button -->
            <button
              @click="showInfo = !showInfo"
              class="p-1.5 rounded-full hover:bg-black/8 transition-colors"
              :class="showInfo ? 'bg-violet-100/60' : ''"
              title="Was ist das?"
            >
              <InfoIcon class="w-3.5 h-3.5 text-gray-400" />
            </button>
            <!-- Close -->
            <button
              @click="dismiss"
              class="p-1.5 rounded-full hover:bg-black/8 transition-colors"
            >
              <XIcon class="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        </div>

        <!-- Info panel -->
        <Transition name="info-slide">
          <div v-if="showInfo" class="mb-3 rounded-xl bg-violet-50/60 px-3 py-2.5">
            <p class="text-xs text-violet-700 leading-relaxed">
              Das dynamische Design analysiert deine Lieblingsartikel und Lesegewohnheiten
              und wählt automatisch das passende Farbthema für die gesamte Seite aus.
              Du kannst diese Einstellung jederzeit in den
              <span class="font-semibold">Einstellungen</span> ändern.
            </p>
          </div>
        </Transition>

        <!-- Question -->
        <p class="text-sm text-gray-600 leading-relaxed mb-4">
          Soll WeMood das Design automatisch an deine Lesegewohnheiten anpassen?
        </p>

        <!-- Action buttons -->
        <div class="flex gap-2 mb-3">
          <button
            @click="handleEnable"
            class="flex-1 py-2 rounded-xl text-xs font-semibold transition-all text-white"
            style="background: rgba(124,58,237,0.85)"
            @mouseenter="$event.target.style.background='rgba(124,58,237,1)'"
            @mouseleave="$event.target.style.background='rgba(124,58,237,0.85)'"
          >
            Ja, aktivieren
          </button>
          <button
            @click="dismiss"
            class="flex-1 py-2 rounded-xl text-xs font-medium text-gray-600 transition-all"
            style="background: rgba(0,0,0,0.06)"
            @mouseenter="$event.target.style.background='rgba(0,0,0,0.1)'"
            @mouseleave="$event.target.style.background='rgba(0,0,0,0.06)'"
          >
            Nein danke
          </button>
        </div>

        <!-- Never show again -->
        <button
          @click="neverShow"
          class="w-full text-center text-xs text-gray-400 hover:text-gray-500 transition-colors py-0.5"
        >
          Nicht mehr anzeigen
        </button>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import {
  Sparkles as SparklesIcon,
  Info     as InfoIcon,
  X        as XIcon,
} from 'lucide-vue-next'
import { useDynamicTheme } from '../composables/useDynamicTheme.js'
import { useAuth } from '../composables/useAuth.js'

const TOAST_KEY = 'wemood_dynamic_design_toast'

const { setEnabled, applyDynamicTheme } = useDynamicTheme()
const { isLoggedIn } = useAuth()

const visible  = ref(false)
const showInfo = ref(false)

const emit = defineEmits(['enabled'])

function maybeShow() {
  const dismissed  = localStorage.getItem(TOAST_KEY) === 'dismissed'
  const alreadySet = localStorage.getItem('wemood_dynamic_design') !== null
  if (isLoggedIn.value && !dismissed && !alreadySet) {
    setTimeout(() => { visible.value = true }, 2000)
  }
}

onMounted(() => {
  // Auth may already be restored by the time we mount
  maybeShow()
})

// Auth restores asynchronously — watch for login in case it wasn't ready on mount
watch(isLoggedIn, (loggedIn) => {
  if (loggedIn && !visible.value) maybeShow()
}, { immediate: false })

function dismiss() {
  visible.value = false
}

function neverShow() {
  localStorage.setItem(TOAST_KEY, 'dismissed')
  visible.value = false
}

async function handleEnable() {
  setEnabled(true)
  visible.value = false
  emit('enabled')
}
</script>

<style scoped>
.toast-glass {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(32px) saturate(180%);
  -webkit-backdrop-filter: blur(32px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 4px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.sparkle-bg {
  background: rgba(167, 139, 250, 0.2);
  animation: sparkle-pulse 2.5s ease-in-out infinite;
}

@keyframes sparkle-pulse {
  0%, 100% { background: rgba(167, 139, 250, 0.2); }
  50%       { background: rgba(167, 139, 250, 0.35); }
}

/* Toast slide-up entrance */
.toast-enter-active {
  transition: all 0.45s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.toast-leave-active {
  transition: all 0.25s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.97);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

/* Info panel slide */
.info-slide-enter-active { transition: all 0.2s ease; }
.info-slide-leave-active { transition: all 0.15s ease; }
.info-slide-enter-from, .info-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
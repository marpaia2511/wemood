<template>
  <Transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="close"
      />

      <!-- Modal -->
      <div
        class="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl z-10 overflow-hidden max-h-[92vh] flex flex-col"
        style="background: rgba(255,255,255,0.75); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.5);"
      >
        <!-- Red accent bar at top -->
        <div class="h-1 bg-gradient-to-r from-red-400 via-rose-500 to-red-400 shrink-0" />

        <!-- Drag handle (mobile) -->
        <div class="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div class="w-10 h-1 bg-gray-300/60 rounded-full" />
        </div>

        <!-- Header -->
        <div class="flex items-start justify-between px-6 pt-4 pb-3 sm:px-8 sm:pt-6 sm:pb-4 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-red-100/60 rounded-2xl flex items-center justify-center shrink-0">
              <HeartPulseIcon class="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 class="text-lg sm:text-xl font-quicksand font-bold text-gray-900 leading-tight">
                Notfall-Hilfe
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">Du bist nicht allein</p>
            </div>
          </div>
          <button
            @click="close"
            class="p-2 glass-subtle rounded-full hover:bg-white/40 transition-colors shrink-0 mt-0.5"
          >
            <XIcon class="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <!-- Scrollable content -->
        <div class="overflow-y-auto flex-1 px-6 pb-6 sm:px-8 sm:pb-8 space-y-4">

          <!-- Hotline Card -->
          <div class="bg-red-100/60 border border-red-200/50 rounded-2xl p-4 flex items-center gap-4">
            <div class="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shrink-0">
              <PhoneIcon class="w-5 h-5 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium text-red-500 uppercase tracking-wide mb-0.5">Krisentelefon · 24/7 kostenlos</p>
              <a
                href="tel:08001110111"
                class="text-2xl font-quicksand font-bold text-gray-900 hover:text-red-600 transition-colors block leading-tight"
              >
                0800 111 0 111
              </a>
            </div>
            <a
              href="tel:08001110111"
              class="shrink-0 w-9 h-9 bg-red-500 hover:bg-red-600 transition-colors rounded-xl flex items-center justify-center"
            >
              <PhoneCallIcon class="w-4 h-4 text-white" />
            </a>
          </div>

          <!-- Breathing Exercise -->
          <div class="glass-subtle rounded-2xl p-4">
            <div class="flex items-center gap-2 mb-3">
              <WindIcon class="w-4 h-4 text-blue-500" />
              <p class="text-sm font-semibold text-gray-700">Atemübung: 4-7-8</p>
              <button
                @click="toggleBreathing"
                class="ml-auto text-xs px-3 py-1 rounded-full transition-all font-medium"
                :class="breathingActive
                  ? 'bg-blue-200/60 text-blue-700 hover:bg-blue-200'
                  : 'bg-white/40 text-gray-600 hover:bg-white/60'"
              >
                {{ breathingActive ? 'Stopp' : 'Start' }}
              </button>
            </div>

            <div class="flex flex-col items-center py-2">
              <div class="relative flex items-center justify-center mb-3" style="width: 112px; height: 112px;">
                <div
                  class="absolute rounded-full border-2 border-blue-300"
                  :style="breathingActive ? breathingRingStyle : 'width:56px;height:56px;opacity:0;transition:all 1s ease'"
                />
                <div
                  class="rounded-full bg-blue-100/60 border-2 border-blue-300 flex items-center justify-center"
                  :style="breathingActive ? breathingCircleStyle : 'width:56px;height:56px;transition:all 1s ease'"
                >
                  <span class="text-xs font-bold text-blue-600 select-none">{{ breathingActive ? breathingCount : '·' }}</span>
                </div>
              </div>
              <p class="text-sm font-medium text-gray-600 text-center h-5 transition-all duration-500">
                {{ breathingActive ? breathingLabel : 'Drücke Start für eine Atemübung' }}
              </p>
            </div>

            <p class="text-xs text-gray-400 text-center mt-1">
              Einatmen 4s · Halten 7s · Ausatmen 8s
            </p>
          </div>

          <!-- Grounding Technique -->
          <div class="bg-amber-100/40 border border-amber-200/40 rounded-2xl p-4">
            <div class="flex items-center gap-2 mb-3">
              <AnchorIcon class="w-4 h-4 text-amber-500" />
              <p class="text-sm font-semibold text-gray-700">5-4-3-2-1 Erdung</p>
            </div>
            <div class="space-y-2">
              <div
                v-for="(step, i) in groundingSteps"
                :key="i"
                class="flex items-start gap-2.5 cursor-pointer group"
                @click="toggleGrounding(i)"
              >
                <div
                  class="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                  :class="groundingDone[i]
                    ? 'bg-amber-400 border-amber-400'
                    : 'border-amber-400 group-hover:border-amber-500'"
                >
                  <CheckIcon v-if="groundingDone[i]" class="w-3 h-3 text-white" />
                </div>
                <p
                  class="text-sm text-gray-600 transition-all duration-200"
                  :class="groundingDone[i] ? 'line-through text-gray-400' : ''"
                >
                  <span class="font-semibold text-amber-600">{{ step.num }}</span> {{ step.text }}
                </p>
              </div>
            </div>
          </div>

          <!-- Self-Help Tips -->
          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5 px-1">
              Schnellhilfe
            </p>
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="(tip, i) in selfHelpTips"
                :key="i"
                class="glass rounded-2xl p-3 hover:bg-white/30 transition-all"
              >
                <div class="text-lg mb-1.5">{{ tip.emoji }}</div>
                <p class="text-xs font-semibold text-gray-700 leading-tight mb-0.5">{{ tip.title }}</p>
                <p class="text-xs text-gray-500 leading-snug">{{ tip.desc }}</p>
              </div>
            </div>
          </div>

          <!-- Resource Links -->
          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5 px-1">
              Weiterführende Hilfe
            </p>
            <div class="space-y-2">
              <a
                v-for="(link, i) in resourceLinks"
                :key="i"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 glass rounded-2xl p-3 hover:bg-white/30 transition-all group"
              >
                <div
                  class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                  :class="link.bg"
                >
                  {{ link.emoji }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-800 leading-tight truncate">{{ link.title }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ link.subtitle }}</p>
                </div>
                <ExternalLinkIcon class="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import {
  X as XIcon,
  Phone as PhoneIcon,
  PhoneCall as PhoneCallIcon,
  Wind as WindIcon,
  Check as CheckIcon,
  Anchor as AnchorIcon,
  ExternalLink as ExternalLinkIcon,
  HeartPulse as HeartPulseIcon
} from 'lucide-vue-next'

const isOpen = ref(false)

// Breathing exercise
const breathingActive = ref(false)
const breathingPhase  = ref('inhale')
const breathingCount  = ref(4)
let breathingTimer    = null

const breathingLabel = computed(() => {
  if (breathingPhase.value === 'inhale') return `Einatmen… ${breathingCount.value}`
  if (breathingPhase.value === 'hold')   return `Halten… ${breathingCount.value}`
  return `Ausatmen… ${breathingCount.value}`
})

const breathingCircleStyle = computed(() => {
  const expanding = breathingPhase.value === 'inhale' || breathingPhase.value === 'hold'
  const size = expanding ? '80px' : '56px'
  return `width:${size};height:${size};transition:width 1s ease,height 1s ease`
})

const breathingRingStyle = computed(() => {
  const expanding = breathingPhase.value === 'inhale' || breathingPhase.value === 'hold'
  const size    = expanding ? '112px' : '64px'
  const opacity = breathingPhase.value === 'hold' ? '0.2' : '0.4'
  return `width:${size};height:${size};opacity:${opacity};transition:all 1s ease`
})

const phaseDurations = { inhale: 4, hold: 7, exhale: 8 }
const phaseOrder     = ['inhale', 'hold', 'exhale']

function runBreathing() {
  const duration = phaseDurations[breathingPhase.value]
  breathingCount.value = duration

  const tick = () => {
    breathingCount.value -= 1
    if (breathingCount.value <= 0) {
      const nextIndex = (phaseOrder.indexOf(breathingPhase.value) + 1) % 3
      breathingPhase.value = phaseOrder[nextIndex]
      if (breathingActive.value) runBreathing()
    } else {
      breathingTimer = setTimeout(tick, 1000)
    }
  }
  breathingTimer = setTimeout(tick, 1000)
}

function toggleBreathing() {
  if (breathingActive.value) {
    breathingActive.value = false
    clearTimeout(breathingTimer)
    breathingPhase.value = 'inhale'
    breathingCount.value = 4
  } else {
    breathingActive.value = true
    breathingPhase.value  = 'inhale'
    breathingCount.value  = 4
    runBreathing()
  }
}

// Grounding
const groundingSteps = [
  { num: '5', text: 'Dinge, die du sehen kannst' },
  { num: '4', text: 'Dinge, die du berühren kannst' },
  { num: '3', text: 'Geräusche, die du hörst' },
  { num: '2', text: 'Dinge, die du riechen kannst' },
  { num: '1', text: 'Ding, das du schmecken kannst' },
]
const groundingDone = ref([false, false, false, false, false])
function toggleGrounding(i) { groundingDone.value[i] = !groundingDone.value[i] }

// Self-help tips
const selfHelpTips = [
  { emoji: '💧', title: 'Wasser trinken',     desc: 'Langsam ein Glas kaltes Wasser trinken' },
  { emoji: '🚶', title: 'Bewegung',           desc: 'Kurz aufstehen und ein paar Schritte gehen' },
  { emoji: '🧊', title: 'Kühle Sensation',    desc: 'Kaltes Wasser übers Gesicht oder die Hände' },
  { emoji: '📞', title: 'Vertrauensperson',   desc: 'Jemanden anrufen, dem du vertraust' },
]

// Resource links
const resourceLinks = [
  { emoji: '📞', bg: 'bg-red-100/60',    title: 'Telefonseelsorge',         subtitle: 'telefonseelsorge.de · kostenlos & anonym', url: 'https://www.telefonseelsorge.de' },
  { emoji: '💬', bg: 'bg-blue-100/60',   title: 'Online-Beratung',          subtitle: 'online.telefonseelsorge.de',               url: 'https://online.telefonseelsorge.de' },
  { emoji: '🧠', bg: 'bg-purple-100/60', title: 'Deutsche Depressionshilfe', subtitle: 'deutsche-depressionshilfe.de',             url: 'https://www.deutsche-depressionshilfe.de' },
  { emoji: '🏥', bg: 'bg-green-100/60',  title: 'Psychiatrie-Notaufnahme',  subtitle: 'Nächste psychiatrische Klinik finden',      url: 'https://www.google.com/search?q=psychiatrische+notaufnahme+in+meiner+nähe' },
]

function open() {
  isOpen.value = true
  groundingDone.value = [false, false, false, false, false]
}

function close() {
  isOpen.value = false
  if (breathingActive.value) toggleBreathing()
}

onUnmounted(() => { clearTimeout(breathingTimer) })

defineExpose({ open, close })
</script>

<style scoped>
.modal-fade-enter-active { animation: modalSlideUp 0.35s cubic-bezier(0.34, 1.1, 0.64, 1); }
.modal-fade-leave-active { animation: modalSlideDown 0.25s cubic-bezier(0.4, 0, 1, 1); }

@keyframes modalSlideUp {
  from { opacity: 0; transform: translateY(40px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
}
@keyframes modalSlideDown {
  from { opacity: 1; transform: translateY(0)    scale(1);    }
  to   { opacity: 0; transform: translateY(40px) scale(0.98); }
}
</style>
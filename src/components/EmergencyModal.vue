<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">

      <!-- Ambient overlay -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-black/65 backdrop-blur-sm" @click="close" />
        <div class="absolute inset-0 pointer-events-none">
          <div class="ambient-orb orb-1" :style="{ background: currentMoodOrb1 }" />
          <div class="ambient-orb orb-2" :style="{ background: currentMoodOrb2 }" />
        </div>
      </div>

      <!-- Modal -->
      <div class="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl z-10 overflow-hidden max-h-[92vh] flex flex-col modal-glass">

        <!-- Top accent bar -->
        <div class="h-1 shrink-0 transition-all duration-1000" :style="{ background: currentMoodGradient }" />

        <!-- Drag handle -->
        <div class="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div class="w-10 h-1 rounded-full" style="background:rgba(255,255,255,0.15)" />
        </div>

        <!-- Header -->
        <div class="flex items-start justify-between px-6 pt-4 pb-3 sm:px-8 sm:pt-5 sm:pb-4 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-700"
              :style="{ background: currentMoodIconBg }">
              <component :is="currentMoodIcon" class="w-5 h-5 transition-all duration-700" :style="{ color: currentMoodIconColor }" />
            </div>
            <div>
              <h2 class="text-lg sm:text-xl font-quicksand font-bold text-white leading-tight">
                {{ step === 'select' ? 'Wie geht es dir gerade?' : (currentMood?.title ?? 'Notfall-Hilfe') }}
              </h2>
              <p class="text-xs mt-0.5" style="color:rgba(255,255,255,0.5)">
                {{ step === 'select' ? 'Wähle, was dich gerade am meisten beschreibt' : (currentMood?.subtitle ?? '') }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <button @click="toggleSound" class="p-2 rounded-full hover:bg-white/10 transition-colors">
              <component :is="soundEnabled ? Volume2Icon : VolumeXIcon" class="w-4 h-4" style="color:rgba(255,255,255,0.4)" />
            </button>
            <button @click="close" class="p-2 rounded-full hover:bg-white/10 transition-colors">
              <XIcon class="w-4 h-4" style="color:rgba(255,255,255,0.5)" />
            </button>
          </div>
        </div>

        <!-- ── STEP 1: Mood selection ── -->
        <Transition name="step-fade" mode="out-in">
          <div v-if="step === 'select'" key="select" class="overflow-y-auto flex-1 px-6 pb-8 sm:px-8 space-y-3 pt-1">

            <div class="grid grid-cols-2 gap-2.5">
              <button
                v-for="mood in moods" :key="mood.id"
                @click="selectMood(mood)"
                class="mood-card text-left px-4 py-3.5 rounded-2xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                :style="{ '--mood-color': mood.color, '--mood-bg': mood.cardBg }"
              >
                <div class="flex items-center gap-2.5 mb-1.5">
                  <div class="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                    :style="{ background: mood.color + '25' }">
                    <component :is="mood.iconComponent" class="w-3.5 h-3.5" :style="{ color: mood.color }" />
                  </div>
                  <p class="text-sm font-semibold text-white leading-tight">{{ mood.label }}</p>
                </div>
                <p class="text-xs pl-0.5" style="color:rgba(255,255,255,0.45)">{{ mood.sublabel }}</p>
              </button>
            </div>

            <!-- Hotline always visible -->
            <div class="rounded-2xl p-4 flex items-center gap-3 hotline-card">
              <div class="w-9 h-9 bg-red-500/90 rounded-xl flex items-center justify-center shrink-0">
                <PhoneIcon class="w-4 h-4 text-white" />
              </div>
              <div class="flex-1">
                <p class="text-xs font-medium uppercase tracking-wide mb-0.5" style="color:rgba(255,255,255,0.45)">Krisentelefon · 24/7 · kostenlos</p>
                <a href="tel:08001110111" class="text-xl font-quicksand font-bold text-white hover:text-red-300 transition-colors">0800 111 0 111</a>
              </div>
              <a href="tel:08001110111" class="w-9 h-9 bg-red-500/90 hover:bg-red-500 rounded-xl flex items-center justify-center transition-colors shrink-0">
                <PhoneCallIcon class="w-4 h-4 text-white" />
              </a>
            </div>

          </div>

          <!-- ── STEP 2: Personalized content ── -->
          <div v-else-if="step === 'content' && currentMood" key="content" class="overflow-y-auto flex-1 px-6 pb-8 sm:px-8 space-y-3 pt-1">

            <!-- Personal message -->
            <div class="rounded-2xl p-5 message-card" :style="{ borderColor: currentMood.color + '35' }">
              <p class="text-sm leading-[1.75]" style="color:rgba(255,255,255,0.88)">{{ currentMood.message }}</p>
            </div>

            <!-- Crisis hotline (elevated for suicidal) -->
            <div v-if="currentMood.showHotlineFirst" class="rounded-2xl p-4 flex items-center gap-4 hotline-prominent">
              <div class="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shrink-0">
                <PhoneIcon class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium uppercase tracking-wide text-red-400 mb-0.5">Krisentelefon · Jetzt anrufen</p>
                <a href="tel:08001110111" class="text-2xl font-quicksand font-bold text-white hover:text-red-300 transition-colors block leading-tight">0800 111 0 111</a>
              </div>
              <a href="tel:08001110111" class="shrink-0 w-10 h-10 bg-red-500 hover:bg-red-600 transition-colors rounded-xl flex items-center justify-center">
                <PhoneCallIcon class="w-5 h-5 text-white" />
              </a>
            </div>

            <!-- Breathing exercise -->
            <div class="rounded-2xl p-4 section-card">
              <div class="flex items-center gap-2 mb-4">
                <WindIcon class="w-4 h-4" :style="{ color: currentMood.color }" />
                <p class="text-sm font-semibold text-white">{{ currentMood.breathingTitle }}</p>
                <button @click="toggleBreathing"
                  class="ml-auto text-xs px-3 py-1 rounded-full transition-all font-semibold"
                  :style="breathingActive
                    ? { background: currentMood.color + '35', color: currentMood.color }
                    : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)' }">
                  {{ breathingActive ? 'Stopp' : 'Start' }}
                </button>
              </div>
              <div class="flex flex-col items-center py-1">
                <div class="relative flex items-center justify-center mb-3" style="width:112px;height:112px">
                  <div class="absolute rounded-full border-2 transition-all duration-1000 ease-in-out" :style="breathingRingStyle" />
                  <div class="rounded-full border-2 flex items-center justify-center transition-all duration-1000 ease-in-out" :style="breathingCircleStyle">
                    <span class="text-xs font-bold select-none" :style="{ color: currentMood.color }">{{ breathingActive ? breathingCount : '·' }}</span>
                  </div>
                </div>
                <p class="text-sm font-medium text-center transition-all duration-500" style="color:rgba(255,255,255,0.65)">
                  {{ breathingActive ? breathingLabel : 'Drücke Start für eine Atemübung' }}
                </p>
              </div>
              <p class="text-xs text-center mt-3" style="color:rgba(255,255,255,0.3)">Einatmen 4s · Halten 7s · Ausatmen 8s</p>
            </div>

            <!-- Grounding -->
            <div class="rounded-2xl p-4 section-card">
              <div class="flex items-center gap-2 mb-3">
                <AnchorIcon class="w-4 h-4" :style="{ color: currentMood.color }" />
                <p class="text-sm font-semibold text-white">5-4-3-2-1 Erdung</p>
              </div>
              <div class="space-y-2.5">
                <div v-for="(gstep, i) in groundingSteps" :key="i"
                  class="flex items-start gap-3 cursor-pointer group" @click="toggleGrounding(i)">
                  <div class="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                    :style="groundingDone[i]
                      ? { background: currentMood.color, borderColor: currentMood.color }
                      : { borderColor: currentMood.color + '60' }">
                    <CheckIcon v-if="groundingDone[i]" class="w-3 h-3 text-white" />
                  </div>
                  <p class="text-sm transition-all duration-200 leading-snug"
                    :style="groundingDone[i] ? { color: 'rgba(255,255,255,0.25)', textDecoration: 'line-through' } : { color: 'rgba(255,255,255,0.72)' }">
                    <span class="font-semibold" :style="{ color: groundingDone[i] ? 'rgba(255,255,255,0.25)' : currentMood.color }">{{ gstep.num }}</span>
                    {{ gstep.text }}
                  </p>
                </div>
              </div>
            </div>

            <!-- What helps now — personalized, no emojis -->
            <div class="rounded-2xl p-4 section-card">
              <div class="flex items-center gap-2 mb-3">
                <component :is="currentMood.iconComponent" class="w-4 h-4" :style="{ color: currentMood.color }" />
                <p class="text-sm font-semibold text-white">Was gerade helfen kann</p>
              </div>
              <div class="space-y-3">
                <div v-for="(tip, i) in currentMood.tips" :key="i" class="flex gap-3">
                  <div class="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: currentMood.color }" />
                  <div>
                    <p class="text-sm font-semibold text-white leading-tight">{{ tip.title }}</p>
                    <p class="text-xs mt-0.5 leading-relaxed" style="color:rgba(255,255,255,0.5)">{{ tip.desc }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Resources — personalized -->
            <div class="rounded-2xl p-4 section-card">
              <div class="flex items-center gap-2 mb-3">
                <ExternalLinkIcon class="w-4 h-4" :style="{ color: currentMood.color }" />
                <p class="text-sm font-semibold text-white">Hilfsangebote</p>
              </div>
              <div class="space-y-2">
                <a v-for="(link, i) in currentMood.resources" :key="i"
                  :href="link.url" target="_blank" rel="noopener noreferrer"
                  class="flex items-center gap-3 rounded-xl p-3 transition-all group resource-row">
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all"
                    :style="{ background: currentMood.color + '20' }">
                    <component :is="link.icon" class="w-3.5 h-3.5" :style="{ color: currentMood.color }" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-white leading-tight truncate">{{ link.title }}</p>
                    <p class="text-xs truncate" style="color:rgba(255,255,255,0.4)">{{ link.subtitle }}</p>
                  </div>
                  <ArrowRightIcon class="w-3.5 h-3.5 shrink-0 transition-all group-hover:translate-x-0.5" style="color:rgba(255,255,255,0.25)" />
                </a>
              </div>
            </div>

            <!-- Hotline (always at bottom for non-suicidal) -->
            <div v-if="!currentMood.showHotlineFirst" class="rounded-2xl p-4 flex items-center gap-3 hotline-card">
              <div class="w-9 h-9 bg-red-500/90 rounded-xl flex items-center justify-center shrink-0">
                <PhoneIcon class="w-4 h-4 text-white" />
              </div>
              <div class="flex-1">
                <p class="text-xs font-medium uppercase tracking-wide mb-0.5" style="color:rgba(255,255,255,0.4)">Krisentelefon · 24/7 · kostenlos</p>
                <a href="tel:08001110111" class="text-xl font-quicksand font-bold text-white hover:text-red-300 transition-colors">0800 111 0 111</a>
              </div>
              <a href="tel:08001110111" class="w-9 h-9 bg-red-500/90 hover:bg-red-500 rounded-xl flex items-center justify-center transition-colors shrink-0">
                <PhoneCallIcon class="w-4 h-4 text-white" />
              </a>
            </div>

            <!-- Back -->
            <button @click="goBack"
              class="w-full py-2.5 rounded-2xl text-sm transition-all hover:bg-white/8"
              style="color:rgba(255,255,255,0.3); background:rgba(255,255,255,0.04)">
              ← Andere Stimmung wählen
            </button>

          </div>
        </Transition>
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
  ArrowRight as ArrowRightIcon,
  HeartPulse as HeartPulseIcon,
  Zap as ZapIcon,
  CloudRain as CloudRainIcon,
  AlertCircle as AlertCircleIcon,
  Flame as FlameIcon,
  Brain as BrainIcon,
  MessageCircle as MessageCircleIcon,
  Globe as GlobeIcon,
  Volume2 as Volume2Icon,
  VolumeX as VolumeXIcon,
  ShieldAlert as ShieldAlertIcon,
} from 'lucide-vue-next'

const isOpen        = ref(false)
const step          = ref('select')
const selectedMoodId = ref(null)
const soundEnabled  = ref(true)
const groundingDone = ref([false, false, false, false, false])

// ── Ambient Audio ──────────────────────────────────────────────────────────
let audioCtx    = null
let gainNode    = null
let oscillators = []

function createAmbientTone(moodId) {
  if (!soundEnabled.value) return
  stopAmbientTone()
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    gainNode = audioCtx.createGain()
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.035, audioCtx.currentTime + 2.5)
    gainNode.connect(audioCtx.destination)
    const configs = {
      anxiety:    [{ freq: 174, type: 'sine' }, { freq: 285, type: 'sine' }],
      fear:       [{ freq: 396, type: 'sine' }, { freq: 198, type: 'sine' }],
      stress:     [{ freq: 528, type: 'sine' }, { freq: 264, type: 'sine' }],
      depression: [{ freq: 639, type: 'sine' }, { freq: 319.5, type: 'sine' }],
      suicidal:   [{ freq: 432, type: 'sine' }, { freq: 216, type: 'sine' }],
      anger:      [{ freq: 741, type: 'sine' }, { freq: 370.5, type: 'sine' }],
    }
    const tones = configs[moodId] ?? configs.anxiety
    oscillators = tones.map(({ freq, type }) => {
      const osc     = audioCtx.createOscillator()
      const oscGain = audioCtx.createGain()
      oscGain.gain.setValueAtTime(1 / tones.length, audioCtx.currentTime)
      osc.type = type
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
      osc.connect(oscGain)
      oscGain.connect(gainNode)
      osc.start()
      return osc
    })
  } catch (_) {}
}

function stopAmbientTone() {
  try {
    if (gainNode && audioCtx) {
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1)
      const ctx  = audioCtx
      const oscs = [...oscillators]
      setTimeout(() => { oscs.forEach(o => { try { o.stop() } catch (_) {} }); try { ctx.close() } catch (_) {} }, 1200)
      oscillators = []; gainNode = null; audioCtx = null
    }
  } catch (_) {}
}

function toggleSound() {
  soundEnabled.value = !soundEnabled.value
  soundEnabled.value ? createAmbientTone(selectedMoodId.value) : stopAmbientTone()
}

// ── Mood definitions ───────────────────────────────────────────────────────
const moods = [
  {
    id: 'anxiety',
    label: 'Angst & Panik',
    sublabel: 'Herzklopfen, Benommenheit, Enge',
    color: '#60a5fa',
    cardBg: 'rgba(96,165,250,0.1)',
    title: 'Angst & Panik',
    subtitle: 'Du bist sicher — das geht vorbei',
    iconComponent: ZapIcon,
    iconBg: 'rgba(96,165,250,0.18)',
    iconColor: '#60a5fa',
    gradient: 'linear-gradient(90deg,#3b82f6,#60a5fa,#93c5fd)',
    orb1: 'radial-gradient(circle,rgba(59,130,246,0.35) 0%,transparent 70%)',
    orb2: 'radial-gradient(circle,rgba(147,197,253,0.18) 0%,transparent 70%)',
    message: 'Was du gerade erlebst, fühlt sich bedrohlich an — aber dein Körper sendet einen Fehlalarm. Dein Herz rast, deine Atmung ist flach, vielleicht zitterst du. Das sind normale Körperreaktionen auf wahrgenommene Gefahr. Du bist gerade in Sicherheit. Dieser Zustand wird nachlassen.',
    breathingTitle: 'Atemübung zur Paniklinderung',
    showHotlineFirst: false,
    tips: [
      { title: 'Bleib im Hier und Jetzt', desc: 'Angst lebt in der Zukunft. Richte deine Aufmerksamkeit auf das, was du gerade physisch wahrnimmst — die Temperatur deiner Hände, den Stuhl unter dir.' },
      { title: 'Kälte als Anker nutzen', desc: 'Halte eiskaltes Wasser an deine Handgelenke oder ins Gesicht. Die Kälte aktiviert den Tauchreflex und senkt deinen Puls innerhalb von Sekunden.' },
      { title: 'Nicht dagegen ankämpfen', desc: 'Panikattacken enden immer — der Körper kann diesen Zustand nicht aufrechterhalten. Akzeptiere das Gefühl, anstatt es zu bekämpfen: das verkürzt die Dauer.' },
      { title: 'Einen sicheren Satz wiederholen', desc: 'Sage leise: „Ich bin sicher. Das geht vorbei. Ich habe das schon überstanden." Wiederholung beruhigt das Nervensystem.' },
    ],
    resources: [
      { title: 'Telefonseelsorge', subtitle: 'Kostenlos, anonym, 24/7 erreichbar', url: 'https://www.telefonseelsorge.de', icon: PhoneIcon },
      { title: 'Angststörungen Selbsthilfe', subtitle: 'Deutsche Angst-Hilfe e.V.', url: 'https://www.deutsche-angst-hilfe.de', icon: BrainIcon },
      { title: 'Online-Beratung', subtitle: 'Chat & E-Mail · online.telefonseelsorge.de', url: 'https://online.telefonseelsorge.de', icon: MessageCircleIcon },
      { title: 'Selfapy', subtitle: 'Strukturierte Online-Therapie bei Angst', url: 'https://selfapy.com', icon: GlobeIcon },
    ],
  },
  {
    id: 'stress',
    label: 'Stress & Überforderung',
    sublabel: 'Erschöpft, überfordert, überwältigt',
    color: '#f97316',
    cardBg: 'rgba(249,115,22,0.1)',
    title: 'Stress & Überforderung',
    subtitle: 'Komm einen Moment zur Ruhe',
    iconComponent: FlameIcon,
    iconBg: 'rgba(249,115,22,0.18)',
    iconColor: '#f97316',
    gradient: 'linear-gradient(90deg,#ea580c,#f97316,#fb923c)',
    orb1: 'radial-gradient(circle,rgba(234,88,12,0.3) 0%,transparent 70%)',
    orb2: 'radial-gradient(circle,rgba(251,146,60,0.18) 0%,transparent 70%)',
    message: 'Du trägst gerade zu viel — und dein Körper und Geist laufen auf Hochtouren. Stress ist keine Schwäche, er entsteht wenn Anforderungen und verfügbare Ressourcen nicht mehr im Gleichgewicht sind. Das ist menschlich. Du musst das nicht alleine bewältigen.',
    breathingTitle: 'Stressabbau-Atemübung',
    showHotlineFirst: false,
    tips: [
      { title: 'Eine einzige Aufgabe', desc: 'Stress entsteht oft durch die Summe aller Dinge gleichzeitig. Erlaube dir jetzt, nur das Allernächste zu sehen — alles andere existiert für diesen Moment nicht.' },
      { title: 'Den Körper entladen', desc: 'Stresshormone verlangen körperliche Entladung. Geh kurz raus, schüttele Arme und Beine 30 Sekunden locker, oder strecke dich ausgiebig.' },
      { title: 'Grenzen wahrnehmen', desc: 'Stress ist häufig ein Signal, dass du dich zu lange über deine Grenzen hinaus gedehnt hast. Was könntest du heute delegieren, verschieben oder weglassen?' },
      { title: 'Schreiben, nicht grübeln', desc: 'Schreib auf Papier, was dich gerade konkret belastet. Das externalisiert den Druck und verschafft deinem Kopf buchstäblich Luft.' },
    ],
    resources: [
      { title: 'Telefonseelsorge', subtitle: 'Kostenlos, anonym, 24/7', url: 'https://www.telefonseelsorge.de', icon: PhoneIcon },
      { title: 'Burnout-Informationen', subtitle: 'Deutsche Depressionshilfe', url: 'https://www.deutsche-depressionshilfe.de/burnout', icon: BrainIcon },
      { title: 'HelloBetter', subtitle: 'Online-Programm bei Stress & Burnout', url: 'https://hellobetter.de', icon: GlobeIcon },
      { title: 'Online-Beratung', subtitle: 'Chat & E-Mail · online.telefonseelsorge.de', url: 'https://online.telefonseelsorge.de', icon: MessageCircleIcon },
    ],
  },
  {
    id: 'depression',
    label: 'Schwermut & Traurigkeit',
    sublabel: 'Leere, Antriebslosigkeit, Hoffnungslosigkeit',
    color: '#a78bfa',
    cardBg: 'rgba(167,139,250,0.1)',
    title: 'Schwermut & Depression',
    subtitle: 'Deine Gefühle haben Gewicht — und Gültigkeit',
    iconComponent: CloudRainIcon,
    iconBg: 'rgba(167,139,250,0.18)',
    iconColor: '#a78bfa',
    gradient: 'linear-gradient(90deg,#7c3aed,#a78bfa,#c4b5fd)',
    orb1: 'radial-gradient(circle,rgba(124,58,237,0.3) 0%,transparent 70%)',
    orb2: 'radial-gradient(circle,rgba(196,181,253,0.18) 0%,transparent 70%)',
    message: 'Die Schwere, die du gerade fühlst, ist real. Wenn Traurigkeit oder innere Leere sich festsetzen, liegt das nicht an mangelnder Willenskraft — es ist eine Erkrankung wie jede andere, die Behandlung verdient und auf Behandlung anspricht. Dass du dir gerade Hilfe suchst, ist bereits ein mutiger Schritt.',
    breathingTitle: 'Sanfte Aktivierungsatmung',
    showHotlineFirst: false,
    tips: [
      { title: 'Kleine Schritte zählen', desc: 'Wenn alles schwer fällt, ist aufstehen und trinken schon ein Erfolg. Erwarte nicht das Volle von dir — jede noch so kleine Handlung ist eine Leistung.' },
      { title: 'Licht und Bewegung', desc: 'Tageslicht und sanfte Bewegung haben nachgewiesene antidepressive Wirkung, auch wenn beides schwerfällt. Schon 10 Minuten draußen können die Stimmung messbar heben.' },
      { title: 'Verbindung aufrechterhalten', desc: 'Depression drängt zur Isolation, obwohl Verbindung das ist, was am meisten hilft. Schreibe einer Person, der du vertraust — ein kurzes Hallo reicht.' },
      { title: 'Professionelle Hilfe ist der richtige Weg', desc: 'Depressionen sind gut behandelbar — mit Therapie, manchmal Medikamenten, oft beidem. Ein Erstgespräch beim Hausarzt oder einer psychiatrischen Ambulanz ist der erste Schritt.' },
    ],
    resources: [
      { title: 'Deutsche Depressionshilfe', subtitle: 'Informationen, Selbsttests, Therapiefinder', url: 'https://www.deutsche-depressionshilfe.de', icon: BrainIcon },
      { title: 'Telefonseelsorge', subtitle: '0800 111 0 111 · kostenlos & anonym', url: 'https://www.telefonseelsorge.de', icon: PhoneIcon },
      { title: 'HelloBetter Depression', subtitle: 'Klinisch geprüftes Online-Programm', url: 'https://hellobetter.de', icon: GlobeIcon },
      { title: 'Psychiatrische Soforthilfe', subtitle: 'Nächste psychiatrische Notaufnahme finden', url: 'https://www.google.com/search?q=psychiatrische+notaufnahme+in+meiner+nähe', icon: ShieldAlertIcon },
    ],
  },
  {
    id: 'fear',
    label: 'Schock & Erstarrung',
    sublabel: 'Zittern, Taubheit, Erstarren',
    color: '#34d399',
    cardBg: 'rgba(52,211,153,0.1)',
    title: 'Schock & Erstarrung',
    subtitle: 'Du bist in Sicherheit',
    iconComponent: AlertCircleIcon,
    iconBg: 'rgba(52,211,153,0.18)',
    iconColor: '#34d399',
    gradient: 'linear-gradient(90deg,#059669,#34d399,#6ee7b7)',
    orb1: 'radial-gradient(circle,rgba(5,150,105,0.3) 0%,transparent 70%)',
    orb2: 'radial-gradient(circle,rgba(110,231,183,0.18) 0%,transparent 70%)',
    message: 'Erstarrung, Taubheit oder Zittern nach einem erschreckenden Erlebnis ist eine normale, automatische Schutzreaktion deines Nervensystems. Dein Körper hat sich gerade um dich gesorgt. Du musst jetzt nichts tun — außer zu atmen und zu registrieren, dass du in Sicherheit bist.',
    breathingTitle: 'Beruhigungs- und Sicherheitsatmung',
    showHotlineFirst: false,
    tips: [
      { title: 'Sicherheit verankern', desc: 'Sage laut oder in Gedanken: wo du gerade bist, was heute für ein Tag ist, und dass du sicher bist. Das orientiert das Gehirn neu nach einem Schock.' },
      { title: 'Körper aufwärmen', desc: 'Schock kühlt den Körper aus. Decke dich zu, halte warme Hände um eine Tasse, oder reibe deine Unterarme — Wärme signalisiert deinem Nervensystem: Gefahr vorbei.' },
      { title: 'Langsam bewegen', desc: 'Sehr langsame, absichtliche Bewegungen — Hände öffnen und schließen, Füße am Boden rollen — helfen das Nervensystem aus dem Schockzustand zu lösen.' },
      { title: 'Nicht allein bleiben', desc: 'Bitte jemanden bei dir zu sein, auch wenn du nicht reden möchtest. Physische Anwesenheit eines anderen Menschen reguliert das Nervensystem wirksam.' },
    ],
    resources: [
      { title: 'Telefonseelsorge', subtitle: 'Kostenlos, anonym, 24/7', url: 'https://www.telefonseelsorge.de', icon: PhoneIcon },
      { title: 'Traumahilfe', subtitle: 'Informationen & Beratung bei Trauma', url: 'https://www.traumahilfe.de', icon: BrainIcon },
      { title: 'Online-Krisenberatung', subtitle: 'online.telefonseelsorge.de', url: 'https://online.telefonseelsorge.de', icon: MessageCircleIcon },
    ],
  },
  {
    id: 'suicidal',
    label: 'Suizidgedanken',
    sublabel: 'Hoffnungslosigkeit, kein Ausweg sichtbar',
    color: '#f87171',
    cardBg: 'rgba(248,113,113,0.12)',
    title: 'Du bist nicht allein',
    subtitle: 'Bitte ruf jetzt an — Menschen warten',
    iconComponent: HeartPulseIcon,
    iconBg: 'rgba(248,113,113,0.22)',
    iconColor: '#f87171',
    gradient: 'linear-gradient(90deg,#dc2626,#f87171,#fca5a5)',
    orb1: 'radial-gradient(circle,rgba(220,38,38,0.4) 0%,transparent 70%)',
    orb2: 'radial-gradient(circle,rgba(252,165,165,0.18) 0%,transparent 70%)',
    message: 'Ich bin froh, dass du hier bist. Suizidgedanken entstehen, wenn der Schmerz größer ist als die Ressourcen, die man gerade hat, um damit umzugehen — nicht weil es keinen Ausweg gibt. Du bist krank, nicht schwach. Und dieser Schmerz kann behandelt werden. Bitte ruf jetzt die Krisenhotline an — die Person am Telefon ist ausgebildet genau dafür.',
    breathingTitle: 'Erdende Atemübung',
    showHotlineFirst: true,
    tips: [
      { title: 'Jetzt anrufen', desc: 'Die Telefonseelsorge ist kostenlos, anonym und rund um die Uhr besetzt: 0800 111 0 111 oder 0800 111 0 222. Du musst nichts erklären — einfach sprechen.' },
      { title: 'Bei jemandem sein', desc: 'Gehe zu einer Person, der du vertraust — auch ohne Worte. Allein zu sein ist gerade nicht sicher für dich. Nähe hilft.' },
      { title: 'Zugang zu Mitteln begrenzen', desc: 'Bring dich von Dingen weg, die dir schaden könnten. Gehe in einen anderen Raum, ruf jemanden an, gehe nach draußen.' },
      { title: 'Notaufnahme ist immer eine Option', desc: 'Jede psychiatrische Notaufnahme ist rund um die Uhr geöffnet. Du wirst dort ohne Vorwurf empfangen — genau für Momente wie diesen.' },
    ],
    resources: [
      { title: 'Telefonseelsorge — jetzt anrufen', subtitle: '0800 111 0 111 · kostenlos, anonym, 24/7', url: 'tel:08001110111', icon: PhoneIcon },
      { title: 'Zweite Leitung', subtitle: '0800 111 0 222 · kostenlos, anonym, 24/7', url: 'tel:08001110222', icon: PhoneIcon },
      { title: 'Online-Krisenberatung', subtitle: 'Sofort-Chat · online.telefonseelsorge.de', url: 'https://online.telefonseelsorge.de', icon: MessageCircleIcon },
      { title: 'Psychiatrische Notaufnahme', subtitle: 'Nächste Klinik finden', url: 'https://www.google.com/search?q=psychiatrische+notaufnahme+in+meiner+nähe', icon: ShieldAlertIcon },
    ],
  },
  {
    id: 'anger',
    label: 'Wut & Kontrollverlust',
    sublabel: 'Aggression, unkontrollierbare Impulse',
    color: '#fb923c',
    cardBg: 'rgba(251,146,60,0.1)',
    title: 'Wut & Kontrollverlust',
    subtitle: 'Deine Wut hat einen Grund',
    iconComponent: FlameIcon,
    iconBg: 'rgba(251,146,60,0.18)',
    iconColor: '#fb923c',
    gradient: 'linear-gradient(90deg,#c2410c,#fb923c,#fdba74)',
    orb1: 'radial-gradient(circle,rgba(194,65,12,0.35) 0%,transparent 70%)',
    orb2: 'radial-gradient(circle,rgba(253,186,116,0.18) 0%,transparent 70%)',
    message: 'Wut ist ein Signal, dass eine wichtige Grenze verletzt wurde — oder dass du dich ohnmächtig, verletzt oder unfair behandelt fühlst. Sie ist nicht per se falsch. Aber sie kann sich so aufstauen, dass Handlungen entstehen, die du bereust. Lass uns die Energie zunächst sicher entladen.',
    breathingTitle: 'Entladungs-Atemübung',
    showHotlineFirst: false,
    tips: [
      { title: 'Körper zuerst entladen', desc: 'Wut ist körperliche Energie. Auf ein Kissen schlagen, Beine stampfen, intensiv laufen — das baut Stresshormone ab, bevor sie in Worte oder Handlungen münden.' },
      { title: 'Abstand schaffen', desc: 'Verlasse für mindestens 10 Minuten die Situation. Wut braucht Raum, keinen Auslöser. Was auf dem Höhepunkt gesagt wird, wird oft bereut.' },
      { title: 'Den Kern benennen', desc: 'Unter fast jeder Wut liegt etwas Verwundbareres — Schmerz, Angst, Enttäuschung, das Gefühl nicht gesehen zu werden. Schreib auf: Was hat mich wirklich getroffen?' },
      { title: 'Professionell begleiten lassen', desc: 'Wenn Wut sich regelmäßig unkontrollierbar anfühlt, ist das keine Charakterschwäche — es gibt wirksame therapeutische Ansätze, die konkret helfen.' },
    ],
    resources: [
      { title: 'Online-Beratung', subtitle: 'Chat & E-Mail · online.telefonseelsorge.de', url: 'https://online.telefonseelsorge.de', icon: MessageCircleIcon },
      { title: 'Therapiefinder', subtitle: 'Therapeuten in deiner Nähe finden', url: 'https://www.therapie.de', icon: GlobeIcon },
      { title: 'Telefonseelsorge', subtitle: '0800 111 0 111 · kostenlos', url: 'https://www.telefonseelsorge.de', icon: PhoneIcon },
    ],
  },
]

// ── Computed ───────────────────────────────────────────────────────────────
const currentMood         = computed(() => moods.find(m => m.id === selectedMoodId.value) ?? null)
const currentMoodGradient = computed(() => currentMood.value?.gradient  ?? 'linear-gradient(90deg,#f43f5e,#fb7185,#f43f5e)')
const currentMoodOrb1     = computed(() => currentMood.value?.orb1      ?? 'radial-gradient(circle,rgba(244,63,94,0.25) 0%,transparent 70%)')
const currentMoodOrb2     = computed(() => currentMood.value?.orb2      ?? 'radial-gradient(circle,rgba(251,113,133,0.12) 0%,transparent 70%)')
const currentMoodIconBg   = computed(() => currentMood.value?.iconBg    ?? 'rgba(244,63,94,0.18)')
const currentMoodIconColor= computed(() => currentMood.value?.iconColor ?? '#f43f5e')
const currentMoodIcon     = computed(() => currentMood.value?.iconComponent ?? HeartPulseIcon)

// ── Actions ────────────────────────────────────────────────────────────────
function selectMood(mood) {
  selectedMoodId.value = mood.id
  step.value = 'content'
  groundingDone.value = [false, false, false, false, false]
  if (breathingActive.value) toggleBreathing()
  createAmbientTone(mood.id)
}

function goBack() {
  step.value = 'select'
  stopAmbientTone()
}

// ── Breathing ──────────────────────────────────────────────────────────────
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
  const expanding = breathingPhase.value !== 'exhale'
  const size  = expanding ? '80px' : '56px'
  const color = currentMood.value?.color ?? '#60a5fa'
  return `width:${size};height:${size};transition:width 1s ease,height 1s ease;border-color:${color}40;background:${color}12`
})

const breathingRingStyle = computed(() => {
  const expanding = breathingPhase.value !== 'exhale'
  const color = currentMood.value?.color ?? '#60a5fa'
  return `width:${expanding ? '112px' : '64px'};height:${expanding ? '112px' : '64px'};opacity:${breathingPhase.value === 'hold' ? '0.12' : '0.32'};transition:all 1s ease;border-color:${color}`
})

const phaseDurations = { inhale: 4, hold: 7, exhale: 8 }
const phaseOrder     = ['inhale', 'hold', 'exhale']

function runBreathing() {
  breathingCount.value = phaseDurations[breathingPhase.value]
  const tick = () => {
    breathingCount.value -= 1
    if (breathingCount.value <= 0) {
      breathingPhase.value = phaseOrder[(phaseOrder.indexOf(breathingPhase.value) + 1) % 3]
      if (breathingActive.value) runBreathing()
    } else { breathingTimer = setTimeout(tick, 1000) }
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
    runBreathing()
  }
}

// ── Grounding ──────────────────────────────────────────────────────────────
const groundingSteps = [
  { num: '5', text: 'Dinge, die du sehen kannst' },
  { num: '4', text: 'Dinge, die du berühren kannst' },
  { num: '3', text: 'Geräusche, die du hörst' },
  { num: '2', text: 'Dinge, die du riechen kannst' },
  { num: '1', text: 'Ding, das du schmecken kannst' },
]
function toggleGrounding(i) { groundingDone.value[i] = !groundingDone.value[i] }

// ── Open / Close ───────────────────────────────────────────────────────────
function open() {
  isOpen.value = true
  step.value   = 'select'
  selectedMoodId.value = null
  groundingDone.value  = [false, false, false, false, false]
}

function close() {
  isOpen.value = false
  if (breathingActive.value) toggleBreathing()
  stopAmbientTone()
}

onUnmounted(() => { clearTimeout(breathingTimer); stopAmbientTone() })
defineExpose({ open, close })
</script>

<style scoped>
.modal-glass {
  background: rgba(13, 13, 20, 0.88);
  backdrop-filter: blur(32px) saturate(1.4);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset;
}

.ambient-orb {
  position: absolute; border-radius: 50%; pointer-events: none;
  animation: orbFloat 9s ease-in-out infinite; transition: background 2.5s ease;
}
.orb-1 { width:650px; height:650px; top:-25%; left:-25%; opacity:0.55; }
.orb-2 { width:420px; height:420px; bottom:-5%; right:-15%; opacity:0.35; animation-delay:-4.5s; }
@keyframes orbFloat {
  0%,100% { transform: translateY(0) scale(1); }
  50%      { transform: translateY(-28px) scale(1.04); }
}

.mood-card {
  background: var(--mood-bg, rgba(255,255,255,0.05));
  border: 1px solid rgba(255,255,255,0.07);
}
.mood-card:hover {
  border-color: var(--mood-color);
  box-shadow: 0 0 0 1px var(--mood-color), 0 8px 28px rgba(0,0,0,0.35);
}

.section-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
}
.message-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid;
}
.hotline-card {
  background: rgba(239,68,68,0.09);
  border: 1px solid rgba(239,68,68,0.22);
}
.hotline-prominent {
  background: rgba(239,68,68,0.14);
  border: 1px solid rgba(239,68,68,0.38);
  box-shadow: 0 0 28px rgba(239,68,68,0.12);
}
.resource-row {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
}
.resource-row:hover { background: rgba(255,255,255,0.07); }

.step-fade-enter-active { transition: opacity .32s ease, transform .32s cubic-bezier(.34,1.1,.64,1); }
.step-fade-leave-active { transition: opacity .18s ease, transform .18s ease; }
.step-fade-enter-from   { opacity:0; transform:translateX(14px); }
.step-fade-leave-to     { opacity:0; transform:translateX(-14px); }

.modal-fade-enter-active { animation: modalUp .38s cubic-bezier(.34,1.1,.64,1); }
.modal-fade-leave-active { animation: modalDown .22s cubic-bezier(.4,0,1,1); }
@keyframes modalUp   { from{opacity:0;transform:translateY(36px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
@keyframes modalDown { from{opacity:1;transform:translateY(0) scale(1)} to{opacity:0;transform:translateY(36px) scale(.97)} }

.overflow-y-auto::-webkit-scrollbar       { width:3px; }
.overflow-y-auto::-webkit-scrollbar-track { background:transparent; }
.overflow-y-auto::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:2px; }
</style>
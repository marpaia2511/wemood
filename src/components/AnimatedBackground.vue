<template>
  <!--
    AnimatedBackground.vue
    16 emotionsbasierte Themes + Dark Mode + Accessible Mode.
    Jedes Theme: eigene Farben, Blob-Formen, Animationen.

    Quellen:
    - CSS @keyframes: https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes
    - CSS linear-gradient(): https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/linear-gradient
    - CSS radial-gradient(): https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient
    - CSS filter blur(): https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/blur
    - CSS border-radius: https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius
    - CSS transform: https://developer.mozilla.org/en-US/docs/Web/CSS/transform
    - Vue 3 v-for: https://vuejs.org/guide/essentials/list.html
    - Vue 3 computed(): https://vuejs.org/guide/essentials/computed.html
    - Vue 3 provide/inject: https://vuejs.org/guide/components/provide-inject.html
    - Tailwind CSS Colors: https://tailwindcss.com/docs/colors
  -->
  <div
      class="fixed inset-0 -z-10 overflow-hidden"
      :class="{ dark: darkMode, 'reduced-motion': reducedMotion }"
  >
    <div class="absolute inset-0 gradient" :class="'g-' + activeTheme" />
    <div
        v-for="blob in currentBlobs"
        :key="blob.id"
        class="absolute blob"
        :class="blob.cls"
        :style="blob.pos"
    />
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

const currentTheme = inject('currentTheme', 'default')
const darkMode = inject('darkMode', false)
const reducedMotion = inject('reducedMotion', false)
const activeTheme = computed(() => currentTheme.value || 'default')

const themes = {
  default: [
    { id: 1, cls: 'b-def-1', pos: { top: '5%', left: '8%' } },
    { id: 2, cls: 'b-def-2', pos: { top: '20%', right: '5%' } },
    { id: 3, cls: 'b-def-3', pos: { bottom: '8%', left: '20%' } },
    { id: 4, cls: 'b-def-4', pos: { bottom: '15%', right: '18%' } },
  ],
  joy: [
    { id: 1, cls: 'b-joy-1', pos: { top: '12%', left: '8%' } },
    { id: 2, cls: 'b-joy-2', pos: { top: '3%', right: '12%' } },
    { id: 3, cls: 'b-joy-3', pos: { bottom: '12%', left: '22%' } },
    { id: 4, cls: 'b-joy-4', pos: { bottom: '3%', right: '8%' } },
    { id: 5, cls: 'b-joy-5', pos: { top: '38%', left: '42%' } },
  ],
  trust: [
    { id: 1, cls: 'b-trust-1', pos: { top: '5%', left: '0%' } },
    { id: 2, cls: 'b-trust-2', pos: { top: '25%', right: '0%' } },
    { id: 3, cls: 'b-trust-3', pos: { bottom: '5%', left: '15%' } },
  ],
  anxiety: [
    { id: 1, cls: 'b-anx-1', pos: { top: '10%', left: '3%' } },
    { id: 2, cls: 'b-anx-2', pos: { top: '35%', right: '3%' } },
    { id: 3, cls: 'b-anx-3', pos: { bottom: '12%', left: '12%' } },
  ],
  surprise: [
    { id: 1, cls: 'b-sur-1', pos: { top: '12%', left: '12%' } },
    { id: 2, cls: 'b-sur-2', pos: { top: '5%', right: '12%' } },
    { id: 3, cls: 'b-sur-3', pos: { bottom: '12%', left: '28%' } },
  ],
  depression: [
    { id: 1, cls: 'b-dep-1', pos: { top: '18%', left: '5%' } },
    { id: 2, cls: 'b-dep-2', pos: { top: '22%', right: '8%' } },
    { id: 3, cls: 'b-dep-3', pos: { bottom: '0%', left: '22%' } },
  ],
  anger: [
    { id: 1, cls: 'b-ang-1', pos: { top: '5%', left: '3%' } },
    { id: 2, cls: 'b-ang-2', pos: { top: '3%', right: '5%' } },
    { id: 3, cls: 'b-ang-3', pos: { bottom: '8%', left: '15%' } },
  ],
  anticipation: [
    { id: 1, cls: 'b-ant-1', pos: { top: '10%', left: '3%' } },
    { id: 2, cls: 'b-ant-2', pos: { top: '5%', right: '5%' } },
    { id: 3, cls: 'b-ant-3', pos: { bottom: '10%', left: '18%' } },
  ],
  love: [
    { id: 1, cls: 'b-lov-1', pos: { top: '3%', left: '3%' } },
    { id: 2, cls: 'b-lov-2', pos: { top: '18%', right: '3%' } },
    { id: 3, cls: 'b-lov-3', pos: { bottom: '3%', left: '8%' } },
  ],
  resilience: [
    { id: 1, cls: 'b-res-1', pos: { bottom: '12%', left: '8%' } },
    { id: 2, cls: 'b-res-2', pos: { bottom: '8%', right: '10%' } },
    { id: 3, cls: 'b-res-3', pos: { bottom: '18%', left: '30%' } },
  ],
  gratitude: [
    { id: 1, cls: 'b-gra-1', pos: { top: '8%', left: '5%' } },
    { id: 2, cls: 'b-gra-2', pos: { top: '5%', right: '8%' } },
    { id: 3, cls: 'b-gra-3', pos: { bottom: '10%', left: '20%' } },
    { id: 4, cls: 'b-gra-4', pos: { bottom: '5%', right: '15%' } },
  ],
  mindfulness: [
    { id: 1, cls: 'b-min-1', pos: { top: '5%', left: '0%' } },
    { id: 2, cls: 'b-min-2', pos: { top: '30%', right: '0%' } },
    { id: 3, cls: 'b-min-3', pos: { bottom: '5%', left: '10%' } },
  ],
  focus: [
    { id: 1, cls: 'b-foc-1', pos: { top: '15%', left: '5%' } },
    { id: 2, cls: 'b-foc-2', pos: { bottom: '15%', right: '10%' } },
  ],
  sleep: [
    { id: 1, cls: 'b-slp-1', pos: { top: '5%', left: '3%' } },
    { id: 2, cls: 'b-slp-2', pos: { top: '25%', right: '3%' } },
    { id: 3, cls: 'b-slp-3', pos: { bottom: '5%', left: '15%' } },
  ],
  calm: [
    { id: 1, cls: 'b-cal-1', pos: { top: '5%', left: '0%' } },
    { id: 2, cls: 'b-cal-2', pos: { top: '30%', right: '0%' } },
    { id: 3, cls: 'b-cal-3', pos: { bottom: '5%', left: '10%' } },
  ],
  hope: [
    { id: 1, cls: 'b-hop-1', pos: { bottom: '12%', left: '8%' } },
    { id: 2, cls: 'b-hop-2', pos: { bottom: '8%', right: '10%' } },
    { id: 3, cls: 'b-hop-3', pos: { bottom: '18%', left: '30%' } },
  ],
}

const currentBlobs = computed(() => themes[activeTheme.value] || themes.default)
</script>

<style scoped>
@keyframes grd{
  0%{background-position:0% 0%}
  15%{background-position:50% 100%}
  30%{background-position:100% 30%}
  45%{background-position:20% 80%}
  60%{background-position:80% 10%}
  75%{background-position:40% 60%}
  100%{background-position:0% 0%}
}

/* ═══ THEME GRADIENTS ═══ */
.g-default{background:linear-gradient(135deg,#C4B5FD,#FDBA74,#DDD6FE,#FB923C,#A78BFA,#FED7AA);background-size:400% 400%;animation:grd 24s ease-in-out infinite}
.g-joy{background:linear-gradient(135deg,#FDE68A,#FDBA74,#FEF9C3,#FB923C,#FDE047);background-size:400% 400%;animation:grd 18s ease-in-out infinite}
.g-trust{background:linear-gradient(135deg,#5EEAD4,#7DD3FC,#6EE7B7,#67E8F9,#34D399);background-size:400% 400%;animation:grd 28s ease-in-out infinite}
.g-anxiety{background:linear-gradient(135deg,#A5B4FC,#C4B5FD,#93C5FD,#DDD6FE,#BAE6FD);background-size:400% 400%;animation:grd 26s ease-in-out infinite}
.g-surprise{background:linear-gradient(135deg,#FDE047,#F9A8D4,#FEF08A,#93C5FD,#FBBF24);background-size:400% 400%;animation:grd 16s ease-in-out infinite}
.g-depression{background:linear-gradient(135deg,#FDE68A,#6EE7B7,#FEF9C3,#A7F3D0,#FDE047);background-size:400% 400%;animation:grd 30s ease-in-out infinite}
.g-anger{background:linear-gradient(135deg,#FDA4AF,#FDBA74,#FECDD3,#FB923C,#F9A8D4);background-size:400% 400%;animation:grd 20s ease-in-out infinite}
.g-anticipation{background:linear-gradient(135deg,#FB923C,#FDE047,#C4B5FD,#F97316,#FACC15);background-size:400% 400%;animation:grd 20s ease-in-out infinite}
.g-love{background:linear-gradient(135deg,#F9A8D4,#FECDD3,#FDE68A,#FDA4AF,#FBCFE8);background-size:400% 400%;animation:grd 24s ease-in-out infinite}
.g-resilience{background:linear-gradient(135deg,#A7F3D0,#FDE68A,#D1FAE5,#FEF3C7,#6EE7B7);background-size:400% 400%;animation:grd 22s ease-in-out infinite}
.g-gratitude{background:linear-gradient(135deg,#FEF3C7,#FED7AA,#FDE68A,#FDBA74,#FEF9C3);background-size:400% 400%;animation:grd 22s ease-in-out infinite}
.g-mindfulness{background:linear-gradient(135deg,#A7F3D0,#99F6E4,#6EE7B7,#5EEAD4,#A7F3D0);background-size:400% 400%;animation:grd 32s ease-in-out infinite}
.g-focus{background:linear-gradient(135deg,#93C5FD,#FDBA74,#BAE6FD,#FED7AA,#A5B4FC);background-size:400% 400%;animation:grd 36s ease-in-out infinite}
.g-sleep{background:linear-gradient(135deg,#312E81,#1E1B4B,#4C1D95,#1E293B,#3730A3);background-size:400% 400%;animation:grd 40s ease-in-out infinite}
.g-calm{background:linear-gradient(135deg,#A7F3D0,#C4B5FD,#6EE7B7,#DDD6FE,#99F6E4);background-size:400% 400%;animation:grd 32s ease-in-out infinite}
.g-hope{background:linear-gradient(135deg,#A7F3D0,#FEF3C7,#99F6E4,#FDE68A,#6EE7B7);background-size:400% 400%;animation:grd 22s ease-in-out infinite}

/* ═══ DARK MODE GRADIENT OVERRIDES ═══ */
.dark .g-default{background:linear-gradient(135deg,#2E1065,#78350F,#1E1B4B,#9A3412,#3B0764,#92400E);background-size:400% 400%}
.dark .g-joy{background:linear-gradient(135deg,#78350F,#92400E,#713F12,#9A3412,#78350F);background-size:400% 400%}
.dark .g-trust{background:linear-gradient(135deg,#134E4A,#0C4A6E,#064E3B,#155E75,#115E59);background-size:400% 400%}
.dark .g-anxiety{background:linear-gradient(135deg,#1E1B4B,#2E1065,#1E3A5F,#312E81,#1E293B);background-size:400% 400%}
.dark .g-surprise{background:linear-gradient(135deg,#713F12,#831843,#78350F,#1E3A5F,#92400E);background-size:400% 400%}
.dark .g-depression{background:linear-gradient(135deg,#713F12,#064E3B,#78350F,#065F46,#713F12);background-size:400% 400%}
.dark .g-anger{background:linear-gradient(135deg,#881337,#78350F,#9F1239,#92400E,#831843);background-size:400% 400%}
.dark .g-anticipation{background:linear-gradient(135deg,#9A3412,#713F12,#2E1065,#92400E,#78350F);background-size:400% 400%}
.dark .g-love{background:linear-gradient(135deg,#831843,#881337,#78350F,#9F1239,#831843);background-size:400% 400%}
.dark .g-resilience{background:linear-gradient(135deg,#064E3B,#713F12,#065F46,#78350F,#115E59);background-size:400% 400%}
.dark .g-gratitude{background:linear-gradient(135deg,#78350F,#92400E,#713F12,#9A3412,#78350F);background-size:400% 400%}
.dark .g-mindfulness{background:linear-gradient(135deg,#064E3B,#134E4A,#065F46,#115E59,#064E3B);background-size:400% 400%}
.dark .g-focus{background:linear-gradient(135deg,#1E3A5F,#78350F,#1E1B4B,#92400E,#0C4A6E);background-size:400% 400%}
.dark .g-sleep{background:linear-gradient(135deg,#0F0A1E,#0C0A15,#1A0F36,#0F172A,#110D24);background-size:400% 400%}
.dark .g-calm{background:linear-gradient(135deg,#065F46,#2E1065,#064E3B,#1E1B4B,#134E4A);background-size:400% 400%}
.dark .g-hope{background:linear-gradient(135deg,#065F46,#713F12,#115E59,#78350F,#064E3B);background-size:400% 400%}

/* ═══ REDUCED MOTION MODE ═══ */
.reduced-motion .blob{animation:none!important}
.reduced-motion .gradient{animation:none!important}

/* System-Einstellung: prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .blob{animation:none!important}
  .gradient{animation:none!important}
}

/* ═══ BLOB ANIMATIONS ═══ */

/* -- Default: drift + morph -- */
.b-def-1{width:450px;height:450px;background:radial-gradient(circle,#A78BFA,#7C3AED);filter:blur(50px);opacity:.55;animation:defM1 14s ease-in-out infinite,defD1 22s ease-in-out infinite}
.b-def-2{width:400px;height:400px;background:radial-gradient(circle,#FDBA74,#F97316);filter:blur(50px);opacity:.5;animation:defM2 16s ease-in-out infinite,defD2 20s ease-in-out infinite}
.b-def-3{width:380px;height:380px;background:radial-gradient(circle,#FED7AA,#FB923C);filter:blur(50px);opacity:.45;animation:defM1 18s ease-in-out infinite,defD3 24s ease-in-out infinite}
.b-def-4{width:340px;height:340px;background:radial-gradient(circle,#C4B5FD,#8B5CF6);filter:blur(50px);opacity:.5;animation:defM2 14s ease-in-out infinite,defD1 26s ease-in-out infinite reverse}
@keyframes defM1{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}25%{border-radius:30% 70% 60% 40%/40% 60% 30% 70%}50%{border-radius:50% 50% 40% 60%/50% 50% 60% 40%}75%{border-radius:40% 60% 50% 50%/60% 40% 50% 50%}}
@keyframes defM2{0%,100%{border-radius:40% 60% 60% 40%/50% 40% 60% 50%}33%{border-radius:60% 40% 40% 60%/40% 60% 50% 50%}66%{border-radius:50% 50% 50% 50%/60% 40% 40% 60%}}
@keyframes defD1{0%,100%{transform:translate(0,0) scale(1)}25%{transform:translate(50px,-40px) scale(1.05)}50%{transform:translate(-30px,45px) scale(.95)}75%{transform:translate(40px,20px) scale(1.02)}}
@keyframes defD2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-55px,35px) scale(1.08)}66%{transform:translate(40px,-45px) scale(.96)}}
@keyframes defD3{0%,100%{transform:translate(0,0)}50%{transform:translate(45px,-50px) scale(1.06)}}

/* -- Joy: pulse + bounce, many small blobs -- */
.b-joy-1{width:300px;height:300px;background:radial-gradient(circle,#FDE68A,#FACC15);filter:blur(40px);opacity:.6;animation:jP 5s ease-in-out infinite,jB1 10s ease-in-out infinite}
.b-joy-2{width:260px;height:260px;background:radial-gradient(circle,#FB923C,#EA580C);filter:blur(40px);opacity:.55;animation:jP 6s ease-in-out infinite .5s,jB2 12s ease-in-out infinite}
.b-joy-3{width:240px;height:240px;background:radial-gradient(circle,#FDE047,#FACC15);filter:blur(40px);opacity:.55;animation:jP 4.5s ease-in-out infinite 1s,jB3 9s ease-in-out infinite}
.b-joy-4{width:220px;height:220px;background:radial-gradient(circle,#FDBA74,#F97316);filter:blur(40px);opacity:.5;animation:jP 7s ease-in-out infinite 1.5s,jB1 13s ease-in-out infinite reverse}
.b-joy-5{width:180px;height:180px;background:radial-gradient(circle,#FEF9C3,#FDE68A);filter:blur(35px);opacity:.5;animation:jP 5s ease-in-out infinite 2s,jB2 10s ease-in-out infinite reverse}
@keyframes jP{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}
@keyframes jB1{0%,100%{translate:0 0}20%{translate:40px -50px}40%{translate:-20px 15px}60%{translate:50px -30px}80%{translate:-15px 40px}}
@keyframes jB2{0%,100%{translate:0 0}25%{translate:-50px -35px}50%{translate:25px 30px}75%{translate:-35px -50px}}
@keyframes jB3{0%,100%{translate:0 0}33%{translate:45px -25px}66%{translate:-30px 40px}}

/* -- Trust: breathe + slow drift, large ovals -- */
.b-trust-1{width:550px;height:400px;background:radial-gradient(ellipse,#2DD4BF,#14B8A6);filter:blur(55px);opacity:.5;border-radius:50%;animation:tB 11s ease-in-out infinite,tD1 32s ease-in-out infinite}
.b-trust-2{width:500px;height:360px;background:radial-gradient(ellipse,#38BDF8,#0EA5E9);filter:blur(55px);opacity:.45;border-radius:50%;animation:tB 14s ease-in-out infinite 2s,tD2 38s ease-in-out infinite}
.b-trust-3{width:480px;height:340px;background:radial-gradient(ellipse,#34D399,#10B981);filter:blur(55px);opacity:.4;border-radius:50%;animation:tB 12s ease-in-out infinite 4s,tD3 35s ease-in-out infinite}
@keyframes tB{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
@keyframes tD1{0%,100%{translate:0 0}25%{translate:35px -20px}50%{translate:-25px 30px}75%{translate:20px -15px}}
@keyframes tD2{0%,100%{translate:0 0}50%{translate:-30px 25px}}
@keyframes tD3{0%,100%{translate:0 0}33%{translate:25px 20px}66%{translate:-20px -25px}}

/* -- Anxiety: soft wave, elongated -- */
.b-anx-1{width:500px;height:280px;background:radial-gradient(ellipse,#818CF8,#6366F1);filter:blur(50px);opacity:.5;animation:aW1 13s ease-in-out infinite,aF1 24s ease-in-out infinite}
.b-anx-2{width:460px;height:250px;background:radial-gradient(ellipse,#A78BFA,#8B5CF6);filter:blur(50px);opacity:.45;animation:aW2 16s ease-in-out infinite 2s,aF2 26s ease-in-out infinite}
.b-anx-3{width:420px;height:230px;background:radial-gradient(ellipse,#93C5FD,#60A5FA);filter:blur(50px);opacity:.4;animation:aW1 18s ease-in-out infinite 4s,aF3 30s ease-in-out infinite}
@keyframes aW1{0%,100%{border-radius:50% 50% 40% 60%/60% 40% 50% 50%;transform:scaleX(1) scaleY(1)}50%{border-radius:40% 60% 50% 50%/50% 50% 60% 40%;transform:scaleX(1.08) scaleY(.94)}}
@keyframes aW2{0%,100%{border-radius:45% 55% 55% 45%/55% 45% 45% 55%;transform:scaleY(1)}50%{border-radius:55% 45% 45% 55%/45% 55% 55% 45%;transform:scaleY(1.06) scaleX(.95)}}
@keyframes aF1{0%,100%{translate:0 0}25%{translate:20px -15px}50%{translate:-15px 20px}75%{translate:15px -10px}}
@keyframes aF2{0%,100%{translate:0 0}50%{translate:-25px 18px}}
@keyframes aF3{0%,100%{translate:0 0}33%{translate:18px 15px}66%{translate:-12px -18px}}

/* -- Surprise: burst pop -- */
.b-sur-1{width:350px;height:350px;background:radial-gradient(circle,#FDE68A,#FACC15);filter:blur(45px);opacity:.6;animation:sP 7s ease-in-out infinite,sM1 18s ease-in-out infinite}
.b-sur-2{width:320px;height:320px;background:radial-gradient(circle,#F472B6,#EC4899);filter:blur(45px);opacity:.55;animation:sP 8s ease-in-out infinite 1s,sM2 22s ease-in-out infinite}
.b-sur-3{width:280px;height:280px;background:radial-gradient(circle,#93C5FD,#60A5FA);filter:blur(45px);opacity:.5;animation:sP 7.5s ease-in-out infinite 2s,sM3 24s ease-in-out infinite}
@keyframes sP{0%,100%{transform:scale(1);opacity:.5}15%{transform:scale(1.35);opacity:.7}40%{transform:scale(1);opacity:.5}}
@keyframes sM1{0%,100%{translate:0 0}50%{translate:40px -30px}}
@keyframes sM2{0%,100%{translate:0 0}50%{translate:-35px 25px}}
@keyframes sM3{0%,100%{translate:0 0}50%{translate:25px 35px}}

/* -- Depression: upward rise -- */
.b-dep-1{width:420px;height:480px;background:radial-gradient(ellipse,#FDE047,#EAB308);filter:blur(55px);opacity:.45;border-radius:50% 50% 60% 40%/40% 50% 50% 60%;animation:dM 20s ease-in-out infinite,dR1 24s ease-in-out infinite}
.b-dep-2{width:380px;height:440px;background:radial-gradient(ellipse,#6EE7B7,#34D399);filter:blur(55px);opacity:.4;animation:dM 24s ease-in-out infinite 3s,dR2 26s ease-in-out infinite}
.b-dep-3{width:350px;height:400px;background:radial-gradient(ellipse,#FEF08A,#FDE047);filter:blur(55px);opacity:.35;animation:dM 26s ease-in-out infinite 6s,dR3 28s ease-in-out infinite}
@keyframes dM{0%,100%{border-radius:50% 50% 60% 40%/40% 50% 50% 60%}50%{border-radius:45% 55% 50% 50%/50% 45% 55% 50%}}
@keyframes dR1{0%,100%{translate:0 0;transform:scale(1)}50%{translate:15px -55px;transform:scale(1.05)}}
@keyframes dR2{0%,100%{translate:0 0;transform:scale(1)}50%{translate:-12px -60px;transform:scale(1.04)}}
@keyframes dR3{0%,100%{translate:0 0;transform:scale(1)}50%{translate:18px -45px;transform:scale(1.03)}}

/* -- Anger: breathe expand/contract -- */
.b-ang-1{width:420px;height:420px;background:radial-gradient(circle,#FDA4AF,#FB7185);filter:blur(48px);opacity:.6;animation:anB 8s ease-in-out infinite,anM1 22s ease-in-out infinite}
.b-ang-2{width:380px;height:380px;background:radial-gradient(circle,#FDBA74,#F97316);filter:blur(48px);opacity:.55;animation:anB 10s ease-in-out infinite 1.5s,anM2 24s ease-in-out infinite}
.b-ang-3{width:350px;height:350px;background:radial-gradient(circle,#FBCFE8,#F9A8D4);filter:blur(48px);opacity:.5;animation:anB 12s ease-in-out infinite 3s,anM3 26s ease-in-out infinite}
@keyframes anB{0%,100%{transform:scale(1)}25%{transform:scale(1.18)}50%{transform:scale(.92)}75%{transform:scale(1.08)}}
@keyframes anM1{0%,100%{translate:0 0}25%{translate:35px -20px}50%{translate:-20px 30px}75%{translate:25px 15px}}
@keyframes anM2{0%,100%{translate:0 0}50%{translate:-40px 20px}}
@keyframes anM3{0%,100%{translate:0 0}33%{translate:25px -25px}66%{translate:-20px 30px}}

/* -- Anticipation: forward glide -- */
.b-ant-1{width:440px;height:360px;background:radial-gradient(ellipse,#FB923C,#EA580C);filter:blur(50px);opacity:.55;border-radius:40% 60% 50% 50%/50% 40% 60% 50%;animation:antM 13s ease-in-out infinite,antF1 16s ease-in-out infinite}
.b-ant-2{width:400px;height:320px;background:radial-gradient(ellipse,#FBBF24,#D97706);filter:blur(50px);opacity:.5;animation:antM 16s ease-in-out infinite 2s,antF2 18s ease-in-out infinite}
.b-ant-3{width:360px;height:300px;background:radial-gradient(ellipse,#C4B5FD,#A78BFA);filter:blur(50px);opacity:.45;animation:antM 18s ease-in-out infinite 4s,antF3 22s ease-in-out infinite}
@keyframes antM{0%,100%{border-radius:40% 60% 50% 50%/50% 40% 60% 50%}50%{border-radius:50% 50% 40% 60%/60% 50% 50% 40%}}
@keyframes antF1{0%,100%{translate:0 0;transform:scale(1)}50%{translate:60px -25px;transform:scale(1.06)}}
@keyframes antF2{0%,100%{translate:0 0;transform:scale(1)}50%{translate:50px -35px;transform:scale(1.04)}}
@keyframes antF3{0%,100%{translate:0 0;transform:scale(1)}50%{translate:40px -20px;transform:scale(1.05)}}

/* -- Love: embrace pulse -- */
.b-lov-1{width:500px;height:460px;background:radial-gradient(ellipse,#FDA4AF,#F43F5E);filter:blur(55px);opacity:.5;animation:loP 11s ease-in-out infinite,loD1 30s ease-in-out infinite}
.b-lov-2{width:460px;height:420px;background:radial-gradient(ellipse,#F9A8D4,#EC4899);filter:blur(55px);opacity:.45;animation:loP 13s ease-in-out infinite 2s,loD2 32s ease-in-out infinite}
.b-lov-3{width:520px;height:280px;background:radial-gradient(ellipse,#FECDD3,#FDA4AF);filter:blur(55px);opacity:.4;border-radius:30% 70% 50% 50%/60% 40% 50% 50%;animation:loP 14s ease-in-out infinite 4s,loD3 34s ease-in-out infinite}
@keyframes loP{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
@keyframes loD1{0%,100%{translate:0 0}50%{translate:25px -20px}}
@keyframes loD2{0%,100%{translate:0 0}50%{translate:-20px 25px}}
@keyframes loD3{0%,100%{translate:0 0}50%{translate:15px 15px}}

/* -- Resilience: upward growth -- */
.b-res-1{width:400px;height:420px;background:radial-gradient(circle,#A7F3D0,#6EE7B7);filter:blur(50px);opacity:.5;animation:resP 13s ease-in-out infinite,resR1 18s ease-in-out infinite}
.b-res-2{width:360px;height:380px;background:radial-gradient(circle,#FDE68A,#FACC15);filter:blur(50px);opacity:.45;animation:resP 16s ease-in-out infinite 2s,resR2 22s ease-in-out infinite}
.b-res-3{width:320px;height:340px;background:radial-gradient(circle,#A7F3D0,#6EE7B7);filter:blur(50px);opacity:.42;animation:resP 14s ease-in-out infinite 4s,resR3 20s ease-in-out infinite}
@keyframes resP{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@keyframes resR1{0%,100%{translate:0 0}50%{translate:15px -50px}}
@keyframes resR2{0%,100%{translate:0 0}50%{translate:-10px -55px}}
@keyframes resR3{0%,100%{translate:0 0}50%{translate:12px -40px}}

/* -- Gratitude: shimmer grouped circles -- */
.b-gra-1{width:380px;height:380px;background:radial-gradient(circle,#FEF3C7,#FDE68A);filter:blur(48px);opacity:.55;animation:graS 14s ease-in-out infinite,graD1 22s ease-in-out infinite}
.b-gra-2{width:340px;height:340px;background:radial-gradient(circle,#FDBA74,#F97316);filter:blur(48px);opacity:.5;animation:graS 16s ease-in-out infinite 2s,graD2 24s ease-in-out infinite}
.b-gra-3{width:300px;height:300px;background:radial-gradient(circle,#FEF9C3,#FDE68A);filter:blur(48px);opacity:.48;animation:graS 12s ease-in-out infinite 4s,graD3 20s ease-in-out infinite}
.b-gra-4{width:260px;height:260px;background:radial-gradient(circle,#FCD34D,#FBBF24);filter:blur(45px);opacity:.45;animation:graS 18s ease-in-out infinite 1s,graD1 26s ease-in-out infinite reverse}
@keyframes graS{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.06);opacity:.58}}
@keyframes graD1{0%,100%{translate:0 0}25%{translate:20px -15px}50%{translate:-10px 20px}75%{translate:15px 10px}}
@keyframes graD2{0%,100%{translate:0 0}50%{translate:-25px 15px}}
@keyframes graD3{0%,100%{translate:0 0}33%{translate:15px -20px}66%{translate:-10px 15px}}

/* -- Mindfulness: slow horizontal wave -- */
.b-min-1{width:600px;height:300px;background:radial-gradient(ellipse,#6EE7B7,#10B981);filter:blur(65px);opacity:.42;border-radius:50%;animation:minW 20s ease-in-out infinite,minD1 40s ease-in-out infinite}
.b-min-2{width:560px;height:280px;background:radial-gradient(ellipse,#99F6E4,#2DD4BF);filter:blur(65px);opacity:.38;border-radius:50%;animation:minW 22s ease-in-out infinite 4s,minD2 44s ease-in-out infinite}
.b-min-3{width:520px;height:260px;background:radial-gradient(ellipse,#A7F3D0,#34D399);filter:blur(65px);opacity:.35;border-radius:50%;animation:minW 24s ease-in-out infinite 8s,minD3 42s ease-in-out infinite}
@keyframes minW{0%,100%{transform:scaleX(1) scaleY(1)}50%{transform:scaleX(1.06) scaleY(.96)}}
@keyframes minD1{0%,100%{translate:0 0}50%{translate:20px -5px}}
@keyframes minD2{0%,100%{translate:0 0}50%{translate:-15px 8px}}
@keyframes minD3{0%,100%{translate:0 0}50%{translate:10px 6px}}

/* -- Focus: few blobs, almost static -- */
.b-foc-1{width:480px;height:420px;background:radial-gradient(ellipse,#93C5FD,#3B82F6);filter:blur(58px);opacity:.4;animation:focD1 40s ease-in-out infinite}
.b-foc-2{width:400px;height:360px;background:radial-gradient(ellipse,#FDBA74,#F97316);filter:blur(58px);opacity:.35;animation:focD2 44s ease-in-out infinite}
@keyframes focD1{0%,100%{translate:0 0;transform:scale(1)}50%{translate:15px -10px;transform:scale(1.02)}}
@keyframes focD2{0%,100%{translate:0 0;transform:scale(1)}50%{translate:-10px 12px;transform:scale(1.02)}}

/* -- Sleep: very slow, large, soft -- */
.b-slp-1{width:550px;height:500px;background:radial-gradient(ellipse,#6366F1,#4338CA);filter:blur(70px);opacity:.35;animation:slpD1 50s ease-in-out infinite}
.b-slp-2{width:500px;height:450px;background:radial-gradient(ellipse,#818CF8,#6366F1);filter:blur(70px);opacity:.3;animation:slpD2 55s ease-in-out infinite}
.b-slp-3{width:460px;height:420px;background:radial-gradient(ellipse,#A78BFA,#7C3AED);filter:blur(70px);opacity:.25;animation:slpD3 48s ease-in-out infinite}
@keyframes slpD1{0%,100%{translate:0 0}50%{translate:10px -8px}}
@keyframes slpD2{0%,100%{translate:0 0}50%{translate:-8px 10px}}
@keyframes slpD3{0%,100%{translate:0 0}50%{translate:6px 6px}}

/* -- Calm: same as mindfulness but with lavender -- */
.b-cal-1{width:600px;height:350px;background:radial-gradient(ellipse,#6EE7B7,#10B981);filter:blur(65px);opacity:.42;border-radius:50%;animation:minW 20s ease-in-out infinite,minD1 36s ease-in-out infinite}
.b-cal-2{width:560px;height:320px;background:radial-gradient(ellipse,#A78BFA,#8B5CF6);filter:blur(65px);opacity:.38;border-radius:50%;animation:minW 22s ease-in-out infinite 4s,minD2 40s ease-in-out infinite}
.b-cal-3{width:520px;height:300px;background:radial-gradient(ellipse,#99F6E4,#2DD4BF);filter:blur(65px);opacity:.35;border-radius:50%;animation:minW 24s ease-in-out infinite 8s,minD3 38s ease-in-out infinite}

/* -- Hope: rising circles -- */
.b-hop-1{width:400px;height:420px;background:radial-gradient(circle,#A7F3D0,#6EE7B7);filter:blur(50px);opacity:.5;animation:resP 13s ease-in-out infinite,hopR1 18s ease-in-out infinite}
.b-hop-2{width:360px;height:380px;background:radial-gradient(circle,#FDE68A,#FACC15);filter:blur(50px);opacity:.45;animation:resP 16s ease-in-out infinite 2s,hopR2 22s ease-in-out infinite}
.b-hop-3{width:320px;height:340px;background:radial-gradient(circle,#2DD4BF,#14B8A6);filter:blur(50px);opacity:.42;animation:resP 14s ease-in-out infinite 4s,hopR3 24s ease-in-out infinite}
@keyframes hopR1{0%,100%{translate:0 0}50%{translate:20px -65px}}
@keyframes hopR2{0%,100%{translate:0 0}50%{translate:-15px -70px}}
@keyframes hopR3{0%,100%{translate:0 0}50%{translate:18px -55px}}

/* ═══ DARK MODE BLOB OVERRIDES ═══ */
.dark .blob{opacity:.3!important;filter:blur(60px)!important}
</style>
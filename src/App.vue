<template>
  <!--
    App.vue – Wurzel-Komponente.
    Stellt Theme, Dark Mode und Accessible Mode global bereit.

    Quellen:
    - Vue 3 Single File Components: https://vuejs.org/guide/scaling-up/sfc.html
    - Vue Router <router-view>: https://router.vuejs.org/guide/
    - Vue 3 provide/inject: https://vuejs.org/guide/components/provide-inject.html
  -->
  <div class="min-h-screen relative">
    <AnimatedBackground />
    <router-view @open-emergency="openEmergency" />
    <EmergencyModal ref="emergencyModal" />
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue'
import AnimatedBackground from './components/AnimatedBackground.vue'
import EmergencyModal from './components/EmergencyModal.vue'
import { useAuth } from './composables/useAuth.js'

const emergencyModal = ref(null)
const currentTheme = ref('default')
const darkMode = ref(false)
const reducedMotion = ref(false)

provide('currentTheme', currentTheme)
provide('darkMode', darkMode)
provide('reducedMotion', reducedMotion)

const { initAuth } = useAuth()

function openEmergency() {
  emergencyModal.value?.open()
}

// Restore session on every page load/refresh
onMounted(() => {
  initAuth()
})
</script>
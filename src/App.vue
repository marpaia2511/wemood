<template>
  <div class="min-h-screen relative">
    <AnimatedBackground />
    <router-view @open-emergency="openEmergency" />
    <EmergencyModal ref="emergencyModal" />
    <DynamicDesignToast @enabled="onDynamicEnabled" />
  </div>
</template>

<script setup>
import { ref, provide, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AnimatedBackground  from './components/AnimatedBackground.vue'
import EmergencyModal      from './components/EmergencyModal.vue'
import DynamicDesignToast  from './components/DynamicDesignToast.vue'
import { useAuth }         from './composables/useAuth.js'
import { useDynamicTheme } from './composables/useDynamicTheme.js'

const emergencyModal = ref(null)
const currentTheme   = ref('default')
const darkMode       = ref(false)
const reducedMotion  = ref(false)

provide('currentTheme', currentTheme)
provide('darkMode', darkMode)
provide('reducedMotion', reducedMotion)

const route = useRoute()
const { initAuth, isLoggedIn }                              = useAuth()
const { applyDynamicTheme, dynamicDesignEnabled }           = useDynamicTheme()

function openEmergency() {
  emergencyModal.value?.open()
}

async function tryApplyDynamic() {
  if (dynamicDesignEnabled.value && isLoggedIn.value) {
    await applyDynamicTheme(currentTheme)
  }
}

async function onDynamicEnabled() {
  await tryApplyDynamic()
}

onMounted(async () => {
  await initAuth()
  await tryApplyDynamic()
})

// Re-apply when user logs in mid-session
watch(isLoggedIn, async (loggedIn) => {
  if (loggedIn) await tryApplyDynamic()
})

// Re-apply when toggle changes in Settings
watch(dynamicDesignEnabled, async (enabled) => {
  if (enabled && isLoggedIn.value) {
    await applyDynamicTheme(currentTheme)
  } else if (!enabled) {
    currentTheme.value = 'default'
  }
})

// Re-apply whenever the user leaves an article page
// This means the theme updates as soon as they finish reading
watch(() => route.path, (newPath, oldPath) => {
  if (oldPath?.startsWith('/article/') && !newPath.startsWith('/article/')) {
    tryApplyDynamic()
  }
})
</script>
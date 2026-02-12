<template>
  <div class="min-h-screen bg-gray-100">
    <router-view @open-emergency="openEmergency" />
    <EmergencyModal ref="emergencyModal" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import EmergencyModal from './components/EmergencyModal.vue'

const emergencyModal = ref(null)

function openEmergency() {
  emergencyModal.value?.open()
}
</script>
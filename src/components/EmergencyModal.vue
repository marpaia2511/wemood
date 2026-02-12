<template>
  <!-- Notfall-Hilfe Modal: Wird in einer späteren Phase implementiert -->
  <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <!-- Hintergrund Overlay -->
    <div
        class="absolute inset-0 bg-black/50"
        @click="close"
    ></div>

    <!-- Modal Inhalt (Platzhalter) -->
    <div class="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 z-10">
      <button
          @click="close"
          class="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
      >
        <XIcon class="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
      </button>

      <div class="text-center py-8 sm:py-12">
        <p class="text-base sm:text-lg text-gray-500">
          Notfall-Hilfe Inhalte werden hier implementiert.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { X as XIcon } from 'lucide-vue-next'

const isOpen = ref(false)

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

defineExpose({ open, close })
</script>
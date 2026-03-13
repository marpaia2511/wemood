<template>
  <!--
    GradualBlur.vue – Sanfter Blur-Übergang am Rand eines Containers.

    Quellen:
    - vue-bits GradualBlur: https://vue-bits.dev/components/gradual-blur
    - CSS backdrop-filter: https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter
    - CSS mask-image: https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image
    - mathjs: https://mathjs.org/
  -->
  <div
      ref="containerRef"
      class="gradual-blur"
      :style="containerStyle"
  >
    <div class="relative w-full h-full">
      <div
          v-for="(div, index) in blurDivs"
          :key="index"
          class="absolute inset-0"
          :style="div.style"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import * as math from 'mathjs'

const props = defineProps({
  position: { type: String, default: 'bottom' },
  strength: { type: Number, default: 2 },
  height: { type: String, default: '6rem' },
  divCount: { type: Number, default: 5 },
  exponential: { type: Boolean, default: false },
  zIndex: { type: Number, default: 1000 },
  opacity: { type: Number, default: 1 },
  curve: { type: String, default: 'linear' },
  target: { type: String, default: 'parent' }
})

const containerRef = ref(null)

const CURVE_FUNCTIONS = {
  linear: p => p,
  bezier: p => p * p * (3 - 2 * p),
  'ease-in': p => p * p,
  'ease-out': p => 1 - Math.pow(1 - p, 2),
  'ease-in-out': p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
}

function getGradientDirection(position) {
  const directions = {
    top: 'to top',
    bottom: 'to bottom',
    left: 'to left',
    right: 'to right'
  }
  return directions[position] || 'to bottom'
}

const blurDivs = computed(() => {
  const divs = []
  const increment = 100 / props.divCount
  const curveFunc = CURVE_FUNCTIONS[props.curve] || CURVE_FUNCTIONS.linear

  for (let i = 1; i <= props.divCount; i++) {
    let progress = i / props.divCount
    progress = curveFunc(progress)

    let blurValue
    if (props.exponential) {
      blurValue = Number(math.pow(2, progress * 4)) * 0.0625 * props.strength
    } else {
      blurValue = 0.0625 * (progress * props.divCount + 1) * props.strength
    }

    const p1 = math.round((increment * i - increment) * 10) / 10
    const p2 = math.round(increment * i * 10) / 10
    const p3 = math.round((increment * i + increment) * 10) / 10
    const p4 = math.round((increment * i + increment * 2) * 10) / 10

    let gradient = `transparent ${p1}%, black ${p2}%`
    if (p3 <= 100) gradient += `, black ${p3}%`
    if (p4 <= 100) gradient += `, transparent ${p4}%`

    const direction = getGradientDirection(props.position)

    divs.push({
      style: {
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity: props.opacity
      }
    })
  }

  return divs
})

const containerStyle = computed(() => {
  const isVertical = ['top', 'bottom'].includes(props.position)
  const isPageTarget = props.target === 'page'

  const style = {
    position: isPageTarget ? 'fixed' : 'absolute',
    pointerEvents: 'none',
    zIndex: props.zIndex
  }

  if (isVertical) {
    style.height = props.height
    style.width = '100%'
    style[props.position] = '0'
    style.left = '0'
    style.right = '0'
  } else {
    style.width = props.height
    style.height = '100%'
    style[props.position] = '0'
    style.top = '0'
    style.bottom = '0'
  }

  return style
})
</script>
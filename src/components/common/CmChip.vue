<script setup lang="ts">
import type { typeVariant } from '@/typescript/enums/enums'

interface Props {/** ** Interface */
  prependIcon?: string
  className?: string
  color?: string
  bgColor?: string
  textColor?: string
  padding?: string
  borderRadius?: string
  height?: string
  variant?: typeof typeVariant[number]
}

const props = withDefaults(defineProps<Props>(), ({
  padding: '0 10px',
  height: 'auto',
}))

const prefixColor = computed(() => {
  if (props.variant === 'outlined' || props.variant === 'text')
    return 'color'

  return 'btn'
})
onMounted(() => {
  console.log('onMounted')
})
</script>

<template>
  <VChip
    :color="color"
    :class="[bgColor, className, textColor]"
    :style="{ padding, borderRadius, height }"
    :variant="variant"
    text-color="white"
    :prepend-icon="prependIcon"
  >
    <slot />
  </VChip>
</template>

<script setup lang="ts">
import type { typeVariant } from '@/typescript/enums/enums'

interface Props {/** ** Interface */
  prependIcon?: string
  className?: string
  color?: string
  bgColor?: string
  textColor?: string
  variant?: typeof typeVariant[number]
}

const props = withDefaults(defineProps<Props>(), ({
}))

const prefixColor = computed(() => {
  if (props.variant === 'outlined' || props.variant === 'text')
    return 'color'

  return 'btn'
})
</script>

<template>
  <VChip
    :color="color"
    :class="[bgColor, className, textColor]"
    :variant="variant"
    text-color="white"
    :prepend-icon="prependIcon"
  >
    <slot />
  </VChip>
</template>

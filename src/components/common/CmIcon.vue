<script setup lang="ts">
import type { typeVariant } from '@/typescript/enums/enums'

const propsValue = withDefaults(defineProps<Props>(), ({
  icon: 'fe:edit',
  color: 'primary',
  variant: 'tonal',
  tooltip: '',
  size: 16,
  padding: 4,
  bgColor: '',
  type: 1,
}))

const emit = defineEmits<Emit>()

/**
 *  color: màu của item
 *  icon: icon,
 *  size: kích thước
 *  bgColor: màu nền
 * }
 */

interface Props {
  color?: string
  icon?: string
  bgColor?: string
  tooltip?: string
  variant?: typeof typeVariant[number]
  size?: number
  type?: number
  padding?: any
}

interface Emit {
  (e: 'click'): void
}
const sizeIcon = computed(() => Number(propsValue.size))
</script>

<template>
  <span :title="tooltip">
    <VIcon
      v-if="type === 1"
      :icon="icon"
      :size="size"
      :color="color"
      variant="variant"
      @click="emit('click')"
    />
    <VBtn
      v-else
      :width="sizeIcon + padding * 2"
      :height="sizeIcon + padding * 2"
      :min-width="5"
      rounded
      :style="{ padding: `${padding}px` }"
      :variant="variant"
      :icon="icon"
      :color="bgColor"
      @click="emit('click')"
    >
      <template
        #default
      >
        <VIcon
          :icon="icon"
          :size="size"
          :color="color"
        />
      </template>
    </VBtn>
  </span>
</template>

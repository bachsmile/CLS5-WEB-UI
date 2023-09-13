<script setup lang="ts">
import type { colorType, densityType } from '@/typescript/enums/enums'

interface Props {/** ** Interface */
  rating?: number
  length: number
  emptyIcon?: string
  fullIcon?: string
  halfIcon?: string
  emptyColor?: string
  labelColor?: typeof colorType[any]
  fullColor?: string
  hover?: boolean
  disabled?: boolean
  sizeIcon?: any
  labels?: any[]
  halfIncrements?: boolean
  justifySpace?: boolean
  density?: typeof densityType[any]
  maxWidth?: number
  modelValue?: number
}

const props = withDefaults(defineProps<Props>(), ({
  rating: 0,
  length: 0,
  hover: false,
  halfIncrements: false,
  justifySpace: true,
  emptyColor: 'orange',
  fullColor: 'orange',
  fullIcon: 'tabler:star-filled',
  emptyIcon: 'tabler:star',
  halfIcon: 'tabler:star-half-filled',
  density: 'default',
  maxWidth: 700,
}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update:model-value', value: any): void
}
const ratingValue = ref()
function changeRating(val: any) {
  ratingValue.value = val
  emit('update:model-value', val)
}
</script>

<template>
  <VRating
    :model-value="modelValue"
    :empty-icon="emptyIcon"
    :full-icon="fullIcon"
    :half-icon="halfIcon"
    :half-increments="halfIncrements"
    :hover="hover"
    :color="fullColor"
    :item-labels="labels"
    item-label-position="bottom"
    :density="density"
    :style="{ width: '100%' }"
    :length="length"
    :disabled="disabled"
    :size="sizeIcon"
    class="d-flex rating-common"
    :class="{ 'justify-space-around': justifySpace }"
    @update:model-value="changeRating"
  >
    <template
      v-if="labels"
      #item-label="props"
    >
      <span
        class="text-rating "
        :class="`text-${labelColor}`"
        :style="{ maxWidth: `${(maxWidth / length) - 40}px` }"
        v-html="props.label"
      />
    </template>
    <template
      #item="{ icon, isFilled }"
    >
      <VIcon
        :icon="icon"
        :color="isFilled ? fullColor : emptyColor"
        :size="sizeIcon"
      />
    </template>
  </VRating>
</template>

<style lang="scss">
.rating-common > label:first-child {
  display: none;
}
.rating-common{
  .text-rating{
    white-space: pre-wrap;
  }
  .v-rating__item{
    label{
      display: flex;
    }
  }
}
</style>

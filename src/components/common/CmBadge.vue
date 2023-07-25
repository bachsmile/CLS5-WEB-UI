<script lang="ts" setup>
import type { Anchor } from '@/typescript/enums/enums'
import { SIZE_ICON_DEFAULT } from '@/constant/Globals'

interface Props {
  color?: string
  variant?: string
  location?: Anchor
  offsetX?: number | string
  offsetY?: number | string
  icon?: string
  sizeIcon?: number
}

/** ** Khởi tạo prop emit */
const props = withDefaults(defineProps<Props>(), ({
  color: '',
  variant: '',
  location: 'bottom right',
  sizeIcon: SIZE_ICON_DEFAULT,
}))
</script>

<template>
  <VBadge
    :color="color"
    :location="location"
    :offset-x="offsetX"
    :offset-y="offsetY"
  >
    <template
      #badge
    >
      <span
        class="custom-badge-content cursor-pointer "
      >
        <VIcon
          v-if="icon"
          :size="sizeIcon"
          :icon="icon"
          class="m-0"
        />
        <slot name="badge-content" />
      </span>
    </template>
    <slot />
  </VBadge>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;

.v-badge__badge {
  padding: 5px;
  border-radius: 50%;
  margin: 0;
  block-size: auto;
}

.v-badge__badge .v-icon {
  margin: 0 !important;
}
</style>

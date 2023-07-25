<script setup lang="ts">
import { DialogType } from '@/constant/data/notification.json'
import { SIZE_ICON_DEFAULT, typeDialog } from '@/constant/Globals'

const props = withDefaults(defineProps<Props>(), ({
  type: 0,
  variant: 'outlined',
  size: 0,
  justify: typeDialog,
}))

interface Props {
  type: number
  color?: string
  size?: number
  variant?: string
  icon?: string
  className?: string
  justify?: string
}

function checkTypeDialog(type: number) {
  return DialogType[type]
}
</script>

<template>
  <div
    class="d-flex"
    :class="[`justify-${justify}`]"
  >
    <div class="icon-noti">
      <VIcon
        :icon="icon || checkTypeDialog(type).icon"
        :variant="variant"
        :color="checkTypeDialog(type).color"
        :class="[className]"
        class="noti-zindex"
        :size="checkTypeDialog(type).size + size * 4"
      />
      <span
        class="ring1"
        :class="[`ring1-type-${type}`]"
        :style="`block-size: ${SIZE_ICON_DEFAULT + (size + 1) * 12}px; inline-size: ${SIZE_ICON_DEFAULT + (size + 1) * 12}px;`"
      />
      <span
        class="ring2"
        :style="`block-size: ${SIZE_ICON_DEFAULT + (size + 1) * 24}px; inline-size: ${SIZE_ICON_DEFAULT + (size + 1) * 24}px;`"
        :class="[`ring2-type-${type}`]"
      />
    </div>
  </div>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;
</style>

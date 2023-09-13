<script setup lang="ts">
import CmButton from './CmButton.vue'

interface Props {
  listItem: item[]
  color?: string
  modelValue: any
}
interface item {
  title?: string
  icon?: string
  colorClass?: string
  action?: any
  value: any
}

const propsValue = withDefaults(defineProps<Props>(), ({
  listItem: () => ([]),
  color: 'dark',
}))

function positionBorder(value: number) {
  if (value === 0)
    return 'button-group-prepend'

  if (value === propsValue.listItem.length - 1)
    return 'button-group-append'

  return 'button-group-default'
}
</script>

<template>
  <div class="d-flex flex-nowrap">
    <CmButton
      v-for="(item, index) in listItem"
      :key="index"
      :class="`${positionBorder(index)} button-group ${item.value === modelValue ? 'active' : ''}`"
      color="color"
      variant="outlined"
      @click="item?.action"
    >
      <span :class="`color-${color} font-weight-600`">
        <VIcon
          v-if="item.icon"
          :icon="item.icon"
          size="18"
        />
        <span
          v-if="item.title"
          class="ml-1"
        >{{ item.title }}</span>
      </span>
    </CmButton>
  </div>
</template>

<style lang="scss" scoped>
@use "/src/styles/style-global" as *;
.button-group {
  border: 1px solid $color-gray-300;

  background-color: $color-white;
  text-transform: unset;
  padding: 10px 12px !important;
}
.button-group-prepend {
  border-top-right-radius: unset !important;
  border-bottom-right-radius: unset!important;
  border-right: unset!important;
}

.button-group-append {
  border-top-left-radius: unset!important;
  border-bottom-left-radius: unset!important;
  // border-left: unset!important;
}

.button-group-default {
  border-radius: 0;
}

.active {
  background: $color-primary-300 !important;
}

// .button-group:focus {
//   background: $color-primary-100 !important;
// }
</style>

<script setup lang="ts">
import CmButton from './CmButton.vue'

interface Props {
  listItem: item[]
  color?: string
}
interface item {
  title?: string
  icon?: string
  colorClass?: string
  action?: any
}

const propsValue = withDefaults(defineProps<Props>(), ({
  listItem: () => ([]),
  color: 'dark',
}))

const positionBorder = (value: number) => {
  if (value === 0)
    return 'button-group-prepend'

  if (value === propsValue.listItem.length - 1)
    return 'button-group-append'

  return 'button-group-default'
}
</script>

<template>
  <CmButton
    v-for="(item, index) in listItem"
    :key="index"
    :class="`color-${color}-300 ${positionBorder(index)} button-group`"
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
</template>

<style lang="scss" scoped>
@use "/src/styles/style-global" as *;
.button-group {
  background-color: $color-white;
  text-transform: unset;
}
.button-group-prepend {
  border-top-right-radius: unset;
  border-bottom-right-radius: unset;
  border-right: unset;
}

.button-group-append {
  border-top-left-radius: unset;
  border-bottom-left-radius: unset;
  border-left: unset;
}

.button-group-default {
  border-radius: 0;
}

.active {
  background: $color-primary !important;
}

.button-group:focus {
  background: $color-primary-100 !important;
}
</style>

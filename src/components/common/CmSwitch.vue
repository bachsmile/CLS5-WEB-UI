<script setup lang="ts">
import CmButton from './CmButton.vue'

interface Props {
  listItem: item[]
  color?: string
  modelValue: any
  type?: any

  // type2
  label?: string
  trueValue?: any
  falseValue?: any
  hideSetails?: boolean
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
  type: 1,
  trueValue: true,
  falseValue: false,
  hideSetails: true,
}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update:model-value', value: any): void
}
function positionBorder(value: number) {
  if (value === 0)
    return 'button-group-prepend'

  if (value === propsValue.listItem.length - 1)
    return 'button-group-append'

  return 'button-group-default'
}
function changeValue(value: any) {
  emit('update:model-value', value)
}
</script>

<template>
  <div
    v-if="type === 1"
    class="d-flex flex-nowrap"
  >
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
  <div
    v-else
    class="d-flex align-center"
  >
    <div>
      <VSwitch
        :model-value="modelValue"
        :label="label"
        :color="color"
        :true-value="trueValue"
        :false-value="falseValue"
        :hide-details="hideSetails"
        @update:modelValue="changeValue"
      />
    </div>
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

<script setup lang="ts">
import { load } from '@/stores/loadComponent.js'
import type { typeVariant } from '@/typescript/enums/enums'

/*
  isLoad: boolean cho phép button loading hay không
  block: boolean
  text?: string tiêu đề button
  color?: string class màu của button gồm btn- hoặc color(nếu dùng variant outlined) cộng với tên màu, primary, error, warning, success, dark
  rounded?: string bo góc của button
  icon?: string
  variant?: string
  size?: string
  disabled?: boolean
*/

interface Props {
  title?: string
  isLoad?: boolean
  block?: boolean
  color?: string
  bgColor?: string
  rounded?: string | number | boolean
  icon?: string
  variant?: typeof typeVariant[number]
  size?: string
  textColor?: string
  disabled?: boolean
  className?: string
  positionIcon?: string
  colorIcon?: string
  sizeIcon?: number
}

const props = withDefaults(defineProps<Props>(), ({
  isLoad: false,
  block: false,
  disabled: false,
  color: 'primary',
  textColor: '',
  bgColor: '',
  className: '',
  variant: 'flat',
  positionIcon: '',
  size: 'default',
  sizeIcon: 14,
  rounded: 'lg',
}))

const emit = defineEmits<Emit>()
interface Emit {
  (e: 'click', idxBtn: number): void
}
const store = load()
const indexLoad = ref(0)
const { addComponent, loadComponent, unLoadComponent } = store
const { components } = storeToRefs(store)

onMounted(() => {
  addComponent()
  indexLoad.value = store.countComponent - 1
  components.value.push(false)
})

onBeforeUnmount(() => {
  if (components.value.length) {
    // components.value = []
    // store.$dispose()
  }
})

function unLoadButton() {
  unLoadComponent(indexLoad.value)
}

function handleClick() {
  if (props.isLoad)
    loadComponent(indexLoad.value)

  emit('click', indexLoad.value)
}

const isDisabled = computed(() => {
  return props.disabled
})

const outlined = computed(() => {
  if (props.variant === 'outlined')
    return `outlined-${props.color}`
  return ''
})

defineExpose({
  unLoadButton,
})
</script>

<template>
  <VBtn
    :loading="props.isLoad ? components[indexLoad] : false"
    :block="block"
    :disabled="isDisabled"
    :size="size"
    :variant="variant"
    :color="color"
    :rounded="rounded"
    class="text-style-btn"
    :class="[color, outlined, className, color === 'white' ? 'border-button' : '']"
    @click="handleClick"
  >
    <!-- :class="[`${prefixColor}-${color}`, bgColor, className]" -->
    <template
      v-if="$slots.prepend"
      #prepend
    >
      <slot name="prepend" />
    </template>

    <template
      #default
    >
      <div :class="[textColor]">
        <slot v-if="!title && !icon" />
        <span
          v-if="props.title || props.icon"
          class="d-flex align-items-center"
        >
          <VIcon
            v-if="props.icon"
            :icon="props.icon"
            :size="props.sizeIcon"
            :class="[props.colorIcon]"
          />
          <span
            v-if="props.title"
            :class="props.icon ? 'ml-1' : ''"
          >{{ title }}</span>
        </span>
      </div>
    </template>
    <template
      v-if="$slots.append"
      #append
    >
      <slot name="append" />
    </template>
  </VBtn>
</template>

<style lang="scss">
@use "/src/styles/style-global" as *;

.text-style-btn {
  border-radius: 8px;
  height: $button-default-height !important;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  padding: 10px 16px;
  text-transform: inherit;
  font-family: inherit;
}
// .text-button {
//   box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
// }
.outlined-success {
  border: 1px solid rgb(var(--v-success-300)) !important;
}
.outlined-error {
  border: 1px solid rgb(var(--v-error-300)) !important;
}
.outlined-primary {
  border: 1px solid rgb(var(--v-primary-300)) !important;
}
.outlined-secondary {
  border: 1px solid rgb(var(--v-gray-300)) !important;
}
.outlined-warning {
  border: 1px solid rgb(var(--v-warning-300)) !important;
}

.v-btn--variant-outlined {
  background-color: transparent !important;
}
.border-button{
  border: 1px solid rgb(var(--v-gray-300));
}
</style>

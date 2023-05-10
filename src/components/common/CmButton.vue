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
  rounded?: string
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
  variant: 'tonal',
  positionIcon: '',
  size: 'sm',
  sizeIcon: 14,
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

const unLoadButton = () => {
  unLoadComponent(indexLoad.value)
}

const handleClick = () => {
  if (props.isLoad)
    loadComponent(indexLoad.value)

  emit('click', indexLoad.value)
}

const isDisabled = computed(() => {
  return props.disabled
})

const prefixColor = computed(() => {
  if (props.variant === 'outlined' || props.variant === 'text')
    return 'color-bd'

  return 'btn'
})

const textButton = computed(() => {
  if (props.variant === 'text')
    return 'text-button'

  return ''
})

defineExpose({
  unLoadButton,
})
</script>

<template>
  <VBtn
    :loading="props.isLoad ? components[indexLoad] : false"
    :variant="props.variant"
    :block="block"
    :disabled="isDisabled"
    :size="size"
    :rounded="rounded"
    class="text-style-btn"
    :class="[`${prefixColor}-${color}`, bgColor, className, textButton]"
    @click="handleClick"
  >
    <template #prepend>
      <slot name="prepend" />
    </template>

    <template
      #default
    >
      <div :class="[textColor]">
        <slot v-if="!title && !icon" />
        <span v-if="props.title || props.icon">
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
    <template #append>
      <slot name="append" />
    </template>
  </VBtn>
</template>

<style lang="scss" scoped>
@use "/src/styles/style-global" as *;

.text-style-btn {
  border-radius: 8px;
  block-size: $button-default-height;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  padding-block: 10px;
  padding-inline: 16px;
  text-transform: inherit;
}
.text-button {
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
}
.v-btn--disabled.v-btn--variant-elevated {
  opacity: 0.9 !important
}
</style>

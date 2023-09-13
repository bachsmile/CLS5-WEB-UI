<script setup lang="ts">
import MethodsUtil from '@/utils/MethodsUtil'

interface Props {
  name: string
  value: any
  modelValue: any
  size?: number
  label?: any
  type?: number
  disabled?: boolean
}
interface Emit {
  (e: 'update:model-value', value: any): void
}
const props = withDefaults(defineProps<Props>(), ({
  size: 20,
  disabled: false,
}))

const emit = defineEmits<Emit>()

const selectedOption = ref(props.modelValue)
function change() {
  emit('update:model-value', selectedOption.value)
}
const idRandom = ref(MethodsUtil.createRandomId(10))
watch(() => props.modelValue, val => {
  selectedOption.value = val
}, { immediate: true })
</script>

<template>
  <div
    class="radio-item"
    :class="{ 'radio-item2': type === 1 }"
  >
    <input
      :id="`radio-${name}-${value}-${idRandom}`"
      v-model="selectedOption"
      type="radio"
      :name="name"
      :value="value"
      :style="`width: ${size}px; height: ${size}px`"
      :disabled="disabled"
      @change="change"
    >

    <label
      :class="{ disabled }"
      :for="`radio-${name}-${value}-${idRandom}`"
    >{{ label }}</label>
  </div>
</template>

<style lang="scss">
.radio-item {
  vertical-align: middle;
  display: flex;
  position: relative;
}

.radio-item input[type='radio'] {
  display: none;
}

.radio-item label {
  color: #666;
  font-weight: normal;
}

.radio-item label:before {
  content: " ";
  display: inline-block;
  position: relative;
  top: 5px;
  width: 20px;
  height: 20px;
  border-radius: 11px;
  border: 1px solid rgb(var(--v-gray-300)) !important;
  background-color: transparent;
}
.radio-item label.disabled:before {
  content: " ";
  display: inline-block;
  position: relative;
  top: 5px;
  width: 20px;
  height: 20px;
  border-radius: 11px;
  border: 2px solid rgb(var(--v-gray-300)) !important;
  background-color: rgb(var(--v-gray-100));
}
.radio-item input[type=radio]:checked + label.disabled:before {
  content: " ";
  display: inline-block;
  position: relative;
  top: 5px;
  margin: 0 5px 0 0;
  width: 20px;
  height: 20px;
  border-radius: 11px;
  border: 1px solid rgb(var(--v-primary-600)) !important;
  background-color: transparent;
}
.radio-item input[type=radio]:checked + label:before {
  content: " ";
  display: inline-block;
  position: relative;
  top: 5px;
  width: 20px;
  height: 20px;
  border-radius: 11px;
  border: 1px solid rgb(var(--v-primary-600)) !important;
  background-color: transparent;
}

.radio-item input[type=radio]:checked + label:after {
  border-radius: 11px;
  width: 12px;
  height: 12px;
  position: absolute;
  top: 9px;
  left: 4px;
  transform: translate(0%, 0%);
  content: " ";
  display: block;
  background: rgb(var(--v-primary-600)) !important;
}
.radio-item.radio-item2 input[type=radio]:checked + label:after {
  border-radius: 11px;
  width: 8px;
  height: 8px;
  position: absolute;
  top: 11px;
  left: 6px;
  transform: translate(0%, 0%);
  content: " ";
  display: block;
  background: rgb(var(--v-primary-600)) !important;
}
</style>

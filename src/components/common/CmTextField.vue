<script setup lang="ts">
import type { JSXComponent } from 'vue'
import constant from '@/constant/constant'

type IconValue = string | JSXComponent

const props = withDefaults(defineProps<Props>(), ({
  prependInnerIcon: '',
  label: '',
  bgColor: 'white',
  type: 'text',
  maxlength: constant.MAX_LENGTH_TEXT_FIELD,
  disabled: false,
}))

const emit = defineEmits<Emit>()
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

/** ** Interface */

interface Props {
  modelValue?: any
  prependInnerIcon?: IconValue
  label?: string
  text?: string
  bgColor?: string
  errors?: any
  field?: any
  placeholder?: any
  type?: string
  maxlength?: number
  min?: number
  max?: number
  disabled?: boolean
}
interface Emit {
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
}

const formModelValue = ref<any>(null)
watch(() => props.modelValue, (val: any) => {
  formModelValue.value = props.modelValue
}, { immediate: true })

/** Method */
function handleChangeText() {
  formModelValue.value = props.type === 'number' ? Number(formModelValue.value || 0) : formModelValue.value
  emit('change', props.type === 'number' ? Number(formModelValue.value) : formModelValue.value)

  // emit('update:modelValue', props.type === 'number' ? Number(formModelValue.value || 0) : formModelValue.value)
}

function handleUpdateText() {
  formModelValue.value = props.type === 'number' ? Number(formModelValue.value || 0) : formModelValue.value
  emit('update:modelValue', props.type === 'number' ? Number(formModelValue.value || 0) : formModelValue.value)
}

const messageError = computed(() => {
  if (props.errors?.length)
    return t(props.errors[0])

  return ''
})
</script>

<template>
  <div>
    <div
      v-if="props.text"
      class="mb-1"
    >
      <label
        class="text-medium-sm color-dark"
      >{{ props.text }}</label>
    </div>
    <div
      class="vTextField cm-input-field"
      :class="{ 'cm-input-field-error': errors?.length > 0 ?? false }"
    >
      <VTextField
        v-model="formModelValue"
        v-bind="field"
        :disabled="disabled"
        :prepend-inner-icon="props.prependInnerIcon"
        :label="props.label"
        :bg-color="bgColor"
        :placeholder="placeholder"
        :error="errors?.length > 0 ?? false"
        :error-messages="messageError"
        :type="type"
        :min="min"
        :max="max"
        :maxlength="maxlength"
        hide-details="auto"
        class="text-regular-md"
        @change="handleChangeText"
        @update:modelValue="handleUpdateText"
      />
    </div>
  </div>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;

.vTextField .v-field__input{
  color: $color-gray-900 !important;
  /* Text md/Regular */
  font-family: Inter, sans-serif;
  font-size: 16px;
  height: 40px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  border: $border-input;
  border-radius: $border-radius-input !important;
}
.cm-input-field .v-field--variant-outlined .v-field__outline__start {
    border-radius: 8px 0 0 8px !important;
}

.cm-input-field .v-field--variant-outlined .v-field__outline__end {
    border-radius: 0 8px 8px 0  !important;
}
.vTextField .v-field__outline__end,
.vTextField .v-field__outline__start{
  // border: none !important;
}
.v-field--prepended{
  .v-field__input{
    border: none !important;
  }
  border: $border-input !important;
  border-radius: $border-radius-input !important;
  .v-field__outline__notch::before,
  .v-field__outline__notch::after
  {
    border: none !important;
  }
}
.cm-input-field-error .v-field__input{
  border: 1px solid red;
}
.cm-input-field .v-field__outline{
  z-index: -1 !important;
}
.cm-input-field .v-field--variant-outlined .v-field__outline__start {
    border: none
  }
.cm-input-field .v-field--variant-outlined .v-field__outline__end {
    border: none
  }
</style>

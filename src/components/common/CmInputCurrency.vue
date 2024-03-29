<script setup lang="ts">
import type { JSXComponent } from 'vue'
import constant from '@/constant/constant'
import MethodsUtil from '@/utils/MethodsUtil'

type IconValue = string | JSXComponent

const props = withDefaults(defineProps<Props>(), ({
  prependInnerIcon: '',
  label: '',
  bgColor: 'white',
  type: 'text',
  maxlength: constant.MAX_LENGTH_TEXT_FIELD,
  disabled: false,
  isNegative: false,
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
  isErrors?: boolean
  field?: any
  placeholder?: any
  type?: string
  maxlength?: number
  min?: number
  max?: number
  disabled?: boolean
  isNullNumber?: boolean
  isNegative?: boolean
  isCurrency?: boolean
}
interface Emit {
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
  (e: 'focused', value: any): void
}
const isFocus = ref(false)
const formModelValue = ref<any>(props.modelValue)
const inputRef = ref()
const typeCurrency = ref()
const modelValueCurrency = ref()

/** Method */
function handleChangeText(val: any) {
  emit('change', formModelValue.value)
}

function handleUpdateText(val: any) {
  if (props.type === 'number') {
    if (!val && val !== 0)
      formModelValue.value = null

    else formModelValue.value = Number(val || 0)
    if (props.max && Number(val || 0) > props.max)
      formModelValue.value = props.max
    if (props.min && Number(val || 0) < props.min)
      formModelValue.value = props.min
  }
  else {
    formModelValue.value = val
    if (props.isCurrency)
      modelValueCurrency.value = val
  }

  emit('update:modelValue', formModelValue.value)
}
function keydown(e: any) {
  if (props.type === 'number' || (props.isCurrency && typeCurrency.value === 'number')) {
    const sel = window.getSelection()?.toString()
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)
    && e.target.value.length === props.maxlength && !sel)
      e.preventDefault()
    if (!props.isNegative && ['-'].includes(e.key))
      e.preventDefault()
    if (['e'].includes(e.key))
      e.preventDefault()
  }
}

function focusInput(params: boolean) {
  if (props.isCurrency && !params) {
    modelValueCurrency.value = props.modelValue ? MethodsUtil.formatCurrency(props.modelValue, constant.DECIMAL) : ''
    typeCurrency.value = 'string'
  }
  if (props.isCurrency && params) {
    modelValueCurrency.value = props.modelValue
    typeCurrency.value = 'number'
  }

  isFocus.value = params
  emit('focused', params)
}
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
      :class="{ 'cm-input-field-error': (errors?.length > 0 || isErrors) ?? false }"
    >
      <VTextField
        ref="inputRef"
        :model-value="isCurrency ? modelValueCurrency : modelValue "
        :disabled="disabled"
        :prepend-inner-icon="props.prependInnerIcon"
        :label="props.label"
        :bg-color="bgColor"
        :placeholder="placeholder"
        :error="(errors?.length > 0 || isErrors) ?? false"
        :type="isCurrency ? typeCurrency : type"
        :min="min"
        :max="max"
        :maxlength="maxlength"
        hide-details="auto"
        class="text-regular-md"
        :class="{ focus: isFocus }"
        @change="handleChangeText"
        @update:modelValue="handleUpdateText"
        @update:focused="focusInput"
        @keydown="keydown"
      />
    </div>
    <div
      v-if="errors?.length > 0"
      class="styleError text-errors"
    >
      {{ t(MethodsUtil.showErrorsYub(errors)) }}
    </div>
  </div>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;

.cm-input-field {
  height: 44px;
  padding: 4px 0;
}

.vTextField .v-field__input {
  height: 40px;

  // border: $border-input;

  border-radius: $border-radius-input !important;
  color: $color-gray-900 !important;

  /* Text md/Regular */

  font-family: Inter, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.cm-input-field .v-field--variant-outlined .v-field__outline__start {
  border-radius: 8px 0 0 8px !important;
}

.cm-input-field .v-field--variant-outlined .v-field__outline__end {
  border-radius: 0 8px 8px 0  !important;
}

.vTextField .v-field__outline__end,
.vTextField .v-field__outline__start {
  // border: none !important;
}

.v-field--prepended {
  .v-field__input {
    border: none !important;
  }

  border: $border-input !important;
  border-radius: $border-radius-input !important;

  .v-field__outline__notch::before,
  .v-field__outline__notch::after {
    border: none !important;
  }
}

.cm-input-field .v-field__input:focus {
  border: 1px solid rgb(var(--v-primary-300));
  border-radius: var(--v-border-radius-xs);
}

.cm-input-field .v-field__outline {
  z-index: -1 !important;
}

.cm-input-field-error.cm-input-field .focus .v-field__outline {
  border: 1px solid rgb(var(--v-error-300)) !important;
  border-radius:8px;
  box-shadow: 0 0 0 4px rgb(var(--v-error-100)), 0 1px 2px 0 rgb(var(--v-gray-900)) !important;
}

.cm-input-field-error.cm-input-field .focus .v-field__input:focus {
  border: 1px solid rgb(var(--v-error-300)) !important;
  border-radius:8px;
  box-shadow: 0 0 0 4px rgb(var(--v-error-100)), 0 1px 2px 0 rgb(var(--v-gray-900)) !important;
}

.cm-input-field .focus .v-field__outline {
  border: 1px solid rgb(var(--v-primary-300)) !important;
  border-radius:8px;
  box-shadow: 0 0 0 4px rgb(var(--v-primary-100)), 0 1px 2px 0 rgb(var(--v-primary-300));
}

.cm-input-field .v-field--variant-outlined .v-field__outline__start {
  border: none
}

.cm-input-field .v-field--variant-outlined .v-field__outline__end {
  border: none
}
</style>

<script setup lang="ts">
import type { JSXComponent, PropType } from 'vue'

type IconValue = string | JSXComponent

const props = withDefaults(defineProps<Props>(), ({
  prependInnerIcon: '',
  label: '',
  bgColor: 'white',
  type: 'text',
  maxlength: 50,
}))

const emit = defineEmits<Emit>(); const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

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
}
interface Emit {
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
}

const formModelValue = ref(null)
watch(() => props.modelValue, (val: any) => {
  formModelValue.value = props.modelValue
}, { immediate: true })

/** Method */
const handleChangeText = () => {
  emit('change', formModelValue.value)
}

const handleUpdateText = () => {
  emit('update:modelValue', formModelValue.value)
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
        class="text-label-default"
      >{{ props.text }}</label>
    </div>
    <div class="vTextField">
      <VTextField
        v-model="formModelValue"
        v-bind="field"
        :prepend-inner-icon="props.prependInnerIcon"
        :label="props.label"
        :bg-color="bgColor"
        :placeholder="placeholder"
        :error-messages="messageError"
        :type="type"
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
.vTextField .v-field__outline__end,
.vTextField .v-field__outline__start{
  border: none !important;
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
</style>

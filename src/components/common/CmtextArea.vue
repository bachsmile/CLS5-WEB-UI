<script lang="ts" setup>
interface Prop {
  modelValue?: any
  active?: boolean
  appendIcon?: string
  appendInnerIcon?: string
  autofocus?: boolean
  autoGrow?: boolean
  bgColor?: string
  clearable?: boolean
  clearIcon?: boolean
  color?: string
  counter?: string | number | true
  counterValue?: (val: any) => number
  dirty?: boolean
  disabled?: boolean
  error?: boolean
  errors?: any
  errorMessages?: string
  focused?: boolean
  hideDetails?: boolean | 'auto'
  hint?: string
  id?: string
  label?: string
  loading?: string | boolean
  maxErrors?: string | number
  maxRows?: string | number
  messages?: string | string[]
  modelModifiers?: Record<string, boolean>
  name?: string
  noResize?: boolean
  persistentClear?: boolean
  persistentCounter?: boolean
  text?: string
  field?: any
}

const props = withDefaults(defineProps<Prop>(), ({}))

const emit = defineEmits<Emit>()

interface Emit {
  (e: 'update:model-value', data: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const formModelValue = ref(props.modelValue)

function handleUpdate(event: any) {
  emit('update:model-value', event)
}

const messageError = computed(() => {
  if (props.errors?.length)
    return t(props.errors[0])

  return ''
})
</script>

<template>
  <div>
    <div class="mb-1">
      <label
        class="text-medium-sm color-dark"
      >{{ props.text }}</label>
    </div>
    <VTextarea
      :id="id"
      v-model="formModelValue"
      v-bind="field"
      :active="active"
      :append-icon="appendIcon"
      :append-inner-icon="appendInnerIcon"
      :autofocus="autofocus"
      :auto-grow="autoGrow"
      :bg-color="bgColor"
      :clearable="clearable"
      :color="color"
      :counter="counter"
      :counter-value="counterValue"
      :dirty="dirty"
      :disabled="disabled"
      :error="errors?.length > 0 ?? !!error"
      :error-messages="messageError || errorMessages"
      :focused="focused"
      :hide-details="true"
      :hint="hint"
      :label="label"
      :max-errors="maxErrors"
      :max-rows="maxRows"
      rows="4"
      :messages="messages"
      :model-modifiers="modelModifiers"
      :name="name"
      :no-resize="noResize"
      :persistent-clear="persistentClear"
      :persistent-counter="persistentCounter"
      @update:model-value="emit('update:model-value', formModelValue)"
    />
    <div
      v-if="errors?.length"
      class="color-error error-label"
    >
      {{ messageError }}
    </div>
  </div>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;
.text-area {
  height: unset;
}
.v-textarea .v-field__input {
  color: $color-gray-900 !important;
  /* Text md/Regular */
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  border: $border-input;
  border-radius: $border-radius-input !important;
}
.v-textarea .v-field__outline__end,
.v-textarea .v-field__outline__start{
  // border: none !important;
}
.v-textarea .v-field__field{
  background: $color-input-default;
  border-radius: $border-radius-xs;
}
</style>

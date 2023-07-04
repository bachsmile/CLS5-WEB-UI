<script setup lang="ts">
import MethodsUtil from '@/utils/MethodsUtil'

interface Props {/** ** Interface */
  modelValue?: any
  color?: string
  disabled?: boolean
  indeterminate?: boolean
  error?: boolean
  errorMessages?: string | string[]
  falseIcon?: string | (new () => any)
  falseValue?: any
  focused?: boolean
  hideDetails?: boolean | 'auto'
  id?: string
  indeterminateIcon?: string | (new () => any)
  prependIcon?: string | (new () => any)
  trueIcon?: string | (new () => any)
  inline?: boolean
  label?: string
  multiple?: boolean
  readonly?: boolean
  ripple?: boolean
  name?: string
  theme?: string
  type?: string
  rules?: any
  trueValue?: any
  tooltip?: boolean
  tooltipLabel?: string
  text?: string
  colorInterminate?: string
  field?: any
  value?: any
}
interface Emit {
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
}

/** ** Khởi tạo prop emit */
const propsValue = withDefaults(defineProps<Props>(), ({
  modelValue: false,
  color: 'primary',
  colorInterminate: 'primary',
  disabled: false,
  indeterminate: false,
  error: false,
  errorMessages: '',
  falseIcon: undefined,
  falseValue: undefined,
  focused: false,
  hideDetails: true,
  id: undefined,
  indeterminateIcon: undefined,
  trueIcon: undefined,
  prependIcon: undefined,
  inline: undefined,
  label: undefined,
  multiple: false,
  ripple: false,
  readonly: false,
  name: undefined,
  theme: undefined,
  trueValue: undefined,
  type: undefined,
  tooltip: false,
  tooltipLabel: '',
}))

const emit = defineEmits<Emit>()
const checkbox = ref(propsValue.modelValue)
function onChangeChecked(val: boolean) {
  emit('update:modelValue', val)
}

watch(() => propsValue.modelValue, value => {
  checkbox.value = window._.cloneDeep(propsValue.modelValue)
  emit('change', value)
})
</script>

<template>
  <div
    class="cm-checkbox"
    :title="tooltipLabel"
  >
    <!-- :class="`color-${propsValue.color}`" -->
    <VCheckbox
      :id="propsValue.id"
      v-model="checkbox"
      v-intersect="() => {}"
      :style="`color: ${MethodsUtil.checkColorCustim(colorInterminate)}`"
      :color="color"
      :disabled="propsValue.disabled"
      :indeterminate="propsValue.indeterminate"
      :error="propsValue.error"
      :error-messages="propsValue.errorMessages"
      :false-icon="propsValue.falseIcon"
      :false-value="propsValue.falseValue"
      :focused="propsValue.focused"
      :hide-details="propsValue.hideDetails"
      :indeterminate-icon="propsValue.indeterminateIcon"
      :inline="propsValue.inline"
      :label="propsValue.label"
      :multiple="propsValue.multiple"
      :prepend-icon="propsValue.prependIcon"
      :ripple="propsValue.ripple"
      :rules="propsValue.rules"
      :name="propsValue.name"
      :readonly="propsValue.readonly"
      :type="propsValue.type"
      :true-icon="propsValue.trueIcon"
      :true-value="propsValue.trueValue"
      :value="value"
      @update:modelValue="onChangeChecked($event)"
    >
      <template
        v-if="!label"
        #label
      >
        <slot />
      </template>
    </VCheckbox>
  </div>
</template>

<style lang="scss">
@use "/src/styles/style-global" as *;
.cm-checkbox {
  width: max-content;
  .v-label--clickable {
    @extend .text-medium-md
  }
  .v-checkbox {
    color: $color-gray-300;
  }
  .color-info {
    color: $color-info-600;
  }
  .v-selection-control__input > .v-icon {
    background-color: rgb(var(--v-theme-surface));
  }
}
</style>

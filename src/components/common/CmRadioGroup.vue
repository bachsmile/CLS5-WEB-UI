<script setup lang="ts">
interface radio {
  label?: string
  value: any
}
interface Props {
  option?: radio[]
  color?: string
  label?: string
  text?: string
  modelValue?: any
  disabled?: boolean
}

interface Emit {
  (e: 'update:model-value', value: any): void
}

const props = withDefaults(defineProps<Props>(), ({
  option: () => ([]),
  color: 'primary',
}))

const emit = defineEmits<Emit>()
const valueCurrent = ref(props.modelValue)

function updateValue(value: any) {
  emit('update:model-value', value)
}
</script>

<template>
  <div
    v-if="text"
    class="mb-1"
  >
    <label
      class="text-medium-sm color-dark"
    >{{ text }}</label>
  </div>
  <VRadioGroup
    v-model="valueCurrent"
    inline
    @update:model-value="updateValue"
  >
    <VRadio
      v-for="(item, index) in option"
      :key="index"
      :label="item.label"
      :value="item.value"
      color="primary"
      :disabled="disabled"
      true-icon="mdi-radiobox-marked"
      false-icon="mdi-radiobox-blank"
    />
  </VRadioGroup>
</template>

<style lang="scss">
[role="radiogroup"] .v-selection-control--disabled {
  svg{
    color:  rgb(var(--v-primary-600));
  }
}
</style>

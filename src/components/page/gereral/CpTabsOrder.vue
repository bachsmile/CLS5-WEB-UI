<script lang="ts" setup>
import CpTabOrDer from './CpTabOrder.vue'
import type { Tab } from '@/typescript/interface'

interface Props {
  listTab: Tab[]
  modelValue: string
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update:modelValue', data: string): void
}
function updateModel(val: string) {
  emit('update:modelValue', val)
}

const active = ref('')
watch(() => props.modelValue, val => {
  active.value = val
}, { immediate: true })
</script>

<template>
  <div class="d-flex flex-wrap">
    <CpTabOrDer
      v-for="(i, idx) in listTab"
      :key="i.key"
      :icon="i.icon || ''"
      :text="i.title || ''"
      :is-active="active === i.key"
      :disabled="i.isDisabled"
      :is-end="(idx + 1) === listTab.length"
      @click="updateModel(i.key)"
    />
  </div>
</template>

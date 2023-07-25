<script setup lang="ts">
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

interface Props {
  modelValue: number
  tooltip?: any
  dir?: string
  minValue?: number
  maxValue?: number
  dotStyle?: any
  processStyle?: any
  railStyle?: any
}
const props = withDefaults(defineProps<Props>(), ({
  tooltip: 'none',
  dir: 'ltr',
  minValue: 0,
  maxValue: 100,
  dotStyle: {
    backgroundColor: 'rgb(var(--v-primary-600))',
  },
  processStyle: {
    backgroundColor: 'rgb(var(--v-primary-600))',
    height: '4px',
  },
  railStyle: {
    backgroundColor: 'rgb(var(--v-primary-300))',
    borderRadius: '0',
    height: '4px',
  },
}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'dragStart', value: any): void
  (e: 'dragEnd', value: any): void
  (e: 'change', value: any): void
  (e: 'modelValue', value: any): void
}
const dotStyleValue = ref(props.dotStyle)
const processStyleValue = ref(props.processStyle)
const railStyleValue = ref(props.railStyle)
const progressValue = ref(props.modelValue)

// slider profress
function startSLider(value: any) {
  emit('dragStart', value)
}
function endSLider(value: any) {
  emit('dragEnd', value)
}
function valueChange(value: any) {
  emit('change', value)
  emit('modelValue', value)
}
watch(() => props.modelValue, val => {
  progressValue.value = val
})
</script>

<template>
  <div>
    <VueSlider
      v-model="progressValue"
      :process-style="processStyleValue"
      :rail-style="railStyleValue"
      :dot-style="dotStyleValue"
      :direction="dir"
      :tooltip="tooltip"
      :min-value="minValue"
      :max-value="maxValue"
      @drag-start="startSLider"
      @drag-end="endSLider"
      @change="valueChange"
    />
  </div>
</template>

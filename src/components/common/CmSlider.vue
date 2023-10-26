<script setup lang="ts">
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

interface Props {
  modelValue: number
  tooltip?: any
  dir?: string
  minValue?: number
  lastPointer?: number
  durationTime?: number
  maxValue?: number
  dotStyle?: any
  processStyle?: any
  railStyle?: any
  color?: string
  backgroundColor?: string
  padding?: string
}
const props = withDefaults(defineProps<Props>(), ({
  tooltip: 'none',
  dir: 'ltr',
  padding: '7px 0',
  minValue: 0,
  lastPointer: 0,
  durationTime: 0,
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
const slider = ref()
const marks = ref([])

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
watch(() => props.lastPointer, () => {
  marks.value = [Math.max(Math.min((props.lastPointer ? props.lastPointer : 0), props.durationTime), 0)]
})
onMounted(() => {
  dotStyleValue.value.backgroundColor = props.color === 'white' ? '#fff' : `rgb(var(--v-${props.color}-600))`
  processStyleValue.value.backgroundColor = props.color === 'white' ? '#fff' : `rgb(var(--v-${props.color}-600))`
  railStyleValue.value.backgroundColor = props.color === 'white' ? 'rgb(255, 255, 255, 0)' : `rgb(var(--v-${props.color}-300))`
})
defineExpose({
  slider,
})
</script>

<template>
  <div>
    <VueSlider
      ref="slider"
      v-model="progressValue"
      :process-style="processStyleValue"
      :rail-style="railStyleValue"
      :dot-style="dotStyleValue"
      :direction="dir"
      :marks="marks"
      :style="{ padding, backgroundColor }"
      :tooltip="tooltip"
      :min-value="minValue"
      :max-value="maxValue"
      @drag-start="startSLider"
      @drag-end="endSLider"
      @change="valueChange"
    />
  </div>
</template>

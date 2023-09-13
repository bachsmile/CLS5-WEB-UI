<script setup lang="ts">
interface Emit {
  (e: 'change', key: any, option: any, value?: any): void
  (e: 'update:color', value?: any): void
}

const propsValue = withDefaults(defineProps<Props>(), ({
  type: 0,
  isHideInputColor: false,
  color: null,
}))
const emit = defineEmits<Emit>()
interface Props {
  type?: number
  isHideInputColor?: boolean
  color?: any
}
const colorPicker = ref()
const backColor = ref()
function setColor(type: string) {
  if (type === 'foreColor')
    colorPicker.value.click()

  if (type === 'backColor')
    backColor.value.click()
}
function changeColor(e: any, option: any, type: any) {
  emit('change', type, option, e.target.value || null)
  emit('update:color', e.target.value || null)
}
</script>

<template>
  <div class="toolbar-color">
    <!-- 0. Style color content common -->
    <button
      v-if="type === 0"
      class="btn-full cursor-pointer"
      style="border: none"
    >
      <strong
        v-if="isHideInputColor"
        @click="setColor('foreColor')"
      >
        <VIcon
          icon="ic:outline-invert-colors"
          size="18"
        />
      </strong>
      <input
        id="colorpicker"
        ref="colorPicker"
        :class="{ colorPicker: isHideInputColor }"
        type="color"
        @input="changeColor($event, true, 'foreColor')"
      >
    </button>
    <button
      v-if="type === 2"
      class="btn-full cursor-pointer"
      style="border: none"
    >
      <div
        v-if="isHideInputColor"
        class="roundColor"
        :style="{ 'background-color': color }"
        @click="setColor('foreColor')"
      />
      <input
        id="colorpicker"
        ref="colorPicker"
        :value="color"
        :class="{ colorPicker: isHideInputColor }"
        type="color"
        @input="changeColor($event, true, 'foreColor')"
      >
    </button>
    <!-- 1. Style paint background content common -->
    <button
      v-if="type === 1"
      class=" btn-full cursor-pointer"
      style="border: none"
    >
      <strong
        v-if="isHideInputColor"
        @click="setColor('backColor')"
      >
        <VIcon
          icon="ic:outline-format-color-fill"
          size="18"
        />
      </strong>
      <input
        id="backColor"
        ref="backColor"
        :class="{ colorPicker: isHideInputColor }"
        type="color"
        @input="changeColor($event, true, 'backColor')"
      >
    </button>
  </div>
</template>

<style lang="scss">
.toolbar-color{
  display: flex;
  align-items: center;
}
.toolbar-color .colorPicker {
  visibility: hidden;
  position: absolute;
  width: 0px;
  height: 0px;

}
.roundColor{
  padding: 20px;
  border-radius: 50%;
}
</style>

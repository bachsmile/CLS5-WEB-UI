<script setup lang="ts">
const color1 = ref('#2e90fa')
const percent = ref(20)
const color2 = ref('')
const color3 = ref('')

function changeLightness(hex: string, percentNum: number) {
  // validate hex string
  hex = hex.replace(/[^0-9A-F]/gi, '')
  if (hex.length < 6)
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]

  // convert to decimal & change luminosity
  const lum = percentNum / 100
  let rgb = '#'
  for (let i = 0; i < 3; i++) {
    let c = parseInt(hex.substr(i * 2, 2), 16)
    const color = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16)
    rgb += (`00${color}`).substr(color.length)
  }
  return rgb
}
function changeLightness1(hexColor: string, value: number) {
    // Giải mã màu hex
    let r = parseInt(hexColor.slice(1, 3), 16);
    let g = parseInt(hexColor.slice(3, 5), 16);
    let b = parseInt(hexColor.slice(5, 7), 16);

    // Tính toán giá trị của mỗi màu
    r = Math.max(Math.min(r + value, 255), 0);
    g = Math.max(Math.min(g + value, 255), 0);
    b = Math.max(Math.min(b + value, 255), 0);

    // Trả lại màu hex
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


function getColor() {
  color2.value = changeLightness(color1.value, Number(percent.value))
  color3.value = changeLightness(color1.value, Number(-percent.value))
}
</script>

<template>
  <div class="mt-5">
    <div class="d-flex">
      <VTextField
        v-model="color1"
        label="Color"
        type="text"
        class="mr-1"
      />
      <VTextField
        v-model="percent"
        label="Percent"
        type="text"
        class="ml-1"
        @keydown.enter="getColor"
      />
    </div>
    <VBtn
      density="comfortable"
      class="mt-5"
      @click="getColor"
    >
      Get Color
    </VBtn>
    <VTextField
      v-model="color1"
      label="Color"
      type="text"
      class="mt-5"
      :style="{ 'background-color': color1 }"
    />
    <VTextField
      v-model="color2"
      label="ColorLight"
      type="text"
      class="mt-5"
      :style="{ 'background-color': color2 }"
    />
    <VTextField
      v-model="color3"
      label="ColorDark"
      type="text"
      class="mt-2"
      :style="{ 'background-color': color3 }"
    />
  </div>
</template>

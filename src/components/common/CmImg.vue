<script setup lang="ts">
const propsValue = withDefaults(defineProps<Props>(), ({
  src: '',
  height: '',
  width: '',
  borderRadius: '8px',
  cover: false,
}))

interface Props {
  src: string | null // đường dẫn
  height?: string // chiều cao
  width?: string // chiều cao
  cover?: boolean // độ phủ
  borderRadius?: string // độ phủ
}
</script>

<template>
  <VImg
    v-if="src"
    :src="src"
    :style="{ height, borderRadius, width }"
    :cover="cover"
  />
</template>

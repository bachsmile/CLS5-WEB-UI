<script setup lang="ts">
const propsValue = withDefaults(defineProps<Props>(), ({
  src: '',
  height: '',
  width: '',
  padding: '',
  borderRadius: '8px',
  cover: false,
}))

interface Props {
  src: string | null // đường dẫn
  height?: string // chiều cao
  width?: string // chiều dài
  padding?: string
  cover?: boolean // độ phủ
  borderRadius?: string // độ phủ
}
</script>

<template>
  <VImg
    v-if="src"
    :src="src"
    :style="{ height, borderRadius, width, padding }"
    :cover="cover"
  />
</template>

<script setup lang="ts">
interface Props {
  title: string
  message: string
}

/** ** Khởi tạo prop emit */
const props = withDefaults(defineProps<Props>(), ({
  title: '',
  message: '',
}))
</script>

<template>
  <div
    ref="toast"
    class="toast-component"
  >
    <div class="text-semibold-sm">
      {{ props.title }}
    </div>
    <span class="text-regular-sm">{{ props.message }}</span>
  </div>
</template>

<style lang="scss">
@use "@/styles/variables/global" as *;

.Vue-Toastification__toast {
  display: block;
  padding: $xl;
}

.Vue-Toastification__close-button {
  position: absolute;
  color: $color-gray-700;
  inset-block-start: $xl;
  inset-inline-end: $xl;
}
</style>

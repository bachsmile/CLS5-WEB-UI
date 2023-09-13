<script setup lang="ts">
const propsValue = withDefaults(defineProps<Props>(), ({
  icon: 'fe:edit',
  color: 'primary',
  size: 16,
  bgColor: '',
}))

/**
 *  color: màu của item
 *  icon: icon,
 *  size: kích thước
 *  bgColor: màu nền
 * }
 */

interface Props {
  color?: string
  icon?: string
  bgColor?: string
  size?: number
}
const sizeIcon = computed(() => Number(propsValue.size) + 16)
</script>

<template>
  <VBtn
    :width="sizeIcon"
    :height="sizeIcon"
    :min-width="5"
    rounded
    variant="tonal"
    :icon="icon"
    :color="bgColor"
  >
    <template
      #default
    >
      <VIcon
        :icon="icon"
        :size="size"
        :color="color"
      />
    </template>
  </VBtn>
</template>

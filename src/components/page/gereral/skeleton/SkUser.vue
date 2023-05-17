<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), ({
  number: 1,
}))
const CmSkeleton = defineAsyncComponent(() => import('@/components/common/CmSkeleton.vue'))
interface Props {
  number: number
}
</script>

<template>
  <CmSkeleton :height="50 + (number - 1) * 60">
    <template
      v-for="(item, id) in number"
      :key="id"
    >
      <rect
        x="80"
        :y="20 + (item - 1) * 50"
        rx="3"
        ry="3"
        width="90%"
        height="6"
      />
      <rect
        x="80"
        :y="35 + (item - 1) * 50"
        rx="3"
        ry="3"
        width="90%"
        height="6"
      />

      <circle
        cx="40"
        :cy="30 + (item - 1) * 50"
        r="20"
      />
    </template>
  </CmSkeleton>
</template>


<script setup lang="ts">
const CmSkeleton = defineAsyncComponent(() => import('@/components/common/CmSkeleton.vue'))
</script>

<template>
  <CmSkeleton>
    <template
      v-for="(item, id) in 10"
      :key="id"
    >
      <rect
        x="5%"
        :y="10 + (item - 1) * 70"
        rx="4"
        ry="4"
        width="5%"
        height="38"
      />

      <rect
        x="12%"
        :y="10 + (item - 1) * 70"
        rx="4"
        ry="4"
        width="80%"
        height="38"
      />
    </template>
  </CmSkeleton>
</template>


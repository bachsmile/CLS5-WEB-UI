<script setup lang="ts">
const CmSkeleton = defineAsyncComponent(() => import('@/components/common/CmSkeleton.vue'))
</script>

<template>
  <CmSkeleton>
    <rect
      x="0"
      y="0"
      rx="3"
      ry="3"
      width="100%"
      height="15px"
    />
    <rect
      x="0"
      y="15"
      rx="3"
      ry="3"
      width="5%"
      height="33"
    />
    <rect
      x="20%"
      y="15"
      rx="3"
      ry="3"
      width="5%"
      height="33"
    />
    <rect
      x="40%"
      y="15"
      rx="3"
      ry="3"
      width="5%"
      height="33"
    />
    <rect
      x="60%"
      y="15"
      rx="3"
      ry="3"
      width="5%"
      height="33"
    />
    <rect
      x="80%"
      y="15"
      rx="3"
      ry="3"
      width="5%"
      height="33"
    />
    <rect
      x="95%"
      y="15"
      rx="3"
      ry="3"
      width="5%"
      height="33"
    />
    <rect
      x="0"
      y="45"
      rx="3"
      ry="3"
      width="100%"
      height="3%"
    />

    <template
      v-for="(item, id) in 5"
      :key="id"
    >
      <!-- line -->
      <rect
        x="5%"
        :y="75 + (item - 1) * 40"
        rx="3"
        ry="3"
        width="15%"
        height="15"
      />
      <rect
        x="25%"
        :y="75 + (item - 1) * 40"
        rx="3"
        ry="3"
        width="15%"
        height="15"
      />
      <rect
        x="45%"
        :y="75 + (item - 1) * 40"
        rx="3"
        ry="3"
        width="15%"
        height="15"
      />
      <rect
        x="65%"
        :y="75 + (item - 1) * 40"
        rx="3"
        ry="3"
        width="15%"
        height="15"
      />

      <rect
        x="85%"
        :y="75 + (item - 1) * 40"
        rx="3"
        ry="3"
        width="5%"
        height="15"
      />
      <rect
        x="91%"
        :y="75 + (item - 1) * 40"
        rx="3"
        ry="3"
        width="5%"
        height="15"
      />

      <rect
        x="0"
        :y="100 + (item - 1) * 40"
        rx="3"
        ry="3"
        width="100%"
        height="1%"
      />
      <!-- line -->
    </template>
  </CmSkeleton>
</template>


<script setup lang="ts">
const router = useRouter()
onUnmounted(() => {
  router.resolve({
    query: {},
  })
})
</script>

<template>
  <RouterView />
</template>

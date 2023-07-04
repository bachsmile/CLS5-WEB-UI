<script setup lang="ts">
import { orgStructManagerStore } from '@/stores/admin/org-struct/orgStruct'

const storeOrgStruct = orgStructManagerStore()

onBeforeUnmount(() => {
  storeOrgStruct.$dispose()
})

onDeactivated(() => {
  storeOrgStruct.$dispose()
})
</script>

<template>
  <RouterView />
</template>

<script setup lang="ts">
import { useThemeConfig } from '@core/composable/useThemeConfig'

const { syncInitialLoaderTheme, syncVuetifyThemeWithTheme: syncConfigThemeWithVuetifyTheme, isAppRtl } = useThemeConfig()

// ℹ️ Sync current theme with initial loader theme
syncInitialLoaderTheme()
syncConfigThemeWithVuetifyTheme()
</script>

<template>
  <VLocaleProvider :rtl="isAppRtl">
    <VApp>
      <VMain>
        <RouterView />
      </VMain>
    </VApp>
  </VLocaleProvider>
</template>

<style lang="scss" scoped>
@use "@/styles/style-global.scss" as *;
</style>

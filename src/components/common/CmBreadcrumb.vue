<script setup lang="ts">
import { useRoute } from 'vue-router'

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const route = useRoute()

const items = route?.meta?.breadcrumb as any[]
</script>

<template>
  <div
    v-if="route?.meta && route?.meta?.breadcrumb"
    class="mb-1 d-flex align-center"
  >
    <div class="mr-3">
      <VIcon
        icon="fe:home"
        :size="24"
        class="color-icon-default mr-3"
      />
      <VIcon
        icon="mdi-chevron-right"
        size="16"
      />
    </div>
    <VBreadcrumbs
      :items="items"
      class="breadcrumb"
    >
      <template #title="{ item }">
        <div>
          <VIcon
            v-if="item?.icon"
            :icon="item?.icon"
            :size="24"
            class="color-icon-default"
          />
          <span :to="item?.to"> {{ t(item?.title) }}</span>
        </div>
      </template>
      <template #divider>
        <VIcon
          icon="mdi-chevron-right"
          size="16"
        />
      </template>
    </VBreadcrumbs>
  </div>
</template>

<style lang="scss">
@use "/src/styles/variables/global" as *;

.breadcrumb {
  padding-inline-start: 0 !important;
  .v-breadcrumbs-item--disabled {
    color: $color-primary-700;
    opacity: 1 !important;
  }
}
</style>

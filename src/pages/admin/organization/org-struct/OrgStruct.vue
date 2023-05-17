<script setup lang="ts">
const CpHeaderPageOrgStruct = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/CpHeaderPageOrgStruct.vue'))
const CpOrganizationListView = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/CpOrganizationListView.vue'))

/**
 * lib
 */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
</script>

<template>
  <div>
    <CpHeaderPageOrgStruct
      :title-aprove="t('browse-user')"
      :title="t('user-list')"
      is-update-btn
      is-export-btn
      is-approve-btn
    />
  </div>
  <div>
    <CpOrganizationListView />
  </div>
</template>

  <style scoped>

  </style>
-->

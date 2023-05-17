<script setup lang="ts">
const CmTab = defineAsyncComponent(() => import('@/components/common/CmTab.vue'))
const CpInforOrgStructTab = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/edit/CpInforOrgStructTab.vue'))
const CpTitleOrgStructTab = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/edit/CpTitleOrgStructTab.vue'))

/**
 *
 * tab
 */
const listTab = [
  {
    key: 'infortab',
    title: 'info',
    component: CpInforOrgStructTab,
    isRendered: true,
  },
  {
    key: 'titleTab',
    title: 'title-position',
    component: CpTitleOrgStructTab,
    isRendered: false,
  },
]
</script>

<template>
  <div>
    <div
      class="d-flex justify-content-center mb-5"
      style="margin-top: 20px;"
    >
      <CmTab
        :is-render="true"
        :list-tab="listTab"
        label="tab"
        type="button"
      />
    </div>
  </div>
</template>


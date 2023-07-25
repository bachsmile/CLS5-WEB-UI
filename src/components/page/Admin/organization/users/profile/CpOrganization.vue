<script setup lang="ts">
const CmTab = defineAsyncComponent(() => import('@/components/common/CmTab.vue'))
const CpEditGroupUser = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/profile/CpEditGroupUser.vue'))
const CpEditOrganization = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/profile/CpEditOrganization.vue'))

/**
 *
 * tab
 */
const listTab = [
  {
    key: 'user-group',
    title: 'user-group',
    component: CpEditGroupUser,
    isRendered: true,
  },
  {
    key: 'organizational',
    title: 'organizational-structure',
    component: CpEditOrganization,
    isRendered: false,
  },
]
</script>

<template>
  <div>
    <div
      class="d-flex justify-content-center"
    >
      <CmTab
        :is-render="true"
        :list-tab="listTab"
        label="organization-type"
        type="underline"
      />
    </div>
  </div>
</template>

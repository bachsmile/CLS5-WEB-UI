<script setup lang="ts">
const CmTab = defineAsyncComponent(() => import('@/components/common/CmTab.vue'))
const CpListContent = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/CpListContent.vue'))
const CpReferenceContent = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/reference/CpReferenceContent.vue'))

/**
 *
 * tab
 */
const listTab = [
  {
    key: 'content',
    title: 'content',
    component: CpListContent,
    isRendered: true,
  },
  {
    key: 'reference',
    title: 'reference-content',
    component: CpReferenceContent,
    isRendered: false,
  },
]
</script>

<template>
  <div>
    <div
      class="d-flex justify-content-center mb-5 mt-4"
    >
      <CmTab
        :is-render="true"
        :list-tab="listTab"
        label="content"
        type="underline"
      />
    </div>
  </div>
</template>

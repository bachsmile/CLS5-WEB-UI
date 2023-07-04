<script setup lang="ts">
const CmTab = defineAsyncComponent(() => import('@/components/common/CmTab.vue'))
const CpTabInforDocument = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/document/CpTabInforDocument.vue'))
const CpConditionVideo = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/video/CpConditionVideo.vue'))
const CpConditionCompletedVideo = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/video/CpConditionCompletedVideo.vue'))

const route = useRoute()

/**
 *
 * tab
 */
const listTab = [
  {
    key: 'infor',
    title: 'content',
    component: CpTabInforDocument,
    isRendered: true,
  },
  {
    key: 'condition',
    title: 'condition-content',
    component: CpConditionVideo,
    isRendered: true,
    isDisabled: computed(() => !route.params.contentId).value,
  },
  {
    key: 'condition-complete',
    title: 'condition-completed-content',
    component: CpConditionCompletedVideo,
    isRendered: true,
    isDisabled: computed(() => !route.params.contentId).value,
  },
]
</script>

<template>
  <div
    class="d-flex justify-content-center mb-5 mt-4"
  >
    <CmTab
      :is-render="true"
      :list-tab="listTab"
      label="contentTab"
    />
  </div>
</template>

<script setup lang="ts">
const CmTab = defineAsyncComponent(() => import('@/components/common/CmTab.vue'))
const CpTabInforVideo = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/video/CpTabInforVideo.vue'))
const CpConditionVideo = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/video/CpConditionVideo.vue'))
const CpConditionCompletedVideo = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/video/CpConditionCompletedVideo.vue'))

const route = useRoute()

/**
 *
 * tab
 */

const listTab = ref([
  {
    key: 'infor',
    title: 'content',
    component: CpTabInforVideo,
    isRendered: true,
  },
  {
    key: 'condition',
    title: 'condition-content',
    component: CpConditionVideo,
    isRendered: false,
    isDisabled: true,
  },
  {
    key: 'condition-complete',
    title: 'condition-completed-content',
    component: CpConditionCompletedVideo,
    isRendered: false,
    isDisabled: true,
  },
])
watch(() => route.params.contentId, (val: any) => {
  if (val)
    listTab.value.map((item: any) => item.isDisabled = false)
}, { deep: true, immediate: true })
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

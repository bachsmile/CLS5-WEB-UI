<script setup lang="ts">
import { contentTypeManagerStore } from '@/stores/admin/course/type/contentContentTypeModify'

const CmTab = defineAsyncComponent(() => import('@/components/common/CmTab.vue'))
const CpTabInforOffline = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/offline/CpTabInforOffline.vue'))
const CpConditionVideo = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/video/CpConditionVideo.vue'))
const CpConditionCompletedVideo = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/video/CpConditionCompletedVideo.vue'))

const route = useRoute()
const storeContentTypeManager = contentTypeManagerStore()
const { $reset } = storeContentTypeManager

/**
 *
 * tab
 */
const listTab = [
  {
    key: 'infor',
    title: 'content',
    component: CpTabInforOffline,
    isRendered: true,
  },

  {
    key: 'condition',
    title: 'condition-content',
    component: CpConditionVideo,
    isRendered: false,
    isDisabled: computed(() => !route.params.contentId).value,
  },
  {
    key: 'condition-complete',
    title: 'condition-completed-content',
    component: CpConditionCompletedVideo,
    isRendered: false,
    isDisabled: computed(() => !route.params.contentId).value,
  },
]

onBeforeUnmount(() => {
  $reset(storeContentTypeManager.$state)
  storeContentTypeManager.$dispose()
})

onDeactivated(() => {
  $reset(storeContentTypeManager.$state)
  storeContentTypeManager.$dispose()
})
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

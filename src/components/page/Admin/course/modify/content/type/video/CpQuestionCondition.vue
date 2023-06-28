<script setup lang="ts">
import CpQuestionListCondition from './CpQuestionListCondition.vue'

const CmTab = defineAsyncComponent(() => import('@/components/common/CmTab.vue'))
const CpConfigurationContentVideo = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/video/CpConfigurationContentVideo.vue'))

/**
 *
 * tab
 */
const listTab = [
  {
    key: 'question',
    title: 'questions',
    component: CpQuestionListCondition,
    isRendered: true,
  },

  {
    key: 'configuration',
    title: 'custom',
    component: CpConfigurationContentVideo,
    isRendered: true,
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
      type="underline"
    />
  </div>
</template>

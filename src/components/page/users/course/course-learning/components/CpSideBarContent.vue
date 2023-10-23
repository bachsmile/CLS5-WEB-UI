<script setup lang="ts">
import CmTab from '@/components/common/CmTab.vue'
import CpListContent from '@/components/page/users/course/course-learning/components/CpListContent.vue'
import CpComment from '@/components/page/users/course/course-learning/components/CpComment.vue'

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
    key: 'comments',
    title: 'comments',
    component: CpComment,
    isRendered: false,
  },
]
</script>

<template>
  <div>
    <CmTab
      is-un-query
      :is-render="true"
      :list-tab="listTab"
      label="conditionPart"
      type="button"
    />
  </div>
</template>

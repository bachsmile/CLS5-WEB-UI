<script setup lang="ts">
import CmTab from '@/components/common/CmTab.vue'
import CpMyCourseHappening from '@/components/page/users/course/course-list/CpMyCourseHappening.vue'
import CpMyCourseCompleted from '@/components/page/users/course/course-list/CpMyCourseCompleted.vue'
import CpMyCourseFinished from '@/components/page/users/course/course-list/CpMyCourseFinished.vue'
import CpMyCourseHome from '@/components/page/users/course/course-list/CpMyCourseHome.vue'

/**
 *
 * tab
 */
const listTab = [
  {
    key: 'going-on',
    title: 'course-happening',
    component: CpMyCourseHappening,
    isRendered: true,
  },

  {
    key: 'completed',
    title: 'course-complete',
    component: CpMyCourseCompleted,
    isRendered: false,
  },
  {
    key: 'finished',
    title: 'CSE_CourseEndDateRequire',
    component: CpMyCourseFinished,
    isRendered: false,
  },
  {
    key: 'proposal',
    title: 'course-proposal',
    component: CpMyCourseFinished,
    isDisabled: true,
    isRendered: false,
  },
  {
    key: 'homePage',
    title: 'course-home',
    component: CpMyCourseHome,
    isRendered: false,
  },

]
</script>

<template>
  <div
    class="d-flex justify-content-center mb-5 mt-4"
  >
    <CmTab
      :is-render="false"
      :list-tab="listTab"
      label="type"
    />
  </div>
</template>

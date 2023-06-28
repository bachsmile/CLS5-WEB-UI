<script setup lang="ts">
const CmTab = defineAsyncComponent(() => import('@/components/common/CmTab.vue'))
const CpCapacityCondition = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/CpCapacityCondition.vue'))
const CpCourseCondition = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/CpCourseCondition.vue'))

/**
 *
 * tab
 */
const listTab = [
  {
    key: 'capacity',
    title: 'capacity-required',
    component: CpCapacityCondition,
    isRendered: true,
  },
  {
    key: 'course',
    title: 'course-required',
    component: CpCourseCondition,
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
        label="tab"
        type="underline"
      />
    </div>
  </div>
</template>

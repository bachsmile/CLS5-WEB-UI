<script setup lang="ts">
import { courseApproveManagerStore } from '@/stores/admin/course/approve'
import { courseListManagerStore } from '@/stores/admin/course/courseList'
import { courseInforManagerStore } from '@/stores/admin/course/infor'

const storeCourseApproveManager = courseApproveManagerStore()
const storeCourseListManager = courseListManagerStore()
const storeCourseInforManager = courseInforManagerStore()
onBeforeUnmount(() => {
  storeCourseApproveManager.$dispose()
  storeCourseListManager.$dispose()
  storeCourseInforManager.$dispose()
})

onDeactivated(() => {
  storeCourseApproveManager.$dispose()
  storeCourseListManager.$dispose()
  storeCourseInforManager.$dispose()
})
</script>

<template>
  <RouterView />
</template>

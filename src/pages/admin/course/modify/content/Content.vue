<script setup lang="ts">
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import { contentTypeManagerStore } from '@/stores/admin/course/type/contentVideoTypeModify'

const CpVideoContent = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/video/CpVideoContent.vue'))

const CpContent = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/CpContent.vue'))

const component = ref(CpContent)
const route = useRoute()
const storeContentVideoTypeModifyManager = contentTypeManagerStore()
const { courseData } = storeToRefs(storeContentVideoTypeModifyManager)

// dữ liệu khóa học
async function getDetailCourse() {
  const params = {
    id: Number(route.params.id),
  }
  await MethodsUtil.requestApiCustom(CourseService.GetDetailCourseById, TYPE_REQUEST.GET, params).then((value: any) => {
    if (value.data)
      courseData.value = value.data
  })
}

getDetailCourse()

onMounted(() => {
  switch (route.params?.type) {
    case 'content':
      component.value = CpContent
      break
    case 'video':
      component.value = CpVideoContent
      break

    default:
      break
  }
})
</script>

<template>
  <div>
    <Component
      :is="component"
    />
  </div>
</template>

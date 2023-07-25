<script setup lang="ts">
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import { contentTypeVideoManagerStore } from '@/stores/admin/course/type/contentVideoTypeModify'

const CpVideoContent = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/video/CpVideoContent.vue'))
const CpDocumentContent = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/document/CpDocumentContent.vue'))
const CpAudioContent = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/audio/CpAudioContent.vue'))
const CpScormContent = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/scorm/CpScormContent.vue'))
const CpIframeContent = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/iframe/CpIframeContent.vue'))
const CpContent = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/content/CpContent.vue'))
const CpEssayContent = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/essay/CpEssayContent.vue'))
const CpOfflineContent = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/offline/CpOfflineContent.vue'))

const component = ref(CpContent)
const route = useRoute()
const storeContentVideoTypeModifyManager = contentTypeVideoManagerStore()
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
    case 'text-content':
      component.value = CpContent
      break
    case 'video-content':
      component.value = CpVideoContent
      break
    case 'document-content':
      component.value = CpDocumentContent
      break
    case 'audio-content':
      component.value = CpAudioContent
      break
    case 'scorm-content':
      component.value = CpScormContent
      break
    case 'iframe-content':
      component.value = CpIframeContent
      break
    case 'essay-content':
      component.value = CpEssayContent
      break
    case 'offline-content':
      component.value = CpOfflineContent
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

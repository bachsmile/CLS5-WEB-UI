<script setup lang="ts">
import { courseApproveManagerStore } from '@/stores/admin/course/approve'

const emit = defineEmits<Emit>()
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CpRatioPointContentCourse = defineAsyncComponent(() => import('@/components/page/Admin/course/CpRatioPointContentCourse.vue'))
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()

/** store */
const storeCourseApproveManager = courseApproveManagerStore()

const { idModalSendRatioPoint, scoreSettingCourse } = storeToRefs(storeCourseApproveManager)
const { handleUpdatePointCourse, scoreSetting } = storeCourseApproveManager
const LABEL = Object.freeze({
  TITLE: t('setting-point'),
  TITLE1: t('api-name'),
  TITLE2: t('code-number'),
})

interface Emit {
  (e: 'update:idModalSendRatioPoint', value: any): void
}

async function onCancel() {
  idModalSendRatioPoint.value = false
}
function onConfirm(params: any) {
  handleUpdatePointCourse()
}
watch(idModalSendRatioPoint, isShow => {
  if (isShow) {
    scoreSettingCourse.value.courseId = Number(route.params.id)
    scoreSetting(Number(route.params.id))
  }
})
</script>

<template>
  <div>
    <CmDialogs
      :is-dialog-visible="idModalSendRatioPoint"
      :title="LABEL.TITLE"
      close-on-back
      :height="800"
      @cancel="onCancel"
      @confirm="onConfirm"
    >
      <CpRatioPointContentCourse />
    </CmDialogs>
  </div>
</template>

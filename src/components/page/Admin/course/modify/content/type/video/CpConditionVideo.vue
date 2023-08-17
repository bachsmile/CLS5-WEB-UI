<script setup lang="ts">
import { contentTypeManagerStore } from '@/stores/admin/course/type/contentContentTypeModify'
import toast from '@/plugins/toast'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import StringJwt from '@/utils/Jwt'
import ArraysUtil from '@/utils/ArrayUtil'
import { load } from '@/stores/loadComponent.js'
import CpCondition from '@/components/page/gereral/CpCondition.vue'
import type { Any } from '@/typescript/interface'

const CmCheckBox = defineAsyncComponent(() => import('@/components/common/CmCheckBox.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CmDateTimePicker = defineAsyncComponent(() => import('@/components/common/CmDateTimePicker.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))
const CmChip = defineAsyncComponent(() => import('@/components/common/CmChip.vue'))

/** LIB */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()

/** store */
const store = load()
const { unLoadComponent } = store

const storeContentVideoTypeModifyManager = contentTypeManagerStore()
const { conditionAttend, courseData } = storeToRefs(storeContentVideoTypeModifyManager)
const { fetchConditionAttend } = storeContentVideoTypeModifyManager

onMounted(() => {
  if (!window._.isEmpty(conditionAttend))
    fetchConditionAttend(Number(route.params?.contentId) || null)
})

/** state */
const isStartTime = ref(false)
const isEndTime = ref(false)
const myFormAddConditionVideo = ref()

const LABEL = Object.freeze({
  TITLE1: t('setting-time'),
  LABEL1: 'Thời gian bắt đầu',
  LABEL2: 'Thời gian kết thúc',
})

/** method */
function handleCancle() {
  router.push({ name: 'course-edit', params: { id: Number(route.params.id) }, query: { tab: 'content' } })
}
function getErrorsMessage(errorsMess: Array<any>) {
  let str = ''
  errorsMess.forEach(element => {
    str += `${t(element.message, element.params)}`
    str += '. '
  })

  return str
}

/** điều kiện hoàn thành */
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('content'), value: 'name' },
  { text: t('author'), value: 'author', type: 'custom' },
  { text: t('status-name'), value: 'statusName', type: 'custom' },
])
const dataTable = reactive({
  deleteIds: [], // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})
const paramsContent = ref({
  id: Number(route?.params?.id) || null,
  search: null as any,
  role: StringJwt.getRole(),
})

const items = ref<any>()

/** *****Lấy danh sách nội dung */
async function getListContentCourse() {
  let dataRow
  const value = await MethodsUtil.requestApiCustom(CourseService.GetListContentCourse, TYPE_REQUEST.GET, paramsContent.value)
  if (value.data) {
    dataRow = ArraysUtil.unFlatMapTree(value.data)

    for (let i = 0; i < dataRow.length; i += 1) {
      const element = dataRow[i]
      if (element.children === null)
        element.children = []

      // loại bỏ những nội dung là chỉnh nó hoặc là chuyên đề
      if (element.courseContentId === Number(route.params.contentId) || (element.contentArchiveTypeId === 13)) {
        dataRow.splice(i, 1)
        i -= 1

        continue
      }
      if (conditionAttend.value.lesionRequire && conditionAttend.value.lesionRequire.includes(element.courseContentId))
        element.isSelected = true
      element.html = true
    }
  }

  items.value = dataRow
}

// lưu  dữ liệu
async function saveDataCondition(idx: any) {
  myFormAddConditionVideo.value.FormCondition.validate().then(async (success: any) => {
    if (success.valid) {
      if (!isStartTime.value)
        conditionAttend.value.dateTimeStart = null

      if (!isEndTime.value)
        conditionAttend.value.dateTimeEnd = null
      if (isStartTime.value && isEndTime.value) {
        const start = new Date(conditionAttend.value.dateTimeStart || '')
        const end = new Date(conditionAttend.value.dateTimeEnd || '')
        if (end < start) {
          toast('WARNING', t('time-end-invalid'))
          unLoadComponent(idx)
          return
        }
      }

      // dánh sách khóa học yêu cầu
      if (courseData.value?.studyMode !== 3)
        conditionAttend.value.lesionRequire = []
      MethodsUtil.requestApiCustom(CourseService.PostSaveRequireParticipate, TYPE_REQUEST.POST, conditionAttend.value).then((res: any) => {
        toast('SUCCESS', t(res.message))
        unLoadComponent(idx)
      })
        .catch((error: Any) => {
          toast('ERROR', t(getErrorsMessage(error?.response?.data?.errors)))
          unLoadComponent(idx)
        })
    }
    else {
      if (!myFormAddConditionVideo.value.isIntersecting)
        toast('ERROR', t('check-info'))

      unLoadComponent(idx)
    }
  })
}

watch(conditionAttend, val => {
  getListContentCourse()
  if (val) {
    if (conditionAttend.value.dateTimeStart)
      isStartTime.value = true
    if (conditionAttend.value.dateTimeEnd)
      isEndTime.value = true
  }
}, { deep: true, immediate: true })
</script>

<template>
  <div class="mt-6">
    <CpCondition
      ref="myFormAddConditionVideo"
      v-model:is-start-time="isStartTime"
      v-model:is-end-time="isEndTime"
      v-model:date-time-start="conditionAttend.dateTimeStart"
      v-model:date-time-end="conditionAttend.dateTimeEnd"
      v-model:selected="conditionAttend.lesionRequire"
      :items="items"
      :is-show-content-req="courseData?.studyMode === 3"
      :headers="headers"
    />
    <CpActionFooterEdit
      is-cancel
      is-save
      :title-cancel="t('cancel-title')"
      :title-save="t('save')"
      @on-save="saveDataCondition"
      @on-cancel="handleCancle"
    />
  </div>
</template>

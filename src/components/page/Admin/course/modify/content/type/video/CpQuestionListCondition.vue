<script setup lang="ts">
import { contentTypeVideoManagerStore } from '@/stores/admin/course/type/contentVideoTypeModify'

const CmChip = defineAsyncComponent(() => import('@/components/common/CmChip.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('questions'), value: 'questions', type: 'custom' },
  { text: t('point'), value: 'unitPoint', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
])
const storeContentVideoTypeModifyManager = contentTypeVideoManagerStore()
const { conditionComplete, conditionAttend, timeComplete, isViewDetail } = storeToRefs(storeContentVideoTypeModifyManager)
const dataTable = reactive({
  deleteIds: [], // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})
const queryParams = reactive({
  pageSize: 1000,
  pageNumber: 1,
  courseContentId: null as number | null,
})
const items = ref<any>()
function selectedRows(e: any) {
  dataTable.selectedRowsIds = e
}

/** *****Lấy danh sách nội dung */
async function getListQuestionContentCourse() {
  // let valueQuestion: any = null
  // if (!route.params.contentId)
  //   return // thoát nếu chưa thêm bài kiểm tra

  // queryParams.courseContentId = Number(route.params.contentId)
  // const response = await MethodsUtil.requestApiCustom(CourseService.GetListQuestionContentTest, TYPE_REQUEST.GET, queryParams)
  // if (response.data && response.data.pageLists)
  //   valueQuestion = response.data
  // const questionIds = MethodsUtil.getPropertyByArray(valueQuestion.pageLists, 'id')
  // let questions = null
  // if (this.isExam === true && this.isSurvey === true)
  //   questions = data.pageLists

  // else questions = await this.getQuestionTest(questionIds, this.isExam)
  // if (questions) {
  //   questions.forEach(element => {
  //     element.expanded = false
  //     this.questions.push(element)

  //     // if (element.isQuestionGroup === true) {
  //     //   element.listQuestions.forEach(question => {
  //     //     question.unitPoint = question.unitPoint
  //     //   })
  //     // }
  //   })
  // }
}
getListQuestionContentCourse()
</script>

<template>
  <div class="mt-6">
    <CmTable
      :selected="dataTable?.selectedRowsIds"
      is-update-row-force
      :headers="headers"
      :items="items"
      disiable-pagination
      custom-id="courseContentId"
      @update:selected="selectedRows"
    >
      <template #rowItem="{ col, context }">
        <div v-if="col === 'questions'">
          {{ context.contentBasic }}
        </div>
      </template>
    </CmTable>
  </div>
</template>

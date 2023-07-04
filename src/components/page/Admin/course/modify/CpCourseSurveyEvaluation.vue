<script setup lang="ts">
import { courseManagerStore } from '@/stores/admin/course/course'
import { comboboxStore } from '@/stores/combobox'
import CmCollapse from '@/components/common/CmCollapse.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import DateUtil from '@/utils/DateUtil'

const CpActionHeaderPage = defineAsyncComponent(() => import('@/components/page/gereral/CpActionHeaderPage.vue'))
const CmMdAddEval = defineAsyncComponent(() => import('@/components/page/Admin/course/modal/CpMdAddEval.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))
const CpSurveyEvaluationFilter = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/CpSurveyEvaluationFilter.vue'))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()

/**
 * Store
 */
const combobox = comboboxStore()

// const { compoboxEvalTypes } = storeToRefs(combobox)
// const { categoryEvalCombobox } = combobox

const storecourseManager = courseManagerStore()
const { callBackAction, disabledDeleteEval, excludeIdsEval, queryParamsEval, itemsEval, totalRecordEval, isShowDialogNotiDeleteEval, courseData, isShowModalAddEval } = storeToRefs(storecourseManager)
const { actionItemEval, addSurveyCourse, deleteItemsEval, handleSearchEvaluation, getEvaluetionAllRequired, handlePageClickEval, selectedRowsEval, getEvaluetionRequired, confirmDialogDeleteEval, handleFilterEvaluationCombobox } = storecourseManager

/** state */

const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-survey'), value: 'name' },
  { text: t('creator'), value: 'fullname', type: 'custom' },
  { text: t('date-start'), value: 'startDate', type: 'custom' },
  { text: t('date-end'), value: 'endDate', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
])
const isShowFilter = ref(true)

/** method */
/* ==> thực hiện các action được chọn ở header page CP */
async function handlerActionHeader(type: any) {
  if (type === 'handlerAddButton') {
    await getEvaluetionAllRequired()
    isShowModalAddEval.value = true
  }
}

// hàm trả về các loại action từ header filter
async function handleClickBtn(type: string) {
  switch (type) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
      break
    case 'delete':
      deleteItemsEval()
      break

    default:
      break
  }
}
onMounted(async () => {
  callBackAction.value = actionItemEval

  // if (!compoboxEvalTypes.value?.length)
  //   await categoryEvalCombobox()
  await getEvaluetionRequired()
})
</script>

<template>
  <div class="mt-6">
    <div>
      <CpActionHeaderPage
        :title="t('survey-course')"
        :title-custom-add="t('add-survey-course')"
        is-custom-add-btn
        @click="handlerActionHeader"
      />
    </div>
    <CmCollapse :is-show="isShowFilter">
      <CpSurveyEvaluationFilter @update="handleFilterEvaluationCombobox" />
    </CmCollapse>
    <div>
      <CpHeaderAction
        is-delete
        is-fillter
        :disabled-delete="disabledDeleteEval"
        @click="handleClickBtn"
        @update:keyword="handleSearchEvaluation"
      />
    </div>
    <div>
      <CmTable
        v-model:pageSize="queryParamsEval.pageSize"
        v-model:page-number="queryParamsEval.pageNumber"
        :headers="headers"
        :items="itemsEval"
        :total-record="totalRecordEval"
        @handlePageClick="handlePageClickEval"
        @update:selected="selectedRowsEval"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'fullname'">
            {{ MethodsUtil.formatFullName(context.firstName, context.lastName) }}
          </div>
          <div v-if="col === 'startDate'">
            {{ DateUtil.formatDateToDDMM(context[col]) }}
          </div>
          <div v-if="col === 'endDate'">
            {{ DateUtil.formatDateToDDMM(context[col]) }}
          </div>
        </template>
      </CmTable>
    </div>
    <div>
      <CmMdAddEval
        v-model:isShowModalAddEval="isShowModalAddEval"
        :exclude-ids="excludeIdsEval"
        :course-id="courseData.id"
        @saveChange="($event) => addSurveyCourse($event)"
      />
    </div>
    <CpConfirmDialog
      v-model:is-dialog-visible="isShowDialogNotiDeleteEval"
      :type="2"
      variant="outlined"
      :confirmation-msg="t('delete-suvery-perior')"
      :confirmation-msg-sub-title="t('confirm-delete-suvery-perior')"
      @confirm="confirmDialogDeleteEval"
    />
  </div>
</template>

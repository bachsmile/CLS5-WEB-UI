<script lang="ts" setup>
import CpActionHeaderPage from '@/components/page/gereral/CpActionHeaderPage.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CmCollapse from '@/components/common/CmCollapse.vue'
import CmTable from '@/components/common/CmTable.vue'
import CpFilterApproveSurvey from '@/components/page/Admin/training/survey/approve/CpFilterApproveSurvey.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Params } from '@/typescript/interface/params'
import type { Any } from '@/typescript/interface'
import CmTextField from '@/components/common/CmTextField.vue'
import toast from '@/plugins/toast'
import CmButton from '@/components/common/CmButton.vue'
import CpQuestionInfo from '@/components/page/gereral/CpQuestionInfo.vue'

const { t } = window.i18n()
const isShowFilter = ref(true)
const headers: any[] = [
  { text: '', value: 'checkbox', width: 50 },
  { text: t('question'), value: 'contentBasic' },
  { text: t('question-type'), value: 'questionType', type: 'custom' },
  { text: t('description'), value: 'description', type: 'custom' },
]

interface QueryParams extends Params {
  sort: string []
  keyword: string
  fromDate: any
  authorId: number | null
  toDate: any
  statusId: number
}

const queryParams = reactive<QueryParams>({
  sort: ['-id'],
  pageNumber: 1,
  pageSize: 10,
  authorId: null,
  fromDate: null,
  toDate: null,
  keyword: '',
  statusId: 2,
})

const items = ref<Any[]>([])
const totalRecord = ref(0)
function getListSurvey() {
  MethodsUtil.requestApiCustom(QuestionService.GetListQuestion, TYPE_REQUEST.GET, queryParams).then((result: Any) => {
    items.value = result?.data?.pageLists
    totalRecord.value = result?.data?.totalRecord
  })
}
getListSurvey()
const selected = ref<any[]>([])

watch(queryParams, val => {
  getListSurvey()
}, { deep: true })
function handleAction(val: string) {
  switch (val) {
    case 'approve':
      handleApprove()
      break
    case 'back':
      handleReject()
      break
    default:
      break
  }
}
function handleApprove() {
  const payload = {
    listId: selected.value,
  }
  MethodsUtil.requestApiCustom(QuestionService.PostApproveQuestion, TYPE_REQUEST.POST, payload).then((result: Any) => {
    getListSurvey()
    toast('SUCCESS', t(result.message))
    selected.value = []
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.error, t))
  })
}
function handleReject() {
  const payload = {
    listId: selected.value,
  }
  MethodsUtil.requestApiCustom(QuestionService.PostDeclineQuestion, TYPE_REQUEST.POST, payload).then((result: Any) => {
    getListSurvey()
    toast('SUCCESS', t(result.message))
    selected.value = []
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.error, t))
  })
}

function updateValue(val: any, context: Any) {
  items.value[context.originIndex].description = val
}

const router = useRouter()
function goBack() {
  router.push({ name: 'survey-list' })
}
</script>

<template>
  <div>
    <CpActionHeaderPage :title="t('question')" />
  </div>
  <CmCollapse :is-show="isShowFilter">
    <div>
      <CpFilterApproveSurvey
        v-model:author-id="queryParams.authorId"
        v-model:from-date="queryParams.fromDate"
        v-model:to-date="queryParams.toDate"
        v-model:page-number="queryParams.pageNumber"
        v-model:page-size="queryParams.pageSize"
      />
    </div>
  </CmCollapse>
  <div class="mt-2 mb-3">
    <CpHeaderAction
      v-model:keyword="queryParams.keyword"
      v-model:page-number="queryParams.pageNumber"
      v-model:page-size="queryParams.pageSize"
      v-model:show-filter="isShowFilter"
      :disabled-approve="selected.length === 0"
      :disabled-back="selected.length === 0"
      is-approve
      is-back
      @click="handleAction"
    />
  </div>

  <div>
    <CmTable
      v-model:page-number="queryParams.pageNumber"
      v-model:page-size="queryParams.pageSize"
      v-model:selected="selected"
      :headers="headers"
      return-object
      :items="items"
      :total-record="totalRecord"
    >
      <template #rowItem="{ col, context }">
        <div v-if="col === 'description'">
          <CmTextField
            v-model:model-value="context.description"
            @change="updateValue($event, context)"
          />
        </div>
        <div v-if="col === 'questionType'">
          <CpQuestionInfo
            :name="context.questionTypeName"
            :is-group="context.isQuestionGroup"
          />
        </div>
      </template>
    </CmTable>
  </div>
  <div class="w-100 d-flex justify-end mt-4">
    <CmButton
      color="secondary"
      variant="outlined"
      :title="t('come-back')"
      @click="goBack"
    />
  </div>
</template>

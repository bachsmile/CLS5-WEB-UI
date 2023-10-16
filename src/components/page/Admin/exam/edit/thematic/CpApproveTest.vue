<script lang="ts" setup>
import CpActionHeaderPage from '@/components/page/gereral/CpActionHeaderPage.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CmTable from '@/components/common/CmTable.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Params } from '@/typescript/interface/params'
import type { Any } from '@/typescript/interface'
import CmTextField from '@/components/common/CmTextField.vue'
import toast from '@/plugins/toast'
import CmButton from '@/components/common/CmButton.vue'

const { t } = window.i18n()
const isShowFilter = ref(true)
const headers: any[] = [
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-survey'), value: 'name' },
  { text: t('user-create'), value: 'authorId' },
  { text: t('description'), value: 'description', type: 'custom' },
]
const route = useRoute()

interface QueryParams extends Params {
  sort: string []
  searchData: string
  fromDate: any
  authorId: number | null
  toDate: any
  testId: number
  statusId: number
}

const queryParams = reactive<QueryParams>({
  authorId: 0,
  fromDate: '',
  pageNumber: 1,
  pageSize: 10,
  searchData: '',
  sort: ['-name'],
  statusId: 0,
  testId: Number(route.params.thematicId),
  toDate: '',
})

const items = ref<Any[]>([])
const totalRecord = ref(0)
function getListSurvey() {
  MethodsUtil.requestApiCustom(QuestionService.PostGetListTest, TYPE_REQUEST.POST, queryParams).then((result: Any) => {
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
    listModel: selected.value,
    id: route.params.topicId,
  }
  MethodsUtil.requestApiCustom(QuestionService.PostAgreeSurveyTest, TYPE_REQUEST.POST, payload).then((result: Any) => {
    getListSurvey()
    toast('SUCCESS', t(result.message))
    selected.value = []
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
  })
}
function handleReject() {
  const payload = {
    listModel: selected.value,
    id: route.params.topicId,
  }
  MethodsUtil.requestApiCustom(QuestionService.PostRejectSurveyTest, TYPE_REQUEST.POST, payload).then((result: Any) => {
    getListSurvey()
    toast('SUCCESS', t(result.message))
    selected.value = []
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
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
    <CpActionHeaderPage :title="t('approval-survey')" />
  </div>

  <div class="mt-2 mb-3">
    <CpHeaderAction
      v-model:keyword="queryParams.search"
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

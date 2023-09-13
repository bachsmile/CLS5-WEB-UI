<script lang="ts" setup>
import type { Item } from 'vue3-easy-data-table'
import moment from 'moment'
import CpActionHeaderPage from '@/components/page/gereral/CpActionHeaderPage.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CmCollapse from '@/components/common/CmCollapse.vue'
import CpFilterSurvey from '@/components/page/Admin/training/survey/CpFilterSurvey.vue'
import CmTable from '@/components/common/CmTable.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Params } from '@/typescript/interface/params'
import StringJwt from '@/utils/Jwt'
import CpCustomInforCourse from '@/components/page/gereral/CpCustomInforCourse.vue'
import DateUtil from '@/utils/DateUtil'
import ObjectUtil from '@/utils/ObjectUtil'
import { tableStore } from '@/stores/table'
import type { Any } from '@/typescript/interface'
import QuestionService from '@/api/question'
import toast from '@/plugins/toast'
import CpMdFeedBackReject from '@/components/page/Admin/training/survey/approve/CpMdFeedBackReject.vue'

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const isShowFilter = ref(true)
const storeTable = tableStore()
const { callBackAction } = storeToRefs(storeTable)

const headers = [{ text: '', value: 'checkbox', width: 50 },
  { text: t('name-survey'), value: 'name', type: 'custom' },
  { text: t('user-create'), value: 'authorId' },
  { text: t('start-time'), value: 'startTime', type: 'custom' },
  { text: t('end-time'), value: 'endTime', type: 'custom' },
  { text: '', value: 'actions', width: 150 }]
const items = ref<Item[]>([])
const totalRecord = ref<number>(0)

interface QueryParams extends Params {
  authorId: number | null
  statusId: number | null
  fromDate: any
  toDate: any
  sort: string
  role: number | null
}

const queryParams = reactive<QueryParams>({
  search: '',
  pageNumber: 1,
  pageSize: 10,
  sort: '-createdDate',
  authorId: null,
  statusId: null,
  fromDate: null,
  toDate: null,
  role: StringJwt.getRole(),
})
const route = useRoute()
function getListSurvey() {
  MethodsUtil.requestApiCustom(CourseService.GetListSurvey, TYPE_REQUEST.GET, queryParams).then((result: Item) => {
    items.value = result.data.pageLists
    totalRecord.value = result.data.totalRecord
  })
}

const router = useRouter()
watch(queryParams, val => {
  let temp = { ...val }
  if (val.fromDate) {
    temp = {
      ...temp,
      fromDate: moment(val.fromDate).format('MM-DD-YYYY'),
    }
  }
  if (val.toDate) {
    temp = {
      ...temp,
      toDate: moment(val.toDate).format('MM-DD-YYYY'),
    }
  }
  const params = ObjectUtil.omitByDeep(temp)
  router.push({ query: params })
  getListSurvey()
}, { deep: true })

onMounted(() => {
  if (!window._.isEmpty(route.query)) {
    queryParams.pageNumber = route.query.pageNumber ? Number(route.query.pageNumber) : queryParams.pageNumber
    queryParams.statusId = route.query.statusId ? Number(route.query.statusId) : queryParams.statusId
    queryParams.pageSize = route.query.pageSize ? Number(route.query.pageSize) : queryParams.pageSize
    queryParams.fromDate = route.query.fromDate ? new Date(route.query.fromDate as string) : ''
    queryParams.toDate = route.query.toDate ? new Date(route.query.toDate as string) : queryParams.toDate
    queryParams.search = route.query.searchData ? route.query.search as string : queryParams.search
    queryParams.role = route.query.role ? Number(route.query.role) : 1
    queryParams.authorId = route.query.authorId ? Number(route.query.authorId) : null
  }
  else {
    getListSurvey()
  }
})

const selected = ref<any>([])

callBackAction.value = actionItem
async function approveSurvey() {
  const listModel: Any[] = []
  selected.value.forEach((element: Any) => {
    listModel.push({
      id: element.id,
      description: '',
    })
  })
  await MethodsUtil.requestApiCustom(QuestionService.PostAgreeSurvey, TYPE_REQUEST.POST, { listModel }).then((result: Any) => {
    getListSurvey()
    selected.value = []
    toast('SUCCESS', t(result.message))
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
  })
}

function addSurvey(val: string) {
  switch (val) {
    case 'handlerAddButton':
      router.push({ name: 'add-survey' })
      break
    case 'handlerCustomButton':
      router.push({ name: 'approve-survey' })
      break

    default:
      break
  }
}
const isApproveSurvey = computed(() => {
  return MethodsUtil.checkPermission(null, 'SurveyManaging', 128) || false
})

function sendApproveSurvey() {
  const listModel = selected.value.map((i: Any) => i.id)
  MethodsUtil.requestApiCustom(QuestionService.PostSendApproveSurvey, TYPE_REQUEST.POST, { listModel }).then((result: Any) => {
    getListSurvey()
    selected.value = []
    toast('SUCCESS', t(result.message))
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
  })
}
const disabledApprove = computed(() => {
  if (selected.value.length > 0)
    return !selected.value.every((element: Any) => element.statusId === 1)

  return true
})

function handleActionHeader(val: string) {
  switch (val) {
    case 'approve':
      approveSurvey()
      break

    default:
      break
  }
}

const isShowFeedBack = ref(false)
const message = ref('')
function GetFeedBackRejectSurvey(id: number) {
  MethodsUtil.requestApiCustom(QuestionService.GetFeedBackRejectSurvey, TYPE_REQUEST.GET, { id }).then((result: Any) => {
    message.value = result.data.feedback
  })
}

async function actionItem([{ id, name }, content]: [Any, Any]) {
  switch (id) {
    case 5:
      isShowFeedBack.value = true
      GetFeedBackRejectSurvey(content.id)
      break
    case 4:
      //
      break
    case 3:
      selected.value = [content]
      sendApproveSurvey()
      break
    case 1:
      router.push({ name: 'edit-survey', params: { id: content.id } })
      break
    case 8:

      //
      break
    case 9:
      selected.value = [content]
      approveSurvey()
      break

    default:
      break
  }
}
</script>

<template>
  <div>
    <CpActionHeaderPage
      :title="t('survey-list')"
      is-custom-add-btn
      :is-custom-btn="isApproveSurvey"
      :title-custom-add="t('add-survey-course')"
      :title-custom="t('approval-survey')"
      @click="addSurvey"
    />
  </div>
  <CmCollapse :is-show="isShowFilter">
    <CpFilterSurvey
      v-model:status-id="queryParams.statusId"
      v-model:author-id="queryParams.authorId"
      v-model:from-date="queryParams.fromDate"
      v-model:to-date="queryParams.toDate"
      v-model:page-number="queryParams.pageNumber"
      v-model:page-size="queryParams.pageSize"
    />
  </CmCollapse>

  <div class="my-2">
    <CpHeaderAction
      v-model:show-filter="isShowFilter"
      v-model:keyword="queryParams.search"
      v-model:page-number="queryParams.pageNumber"
      v-model:page-size="queryParams.pageSize"
      class="my-4"
      is-fillter
      is-delete
      :is-approve="isApproveSurvey"
      :disabled-approve="disabledApprove"
      :disabled-delete="selected.length === 0"
      @click="handleActionHeader"
    >
      <template #actionLeft />
    </CpHeaderAction>
  </div>
  <div>
    <CmTable
      v-model:page-number="queryParams.pageNumber"
      v-model:page-size="queryParams.pageSize"
      v-model:selected="selected"
      :headers="headers"
      :items="items"
      return-object
      :total-record="totalRecord"
    >
      <template #rowItem="{ col, context }">
        <div v-if="col === 'name'">
          <CpCustomInforCourse
            :context="context"
            label-title="name"
            is-sub-title
            label-sub-title="statusId"
          />
        </div>
        <div v-if="col === 'startTime'">
          {{ DateUtil.formatDateToDDMM(context.startTime) }}
        </div>
        <div v-if="col === 'endTime'">
          {{ DateUtil.formatDateToDDMM(context.endTime) }}
        </div>
      </template>
    </CmTable>
  </div>

  <CpMdFeedBackReject
    v-model:is-show="isShowFeedBack"
    :title="t('Xem phản hồi')"
    :message="message"
  />
</template>

<script setup lang="ts">
import CpSurveyFilter from './CpSurveyFilter.vue'
import CmCollapse from '@/components/common/CmCollapse.vue'
import ObjectUtil from '@/utils/ObjectUtil'
import MethodsUtil from '@/utils/MethodsUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CpQuestionName from '@/components/page/gereral/CpQuestionName.vue'
import CmTable from '@/components/common/CmTable.vue'
import type { Any } from '@/typescript/interface'
import CmButton from '@/components/common/CmButton.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import { tableStore } from '@/stores/table'
import { SurveyType } from '@/constant/data/questionType.json'
import type { Params } from '@/typescript/interface/params'
import CpConfirmDialogVue from '@/components/page/gereral/CpConfirmDialog.vue'
import toast from '@/plugins/toast'
import CpContentView from '@/components/page/gereral/CpContentView.vue'
import CpMdSurveyView from '@/components/page/Admin/content/survey/modal/CpMdSurveyView.vue'

const CpActionHeaderPage = defineAsyncComponent(() => import('@/components/page/gereral/CpActionHeaderPage.vue'))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()

/** data */
// bật tắt filter
const isShowFilter = ref(true)
const items = ref<Any[]>([])
const totalRecord = ref<number>(0)
const selected = ref<any[]>([])
interface QueryParam extends Params {
  topicId?: any
  statusId?: any
  typeId?: any
  newUserId?: any
  dateFrom?: any
  dateTo?: any
  keyword?: any
}

const queryParams = ref<QueryParam>({
  pageSize: 10,
  pageNumber: 1,
})
const headers = [
  { text: '', value: 'checkbox', width: 50 },
  { text: t('question'), value: 'name', type: 'custom', width: 750 },
  { text: t('question-type'), value: 'type', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
]
const isShowDetailAll = ref(false)
const questionCurrentView = ref()
const isShowModalView = ref(false)

/** computed */
const disabledBtnHeaderAction = computed(() => !selected.value.length)
const isShowModalConfirmSendApprove = ref(false)

// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  switch (type) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
      break
    case 'send-approve':
      isShowModalConfirmSendApprove.value = true
      break

      // case 'delete':
      //   deleteItems()
      //   break

    default:
      break
  }
}

// search ở fillter header
async function handleSearch(value: any) {
  queryParams.value.pageNumber = 1
  queryParams.value.keyword = value
}
function handlerActionHeader(type: any) {
  switch (type) {
    case 'handlerAddButton':
      router.push({ name: 'survey-add' })
      break

    default:
      break
  }
}
const storeTable = tableStore()
const { callBackAction } = storeToRefs(storeTable)
callBackAction.value = actionItem
async function getListQuestion() {
  await MethodsUtil.requestApiCustom(QuestionService.GetListSurvey, TYPE_REQUEST.GET, queryParams.value).then(({ data }: any) => {
    data?.pageLists.forEach((element: any) => {
      element.actions = [
        MethodsUtil.checkActionType({ id: 1 }),
        MethodsUtil.checkActionType({ id: 2 }),
        MethodsUtil.checkActionType({ id: 4 }),
      ]
    })
    items.value = data?.pageLists
    totalRecord.value = data?.totalRecord
  })
}
const isShowModalConfirmDelete = ref(false)

// hàm trả về các loại action khi click
async function actionItem(type: any) {
  switch (type[0]?.name) {
    case 'ActionEdit':
      router.push({ name: 'survey-edit', params: { id: type[1].id } })
      break
    case 'ActionViewDetail':

      if (window._.isEmpty(type[1]?.questionData)) {
        const result = ref()
        await getInforSurvey(result, type[1].id).then(() => {
          items.value[type[1].originIndex] = { ...items.value[type[1].originIndex], ...result.value[0] }
          questionCurrentView.value = items.value[type[1].originIndex]
          setTimeout(() => {
            isShowModalView.value = true
          }, 500)
        })
      }
      else {
        questionCurrentView.value = items.value[type[1].originIndex]
        isShowModalView.value = true
      }
      break
    case 'ActionDelete':
      selected.value = [type[1].id]
      isShowModalConfirmDelete.value = true
      break

    default:
      break
  }
}
onMounted(async () => {
  if (Object.keys(route.query).length > 1) {
    queryParams.value.keyword = route.query.keyword ? route.query.keyword as string : queryParams.value.keyword
    queryParams.value.pageNumber = route.query.pageNumber ? Number(route.query.pageNumber) : queryParams.value.pageNumber
    queryParams.value.pageSize = route.query.pageSize ? Number(route.query.pageSize) : queryParams.value.pageSize
    queryParams.value.statusId = route.query.statusId ? Number(route.query.statusId) : queryParams.value.statusId
    queryParams.value.typeId = route.query.typeId ? Number(route.query.typeId) : queryParams.value.typeId
    queryParams.value.topicId = (route.query.topicId && route.query.topicId.length) ? (route.query.topicId as any)?.map((item: any) => Number(item)) : []
    queryParams.value.dateFrom = route.query.dateFrom ? route.query.dateFrom as string : ''
    queryParams.value.dateTo = route.query.dateTo ? route.query.dateTo as string : queryParams.value.dateTo
  }
  else { await getListQuestion() }
})

watch(queryParams, (val: Any) => {
  const params = ObjectUtil.omitByDeep(val)
  router.push({
    query: {
      tab: route.query.tab,
      ...params,
    },
  })
  getListQuestion()
}, { deep: true })
function exportExcel() {
  const payload: any = window._.cloneDeep(queryParams.value)
  delete payload.pageSize
  delete payload.pageNumber
  MethodsUtil.dowloadSampleFile(QuestionService.PostExportExcelSurvey, TYPE_REQUEST.POST, 'DanhSachCauKhaoSat.xlxs', payload)
}

function confirmDelete() {
  MethodsUtil.requestApiCustom(QuestionService.PostDeleteSurvey, TYPE_REQUEST.POST, { listId: selected.value.map(i => i.id) }).then((result: Any) => {
    toast('SUCCESS', t('success-delete-gift-group'))
    getListQuestion()
    selected.value = []
  }).catch((err: Any) => {
    toast('SUCCESS', t(err.response.data.message))
  })
}

function sendApprove() {
  const model = {
    listId: selected.value.filter(el => el.statusName === 'CourseService.Unsent'),
  }

  if (model.listId.length) {
    MethodsUtil.requestApiCustom(QuestionService.PostSurveySubmit, TYPE_REQUEST.POST, model).then((result: Any) => {
      toast('SUCCESS', t('LOG_SendAgreeSuccessAction'))
      getListQuestion()
      selected.value = []
    }).catch((err: Any) => {
      const message = err.response.data.message === 'USR_FieldIsRequired' ? 'survey.req-approve' : err.response.data.message
      toast('SUCCESS', t(message))
    })
  }
  else {
    toast('ERROR', t('req-approve'))
  }
}
const loadingShow = ref(false)
async function getInforSurvey(result: any, id: number) {
  loadingShow.value = true
  const params = {
    listId: [Number(id)],
  }
  await MethodsUtil.requestApiCustom(QuestionService.PostSurveyDetail, TYPE_REQUEST.POST, params).then(({ data }: any) => {
    result.value = data
  })
}
async function getInforSurveyDetail(result: any, listId: any) {
  loadingShow.value = true
  const params = {
    listId,
  }
  await MethodsUtil.requestApiCustom(QuestionService.PostSurveyDetail, TYPE_REQUEST.POST, params).then(({ data }: any) => {
    result.value = data
    data.forEach((item: any, id: number) => {
      item.isExpand = isShowDetailAll.value
      items.value[id] = {
        ...items.value[id],
        ...item,
      }
    })
  })
}
async function openDetail(dataQs: any, el: any) {
  const result = ref()

  if (window._.isEmpty(dataQs?.surveyData)) {
    items.value[dataQs.originIndex].loadingShow = true

    await getInforSurvey(result, dataQs.id).then(() => {
      items.value[dataQs.originIndex] = { ...items.value[dataQs.originIndex], ...result.value[0] }
      setTimeout(() => {
        items.value[dataQs.originIndex].loadingShow = false
      }, 500)
    })
  }
  items.value[dataQs.originIndex].isExpand = true
}
async function closeDetail(dataQs: any) {
  items.value[dataQs.originIndex].isExpand = false
}

async function showDetailAll() {
  isShowDetailAll.value = !isShowDetailAll.value
  const result = ref()
  const listId = items.value.map((item: any) => item.id)
  await getInforSurveyDetail(result, listId)
}
</script>

<template>
  <div>
    <div class="mt-6">
      <CpActionHeaderPage
        :title="t('surveys')"
        :title-custom-add="t('create-question')"
        is-export-btn
        is-custom-add-btn
        @click="handlerActionHeader"
        @exportExcel="exportExcel"
      />
    </div>
    <CmCollapse :is-show="isShowFilter">
      <CpSurveyFilter
        v-model:topicId="queryParams.topicId"
        v-model:statusId="queryParams.statusId"
        v-model:question-type="queryParams.typeId"
        v-model:owner-id="queryParams.newUserId"
        v-model:date-from="queryParams.dateFrom"
        v-model:date-to="queryParams.dateTo"
        v-model:page-number="queryParams.pageNumber"
      />
    </CmCollapse>
    <div class="my-3">
      <CpHeaderAction
        is-delete
        is-send-approve
        :disabled-delete="disabledBtnHeaderAction"
        :disabled-send-approve="disabledBtnHeaderAction"
        is-fillter
        @click="handleClickBtn"
        @update:keyword="handleSearch"
        @delete-multiple="() => { isShowModalConfirmDelete = true }"
      >
        <template #actionRight>
          <CmButton
            class="ml-3"
            bg-color="bg-white"
            color="white"
            text-color="color-dark"
            :size-icon="20"
            :icon="isShowDetailAll ? 'tabler:eye' : 'tabler:eye-off'"
            :title="isShowDetailAll ? t('collapse-all') : t('show-all')"
            @click="showDetailAll"
          />
        </template>
      </CpHeaderAction>
    </div>
    <div>
      <CmTable
        v-model:pageNumber="queryParams.pageNumber"
        v-model:pageSize="queryParams.pageSize"
        v-model:selected="selected"
        is-update-row-force
        :headers="headers"
        :items="items"
        return-object
        :total-record="totalRecord"
      >
        <template #rowItem="{ col, context, dataCol }">
          <div v-if="col === 'name'">
            <CpQuestionName
              :status="context.statusId"
              :content-basic="context.contentBasic"
              :is-expand="isShowDetailAll || context.isExpand"
              @update:open="($event: any) => openDetail(context, $event)"
              @update:close="closeDetail(context)"
            >
              <div v-show="context.loadingShow">
                <VProgressLinear
                  indeterminate
                  color="primary"
                />
              </div>
              <CpContentView
                v-if="!context.loadingShow && context.isExpand"
                :type="context.questionTypeId"
                :data="context"
                :show-content="false"
                :show-media="false"
                :is-survey="true"
                :max-width="dataCol.width"
              />
            </CpQuestionName>
          </div>
          <div v-if="col === 'type'">
            <div>{{ t((SurveyType as any)[context?.questionTypeId?.toString()]) }}</div>
          </div>
        </template>
      </CmTable>
    </div>
    <CpConfirmDialogVue
      v-model:is-dialog-visible="isShowModalConfirmDelete"
      :confirmation-msg="t('delete-survey-test')"
      :type="2"
      @confirm="confirmDelete"
    />
    <CpConfirmDialogVue
      v-model:is-dialog-visible="isShowModalConfirmSendApprove"
      :confirmation-msg="t('warning-request-approve-question-survey')"
      :type="1"
      @confirm="sendApprove"
    />
    <CpMdSurveyView
      v-model:isShowModal="isShowModalView"
      :data="questionCurrentView"
    />
  </div>
</template>

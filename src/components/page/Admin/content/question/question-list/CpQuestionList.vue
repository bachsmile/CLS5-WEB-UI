<script setup lang="ts">
import CmCollapse from '@/components/common/CmCollapse.vue'
import ObjectUtil from '@/utils/ObjectUtil'
import MethodsUtil from '@/utils/MethodsUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CpQuestionFilter from '@/components/page/Admin/content/question/question-list/CpQuestionFilter.vue'
import CpQuestionName from '@/components/page/gereral/CpQuestionName.vue'
import CmTable from '@/components/common/CmTable.vue'
import type { Any } from '@/typescript/interface'
import CmButton from '@/components/common/CmButton.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import { QuestionType } from '@/constant/data/questionType.json'
import { tableStore } from '@/stores/table'

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
const dataComponent = reactive({
  deleteIds: [] as any, // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})

const queryParams = ref<any>({
  topic: null as any,
  level: null,
  isGroup: null,
  createdBy: null,
  type: null,
  status: null,
  pageSize: 10,
  pageToken: null,
  searchTerm: null,
  sortBy: null,
  startDate: null,
  endDate: null,
})
const headers = [
  { text: '', value: 'checkbox', width: 50 },
  { text: t('question'), value: 'name', type: 'custom', width: 450 },
  { text: t('question-type'), value: 'type', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
]
const isShowDetailAll = ref(false)

/** computed */
const disabledBtnHeaderAction = computed(() => !dataComponent.selectedRowsIds.length)

/** method */
//  fillter header
async function handleFilterCombobox(dataFilter: any) {
  queryParams.value = {
    ...queryParams.value,
    ...dataFilter,
  }
}

// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  switch (type) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
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
      router.push({ name: 'question-add' })
      break

    default:
      break
  }
}
const storeTable = tableStore()
const { callBackAction } = storeToRefs(storeTable)
callBackAction.value = actionItem
async function getListQuestion() {
  await MethodsUtil.requestApiCustomV5(QuestionService.GetListQuestionV5, TYPE_REQUEST.GET, queryParams.value).then(({ data }: any) => {
    console.log(data)

    data?.listData.forEach((element: any) => {
      element.actions = [
        MethodsUtil.checkActionType({ id: 1 }),
        MethodsUtil.checkActionType({ id: 2 }),
        MethodsUtil.checkActionType({ id: 4 }),
      ]
    })
    items.value = data?.listData
    totalRecord.value = data?.totalRecords
  })
}

// hàm trả về các loại action khi click
function actionItem(type: any) {
  switch (type[0]?.name) {
    case 'ActionEdit':
      router.push({ name: 'question-edit', params: { id: type[1].id } })
      break
    case 'ActionViewDetail':
      // router.push({ name: 'question-view', params: { id: type[1].id } })
      break

    default:
      break
  }
}
onMounted(async () => {
  if (Object.keys(route.query).length > 1) {
    queryParams.value.keyword = route.query.keyword ? route.query.keyword as string : queryParams.value.keyword
    queryParams.value.sort = route.query.sort ? route.query.sort as string[] : []
    queryParams.value.pageNumber = route.query.pageNumber ? Number(route.query.pageNumber) : queryParams.value.pageNumber
    queryParams.value.pageSize = route.query.pageSize ? Number(route.query.pageSize) : queryParams.value.pageSize
    queryParams.value.statusId = route.query.statusId ? Number(route.query.statusId) : queryParams.value.statusId
    queryParams.value.typeId = route.query.typeId ? Number(route.query.typeId) : queryParams.value.typeId
    queryParams.value.userId = route.query.userId ? Number(route.query.userId) : queryParams.value.userId
    queryParams.value.levelId = route.query.levelId ? Number(route.query.levelId) : queryParams.value.levelId
    queryParams.value.groupId = route.query.groupId ? Number(route.query.groupId) : queryParams.value.groupId
    queryParams.value.topicId = (route.query.topicId && route.query.topicId.length) ? (route.query.topicId as any)?.map((item: any) => Number(item)) : []
    queryParams.value.dateFrom = route.query.dateFrom ? route.query.dateFrom as string : ''
    queryParams.value.dateTo = route.query.dateTo ? route.query.dateTo as string : queryParams.value.dateTo
    queryParams.value.role = route.query.role ? Number(route.query.role) : 1
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
</script>

<template>
  <div>
    <div>
      <CpActionHeaderPage
        :title="t('questions')"
        :title-custom-add="t('create-question')"
        is-export-btn
        is-custom-add-btn
        @click="handlerActionHeader"
      />
    </div>
    <CmCollapse :is-show="isShowFilter">
      <CpQuestionFilter
        v-model:topicId="queryParams.topicId"
      />
    </CmCollapse>
    <div>
      <CpHeaderAction
        is-delete
        is-send-approve
        :disabled-delete="disabledBtnHeaderAction"
        :disabled-send-approve="disabledBtnHeaderAction"
        is-fillter
        @click="handleClickBtn"
        @update:keyword="handleSearch"
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
            @click="() => isShowDetailAll = !isShowDetailAll"
          />
        </template>
      </CpHeaderAction>
    </div>
    <div>
      <CmTable
        v-model:pageNumber="queryParams.pageNumber"
        v-model:pageSize="queryParams.pageSize"
        v-model:selected="dataComponent.selectedRowsIds"
        is-update-row-force
        :headers="headers"
        :items="items"
        :total-record="totalRecord"
      >
        <template #rowItem="{ col, context, dataCol }">
          <div v-if="col === 'name'">
            <CpQuestionName
              v-bind="dataCol"
              :status="context.statusId"
              :content-basic="context.basic"
              :is-expand="isShowDetailAll"
            >
              a
            </CpQuestionName>
          </div>
          <div v-if="col === 'type'">
            <div>{{ t((QuestionType as any)[context?.typeId.toString()]) }}</div>
          </div>
        </template>
      </CmTable>
    </div>
  </div>
</template>

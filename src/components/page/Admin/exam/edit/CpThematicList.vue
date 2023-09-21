<script setup lang="ts">
import ObjectUtil from '@/utils/ObjectUtil'
import MethodsUtil from '@/utils/MethodsUtil'
import ExamService from '@/api/exam'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CmTable from '@/components/common/CmTable.vue'
import type { Any } from '@/typescript/interface'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import { tableStore } from '@/stores/table'
import { StatusTypeCourse } from '@/constant/data/status.json'
import DateUtil from '@/utils/DateUtil'
import CpEditThematic from '@/components/page/Admin/exam/edit/CpEditThematic.vue'

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
  pageSize: 10,
  pageNumber: 1,
  searchData: '',
  sort: [
    '-startDate',
  ],
})
const headers = ref([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-test'), value: 'name', type: 'custom' },
  { text: t('topic'), value: 'topicName' },
  { text: t('start-time'), value: 'startTime', type: 'custom' },
  { text: t('end-time'), value: 'endTime', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
])

/** computed */
const disabledBtnHeaderAction = computed(() => !dataComponent.selectedRowsIds.length)

/** method */
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
const modeView = ref('list')

function handlerActionHeader(type: any) {
  switch (type) {
    case 'handlerAddButton':
      modeView.value = 'edit'
      break

    default:
      break
  }
}
const storeTable = tableStore()
const { callBackAction } = storeToRefs(storeTable)
callBackAction.value = actionItem
async function getListThematic() {
  const params = {
    ...queryParams.value,
    examId: Number(route.params.id),
  }
  await MethodsUtil.requestApiCustom(ExamService.GetThematicList, TYPE_REQUEST.POST, params).then(({ data }: any) => {
    data?.pageLists.forEach((element: any) => {
      element.actions = [
        MethodsUtil.checkActionType({ id: 1 }),
        MethodsUtil.checkActionType({ id: 2 }),
      ]
    })
    items.value = data?.pageLists
    totalRecord.value = data?.totalRecords
  })
}

// hàm trả về các loại action khi click
async function actionItem(type: any) {
  const routerQuery = window._.cloneDeep(route.query)
  switch (type[0]?.name) {
    case 'ActionEdit':
      router.push({ name: 'exam-edit-thematic', query: { ...routerQuery }, params: { id: route.params.id, thematicId: type[1].id } })

      // nextTick(() => {
      //   modeView.value = 'edit'
      // })
      break
    case 'ActionViewDetail':
      //
      break

    default:
      break
  }
}
function onCancel() {
  modeView.value = 'list'
  getListThematic()
  callBackAction.value = actionItem
}

onMounted(async () => {
  callBackAction.value = actionItem
  if (Object.keys(route.query).length > 1) {
    queryParams.value.keyword = route.query.keyword ? route.query.keyword as string : queryParams.value.keyword
    queryParams.value.sort = route.query.sort ? route.query.sort as string[] : []
    queryParams.value.pageNumber = route.query.pageNumber ? Number(route.query.pageNumber) : queryParams.value.pageNumber
    queryParams.value.pageSize = route.query.pageSize ? Number(route.query.pageSize) : queryParams.value.pageSize
    queryParams.value.role = route.query.role ? Number(route.query.role) : 1
  }

  else { await getListThematic() }
  if (route.params.thematicId)
    modeView.value = 'edit'
})

watch(queryParams, (val: Any) => {
  const params = ObjectUtil.omitByDeep(JSON.parse(JSON.stringify(val)))
  router.push({
    query: {
      tab: route.query.tab,
      ...(route.query.tabThematic ? { tabThematic: route.query.tabThematic } : {}),
      ...params,
    },
  })

  if (route.params.thematicId)
    modeView.value = 'edit'
  getListThematic()
}, { deep: true })
</script>

<template>
  <div v-if="modeView === 'list'">
    <div class="mt-6">
      <CpActionHeaderPage
        :title="t('list-test')"
        :title-custom-add="t('add-test')"
        is-custom-add-btn
        @click="handlerActionHeader"
      />
    </div>
    <div class="my-3">
      <CpHeaderAction
        is-delete
        :is-fillter="false"
        :disabled-delete="disabledBtnHeaderAction"
        @click="handleClickBtn"
        @update:keyword="handleSearch"
      />
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
        <template
          #rowItem="{ col, context }"
        >
          <div v-if="col === 'name'">
            <div>{{ context.name }}</div>
            <div
              :class="`color-${MethodsUtil.checkStatus(context.statusId, StatusTypeCourse)?.color}`"
            >
              {{ t(MethodsUtil.checkStatus(context.statusId, StatusTypeCourse)?.name) }}
            </div>
          </div>
          <div v-if="col === 'startTime'">
            <span>{{ DateUtil.formatDateToDDMM(context.startDateTime) }}</span>
          </div>
          <div v-if="col === 'endTime'">
            <span>{{ DateUtil.formatDateToDDMM(context.endDateTime) }}</span>
          </div>
        </template>
      </CmTable>
    </div>
  </div>
  <div v-else>
    <CpEditThematic @onCancel="onCancel" />
  </div>
</template>

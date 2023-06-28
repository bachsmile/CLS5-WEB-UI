<script lang="ts" setup>
import CpHeaderActionExam from '@/components/page/Admin/exam/CpHeaderActionExam.vue'
import CmTable from '@/components/common/CmTable.vue'
import type { Any } from '@/typescript/interface'
import type { Params } from '@/typescript/interface/params'
import MethodsUtil from '@/utils/MethodsUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import StringUtil from '@/utils/StringUtil'
import DateUtil from '@/utils/DateUtil'
import CpCustomInforCourse from '@/components/page/gereral/CpCustomInforCourse.vue'
import { _ } from '@/utils/LodashUtil'
import ObjectUtil from '@/utils/ObjectUtil'

const { t } = window.i18n()

const headers = [
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-exam'), value: 'name', type: 'custom' },
  { text: t('user-create'), value: 'fullName' },
  { text: t('start-time'), value: 'startDateTime', type: 'custom', isDate: true },
  { text: t('end-time'), value: 'endDateTime', type: 'custom', isDate: true },
  { text: '', value: 'actions', width: 150 },
]
const items = ref<Any[]>([])
const totalRecord = ref<number>(0)
interface QueryParams extends Params {
  pageNumber: number
  statusId: number | null
  pageSize: number
  fromDate: string
  toDate: string
  sort: string[]
  searchData: string
  role: number
  authorId: number | null
}
const queryParams = reactive<QueryParams>({
  pageNumber: 1,
  pageSize: 10,
  fromDate: '',
  authorId: null,
  toDate: '',
  sort: ['-startDate'],
  searchData: '',
  role: 1,
  statusId: null,
})
const route = useRoute()
async function getListExam() {
  const { data } = await MethodsUtil.requestApiCustom(QuestionService.GetListExam, TYPE_REQUEST.GET, queryParams)
  data.pageLists.forEach((element: Any) => {
    element.actions = element.actions.map((el: Any) => {
      return MethodsUtil.checkActionType(el, actionItem)
    })
  })
  items.value = data.pageLists
  totalRecord.value = data.totalRecord
}
onMounted(async () => {
  if (!_.isEmpty(route.query)) {
    queryParams.pageNumber = route.query.pageNumber ? Number(route.query.pageNumber) : queryParams.pageNumber
    queryParams.statusId = route.query.statusId ? Number(route.query.statusId) : queryParams.statusId
    queryParams.pageSize = route.query.pageSize ? Number(route.query.pageSize) : queryParams.pageSize
    queryParams.fromDate = route.query.fromDate ? route.query.fromDate as string : ''
    queryParams.toDate = route.query.toDate ? route.query.toDate as string : queryParams.toDate
    queryParams.sort = route.query.sort ? route.query.sort as string[] : []
    queryParams.searchData = route.query.searchData ? route.query.searchData as string : queryParams.searchData
    queryParams.role = route.query.role ? Number(route.query.role) : 1
    queryParams.authorId = route.query.authorId ? Number(route.query.authorId) : null
  }
  else {
    await getListExam()
  }
})

function actionItem(type: any) {
  switch (type[0]?.name) {
    case 'ActionEdit':
      // console.log('ActionEdit')

      break
    default:
      break
  }
}
const router = useRouter()
watch(queryParams, (val: Any) => {
  const params = ObjectUtil.omitByDeep(val)
  router.push({ query: params })
  getListExam()
})

// xóa kỳ thi
const selected = ref<number[]>([])
function showModalDelete() {
  //
}
function addExam() {
  router.push({ name: 'exam-add', params: { tab: 'info' } })
}
</script>

<template>
  <CpHeaderActionExam
    v-model:toDate="queryParams.toDate"
    v-model:fromDate="queryParams.fromDate"
    v-model:authorId="queryParams.authorId"
    v-model:searchData="queryParams.searchData"
    v-model:statusId="queryParams.statusId"
    v-model:pageNumber="queryParams.pageNumber"
    v-model:pageSize="queryParams.pageSize"
    :disabled-delete="!selected.length"
    @click-delete="showModalDelete"
    @click-add="addExam"
  />
  <CmTable
    v-model:pageNumber="queryParams.pageNumber"
    v-model:pageSize="queryParams.pageSize"
    v-model:selected="selected"
    :headers="headers"
    :items="items"
    :total-record="totalRecord"
  >
    <template #rowItem="{ col, context, dataCol }">
      <div v-if="col === 'name'">
        <CpCustomInforCourse
          label-title="name"
          label-sub-title="statusId"
          :context="context"
        />
      </div>
      <div v-if="col === 'fullName'">
        {{ StringUtil.formatFullName(context.firstName, context.lastName) }}
      </div>
      <div v-if="dataCol?.isDate">
        {{ DateUtil.formatDateToDDMM(context[col]) }}
      </div>
    </template>
  </CmTable>
</template>

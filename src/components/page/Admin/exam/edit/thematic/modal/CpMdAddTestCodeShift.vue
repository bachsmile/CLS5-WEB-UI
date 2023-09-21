<script lang="ts" setup>
import CmDialogs from '@/components/common/CmDialogs.vue'
import type { Any } from '@/typescript/interface'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import ExamService from '@/api/exam'

const props = withDefaults(defineProps<Props>(), ({
  customKey: 'listUserId',
  typeId: 2,
  sizeMd: 'lg',
}))

const emit = defineEmits<Emit>()

const { t } = window.i18n()

const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))

interface Props {
  isDialogVisible: boolean
  idShift?: number
  sizeMd?: string
}
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', data: any): void
}

const queryParams = ref<any>({
  testId: null,
  shiftId: null,
  pageNumber: 1,
  pageSize: 10,
  search: '',
})
const route = useRoute()
const headers = ref([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('test-code'), value: 'name' },
  { text: t('number-question'), value: 'email' },
])
const listUser = ref<Any[]>([])
const totalRecord = ref<number>(0)
async function getListTestCodeShift() {
  queryParams.value.testId = Number(route.params.thematicId)
  queryParams.value.shiftId = props.idShift
  MethodsUtil.requestApiCustom(ExamService.GetListTestCodeShift, TYPE_REQUEST.GET, queryParams.value).then((result: any) => {
    listUser.value = result.data.pageLists
    totalRecord.value = result.data.totalRecord
  })
}

watch(queryParams.value, val => {
  getListTestCodeShift()
})
function hidden() {
  emit('update:isDialogVisible', false)
}

const listItem = ref<any>([])

async function confirm(idbtn: number, unload: any) {
  emit('confirm', listItem.value)
  setTimeout(() => {
    unload(idbtn)
  }, 1000)
}

// search ở fillter header
async function handleSearch(value: any) {
  queryParams.value.pageNumber = 1
  queryParams.value.search = value
}
getListTestCodeShift()
</script>

<template>
  <CmDialogs
    :is-dialog-visible="props.isDialogVisible"
    :title="t('add-exam-papers')"
    :size="sizeMd"
    :disabled-ok="!listItem.length"
    @cancel="hidden"
    @confirm="confirm"
    @show="getListTestCodeShift"
  >
    <div class="mb-5">
      <div class="text-medium-lg mb-6">
        {{ t('list-tests') }}
      </div>
      <CpHeaderAction
        :is-fillter="false"
        @update:keyword="handleSearch"
      />
    </div>

    <CmTable
      v-model:page-number="queryParams.pageNumber"
      v-model:selected="listItem"
      is-update-row-force
      :headers="headers"
      :items="listUser"
      :total-record="totalRecord"
      :type-pagination="2"
    />
  </CmDialogs>
</template>

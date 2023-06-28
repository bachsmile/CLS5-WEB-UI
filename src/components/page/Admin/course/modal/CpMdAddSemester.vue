<script setup lang="ts">
import toast from '@/plugins/toast'
import CpSearch from '@/components/page/gereral/CpSearch.vue'
import { StatusTypeCourse } from '@/constant/data/status.json'
import ReportService from '@/api/report'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'

const props = withDefaults(defineProps<Props>(), {
  isShow: false,
  excludeIds: [],
})

const emit = defineEmits<Emit>()

const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmChip = defineAsyncComponent(() => import('@/components/common/CmChip.vue'))

interface Props {
  isShow: boolean
  excludeIds?: any
  params?: any
}
interface Emit {
  (e: 'update:isShow', value: any): void
  (e: 'confirm', value: any): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

/** state */
const LABEL = Object.freeze({
  TITLE: t('add-semester'),
  PLH_SELECT: t('semester'),
})
const data = reactive({
  deleteIds: [], // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})
const queryParams = ref({
  keyword: '',
  pageNumber: 1,
  pageSize: 10,
  exceptIds: [] as any,
})
const headers = ref([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('exam-title'), value: 'testName' },
  { text: t('status-name'), value: 'statusName', type: 'custom' },
  { text: t('name-exam'), value: 'examName' },
  { text: t('semester'), value: 'semester', type: 'custom', width: 200 },
])
const items = ref()
const totalRecord = ref(0)
const typeMarkPeriorList = computed(() => {
  const combobox = []
  if (!props.params.listTypePeriorCurrent.includes(1))
    combobox.push({ key: t('middle-perior'), value: 1 })

  if (!props.params.listTypePeriorCurrent.includes(2))
    combobox.push({ key: t('end-perior'), value: 2 })

  return combobox
})

/** method */
async function onCancel() {
  emit('update:isShow', false)
}
async function onConfirm() {
  if (data.selectedRowsIds.length === 0) {
    toast('WARNING', t('please-choose-at-least') + t('exam-title').toLowerCase())
    return
  }
  const selectedIds = data.selectedRowsIds?.map(({ testId, typeId }) => ({ testId, typeId }))
  emit('confirm', {
    listData: selectedIds,
  })

  nextTick(() => {
    emit('update:isShow', false)
  })
}
async function getListSemester() {
  queryParams.value.exceptIds = props.excludeIds ? props.excludeIds : []
  await MethodsUtil.requestApiCustom(ReportService.PostComboboxTest, TYPE_REQUEST.POST, queryParams.value).then((value: any) => {
    if (value.data) {
      value.data.pageLists.forEach((element: any) => {
        element.selectedLevel = null
      })
      items.value = value.data.pageLists
      totalRecord.value = value.data.totalRecord
    }
  })
}
async function handleSearch() {
  queryParams.value.pageNumber = 1
  getListSemester()
}

// chuyển trang
async function handlePageClick(page: any) {
  queryParams.value.pageNumber = page
  getListSemester()
}
function selectedRows(e: any) {
  data.selectedRowsIds = e
}
function changeCellvalue(params: any, context: any) {
  items.value[context.originIndex].typeId = context?.typeId
}

watch(() => props.isShow, isShow => {
  if (isShow) {
    getListSemester()
  }
  else {
    queryParams.value.pageNumber = 1
    queryParams.value.pageSize = 10
    queryParams.value.keyword = ''
  }
})
</script>

<template>
  <div>
    <CmDialogs
      :title="LABEL.TITLE"
      :is-dialog-visible="isShow"
      :button-ok-name="t('save')"
      close-on-back
      persistent
      @cancel="onCancel"
      @confirm="onConfirm"
    >
      <div class="d-flex justify-end mb-6">
        <div class="w-50">
          <CpSearch
            v-model:key-search="queryParams.keyword"
            @update:key-search="handleSearch"
          />
        </div>
      </div>
      <CmTable
        v-model:pageSize="queryParams.pageSize"
        :headers="headers"
        :items="items"
        :total-record="totalRecord"
        :page-number="queryParams.pageNumber"
        return-object
        custom-id="testId"
        :type-pagination="2"
        @handlePageClick="handlePageClick"
        @update:selected="selectedRows"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'statusName'">
            <CmChip
              class="ma-2"
              :color="MethodsUtil.checkStatus(context.statusId, StatusTypeCourse)?.color"
            >
              <VIcon
                start
                icon="carbon:dot-mark"
                size="12"
              />
              <span>{{ t(context.statusName) }}</span>
            </CmChip>
          </div>
          <div v-if="col === 'semester'">
            <CmSelect
              v-model="context.typeId"
              :items="typeMarkPeriorList"
              :append-to-body="true"
              :placeholder="LABEL.PLH_SELECT"
              @update:modelValue="changeCellvalue($event, context)"
            />
          </div>
        </template>
      </CmTable>
    </CmDialogs>
  </div>
</template>

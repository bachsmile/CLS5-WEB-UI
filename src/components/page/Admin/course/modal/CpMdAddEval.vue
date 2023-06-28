<script setup lang="ts">
import toast from '@/plugins/toast'
import CpSearch from '@/components/page/gereral/CpSearch.vue'

import SurveyService from '@/api/survey'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'

const props = withDefaults(defineProps<Props>(), {
  isShowModalAddEval: false,
  excludeIds: [],
})

const emit = defineEmits<Emit>()

const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))

interface Props {
  isShowModalAddEval: boolean
  excludeIds?: any
}
interface Emit {
  (e: 'update:isShowModalAddEval', value: any): void
  (e: 'saveChange', value: any): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

/** state */
const LABEL = Object.freeze({
  TITLE: t('add-survey-course'),
})
const data = reactive({
  deleteIds: [], // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})
const queryParams = ref({
  keyword: '',
  pageNumber: 1,
  pageSize: 10,
  isActive: true,
  excludeIds: [] as any,
})
const headers = ref([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('KW_Survey_Exam_Name'), value: 'name' },
])
const items = ref()
const totalRecord = ref(0)

/** method */
async function onCancel() {
  emit('update:isShowModalAddEval', false)
}
async function onConfirm() {
  if (data.selectedRowsIds.length === 0) {
    toast('WARNING', t('please-choose-at-least') + t('EVT_Survey').toLowerCase())
    return
  }
  emit('saveChange', data.selectedRowsIds)

  nextTick(() => {
    emit('update:isShowModalAddEval', false)
  })
}
async function getListSurveyPerior() {
  queryParams.value.excludeIds = props.excludeIds ? props.excludeIds : []
  await MethodsUtil.requestApiCustom(SurveyService.PostListInforSurvey, TYPE_REQUEST.POST, queryParams.value).then((value: any) => {
    if (value.data) {
      items.value = value.data
      totalRecord.value = value.data[0]?.totalRecord
    }
  })
}
async function handleSearch() {
  queryParams.value.pageNumber = 1
  getListSurveyPerior()
}

// chuyển trang
async function handlePageClick(page: any) {
  queryParams.value.pageNumber = page
  getListSurveyPerior()
}
function selectedRows(e: any) {
  data.selectedRowsIds = e
}

watch(() => props.isShowModalAddEval, isShow => {
  if (isShow) {
    getListSurveyPerior()
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
      :is-dialog-visible="isShowModalAddEval"
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
        :type-pagination="2"
        @handlePageClick="handlePageClick"
        @update:selected="selectedRows"
      />
    </CmDialogs>
  </div>
</template>

<script setup lang="ts">
import toast from '@/plugins/toast'
import CpSearch from '@/components/page/gereral/CpSearch.vue'
import StringUtil from '@/utils/StringUtil'
import CourseService from '@/api/course/index'
import CmCollapse from '@/components/common/CmCollapse.vue'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import DateUtil from '@/utils/DateUtil'
import { contentManagerStore } from '@/stores/admin/course/content'

const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
  excludeIds: [],
})

const emit = defineEmits<Emit>()

const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CpFilterFromStockContent = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/CpFilterFromStockContent.vue'))

interface Props {
  isShowModal: boolean
  excludeIds?: any
}
interface Emit {
  (e: 'update:isShowModal', value: any): void
  (e: 'saveChange', value: any): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const storeContentManager = contentManagerStore()
const {
  paramsContentStock, dataStock,
} = storeToRefs(storeContentManager)

/** state */
const LABEL = Object.freeze({
  TITLE: t('add-from-stock-content'),
  PLH_SELECT: t('select-level'),
})

const headers = ref([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('content'), value: 'name' },
  { text: t('author-name'), value: 'author', type: 'custom' },
  { text: t('topicName'), value: 'topicName' },
  { text: t('type-content'), value: 'archiveTypeName' },
  { text: t('date-create'), value: 'createDate', type: 'custom' },
])
const items = ref()
const totalRecord = ref(0)
const isShowFilter = ref(true)

/** method */
async function onCancel() {
  emit('update:isShowModal', false)
}
async function onConfirm() {
  if (dataStock.value.selectedRowsIds.length === 0) {
    toast('WARNING', t('please-choose-at-least') + t('content').toLowerCase())
    return
  }
  emit('saveChange', dataStock.value.selectedRowsIds)

  nextTick(() => {
    emit('update:isShowModal', false)
  })
}
async function handleFilterComboboxStock(dataFilter: any) {
  paramsContentStock.value = {
    ...paramsContentStock.value,
    ...dataFilter,
  }

  await getListContentStock()
}
async function getListContentStock() {
  // paramsContentStock.value.excludeProficiencyLevelMapIdList = props.excludeIds ? props.excludeIds : []
  await MethodsUtil.requestApiCustom(CourseService.PostListStockContent, TYPE_REQUEST.POST, paramsContentStock.value).then((value: any) => {
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
  paramsContentStock.value.pageNumber = 1
  getListContentStock()
}

// chuyển trang
async function handlePageClick(page: any) {
  paramsContentStock.value.pageNumber = page
  getListContentStock()
}
function selectedRows(e: any) {
  dataStock.value.selectedRowsIds = e
}
function changeCellvalue(params: any, context: any) {
  items.value[context.originIndex].selectedLevel = context?.selectedLevel
}

watch(() => props.isShowModal, isShow => {
  if (isShow) {
    getListContentStock()
  }
  else {
    paramsContentStock.value.pageNumber = 1
    paramsContentStock.value.pageSize = 10
    paramsContentStock.value.searchData = ''
  }
})
</script>

<template>
  <div>
    <CmDialogs
      :title="LABEL.TITLE"
      :is-dialog-visible="isShowModal"
      :button-ok-name="t('save')"
      close-on-back
      persistent
      @cancel="onCancel"
      @confirm="onConfirm"
    >
      <CmCollapse :is-show="isShowFilter">
        <CpFilterFromStockContent
          @update="($event: any) => handleFilterComboboxStock($event)"
        />
      </CmCollapse>
      <div class="d-flex justify-end mb-6">
        <div class="w-50">
          <CpSearch
            v-model:key-search="paramsContentStock.searchData"
            @update:key-search="handleSearch"
          />
        </div>
      </div>
      <CmTable
        v-model:pageSize="paramsContentStock.pageSize"
        :headers="headers"
        :items="items"
        :total-record="totalRecord"
        :page-number="paramsContentStock.pageNumber"
        :type-pagination="2"
        @handlePageClick="handlePageClick"
        @update:selected="selectedRows"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'author'">
            {{ StringUtil.formatFullName(context.firstName, context.lastName) }}
          </div>
          <div v-if="col === 'createDate'">
            <span>{{ DateUtil.formatDateToDDMM(context[col]) }}</span>
          </div>
        </template>
      </CmTable>
    </CmDialogs>
  </div>
</template>

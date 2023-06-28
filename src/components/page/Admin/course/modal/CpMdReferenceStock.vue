<script setup lang="ts">
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CpSearch from '@/components/page/gereral/CpSearch.vue'
import toast from '@/plugins/toast'
import DateUtil from '@/utils/DateUtil'
import CourseService from '@/api/course/index'

const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
  excludeIds: [],
})

const emit = defineEmits<Emit>()

const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpCustomInfo = defineAsyncComponent(() => import('@/components/page/gereral/CpCustomInfo.vue'))

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
const route = useRoute()

/** state */
const LABEL = Object.freeze({
  TITLE: t('add-reference'),
})
const headers = ref([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-content'), value: 'name' },
  { text: t('topic'), value: 'thematicName' },
  { text: t('author-name'), value: 'authorName', type: 'custom' },
  { text: t('date-create'), value: 'registerDate', type: 'custom' },
])
const items = ref()
const totalRecord = ref(0)
const queryParams = ref({
  courseId: Number(route.params.id),
  searchByCourse: '',
  pageNumber: 1,
  pageSize: 10,
  searchByThemic: 0,
  excludeIds: [] as any,
})
const data = reactive({
  deleteIds: [], // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})

/** method */
async function onCancel() {
  emit('update:isShowModal', false)
}
async function getListContentRefer() {
  queryParams.value.excludeIds = props.excludeIds ? props.excludeIds : []
  await MethodsUtil.requestApiCustom(CourseService.PostListReferStock, TYPE_REQUEST.POST, queryParams.value).then((value: any) => {
    if (value.data) {
      items.value = value.data.pageLists
      totalRecord.value = value.data.totalRecord
    }
  })
}
function selectedRows(e: any) {
  data.selectedRowsIds = e
}

// chuyển trang
async function handlePageClick(page: any) {
  queryParams.value.pageNumber = page
  getListContentRefer()
}

// search ở fillter header
async function handleSearch() {
  queryParams.value.pageNumber = 1
  getListContentRefer()
}
async function onConfirm() {
  if (data.selectedRowsIds.length === 0) {
    toast('WARNING', t('please-choose-at-least') + t('content').toLowerCase())
    return
  }
  emit('saveChange', data.selectedRowsIds)
  nextTick(() => {
    emit('update:isShowModal', false)
  })
}
watch(() => props.isShowModal, isShow => {
  if (isShow) {
    getListContentRefer()
  }
  else {
    queryParams.value.pageNumber = 1
    queryParams.value.pageSize = 10
    queryParams.value.searchByCourse = ''
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
      @cancel="onCancel"
      @confirm="onConfirm"
    >
      <div class="d-flex justify-end mb-6">
        <div class="w-50">
          <CpSearch
            v-model:key-search="queryParams.searchByCourse"
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
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'authorName'">
            {{ MethodsUtil.formatFullName(context.firstName, context.lastName) }}
          </div>
          <div v-if="col === 'registerDate'">
            <span>{{ DateUtil.formatDateToDDMM(context.registerDate) }}</span>
          </div>
        </template>
      </CmTable>
    </CmDialogs>
  </div>
</template>

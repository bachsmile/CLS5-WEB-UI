<script setup lang="ts">
import MethodsUtil from '@/utils/MethodsUtil'
import UserService from '@/api/user/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CpSearch from '@/components/page/gereral/CpSearch.vue'
import toast from '@/plugins/toast'

const props = withDefaults(defineProps<Props>(), {
  isShowModalAddTeacher: false,
  excludeIds: [],
})

const emit = defineEmits<Emit>()

const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpCustomInfo = defineAsyncComponent(() => import('@/components/page/gereral/CpCustomInfo.vue'))

interface Props {
  isShowModalAddTeacher: boolean
  excludeIds?: any
}
interface Emit {
  (e: 'update:isShowModalAddTeacher', value: any): void
  (e: 'saveChange', value: any): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

/** state */
const LABEL = Object.freeze({
  TITLE: t('add-teacher'),
})
const headers = ref([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-lecturers'), value: 'fullName', type: 'custom' },
])
const items = ref()
const totalRecord = ref(0)
const queryParams = ref({
  keyword: '',
  pageNumber: 1,
  pageSize: 10,
  excludeIds: [] as any,
})
const data = reactive({
  deleteIds: [], // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})

/** method */
async function onCancel() {
  emit('update:isShowModalAddTeacher', false)
}
async function getListTeacher() {
  queryParams.value.excludeIds = props.excludeIds ? props.excludeIds : []
  await MethodsUtil.requestApiCustom(UserService.PostGetTeacher, TYPE_REQUEST.POST, queryParams.value).then((value: any) => {
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
  getListTeacher()
}

// search ở fillter header
async function handleSearch() {
  queryParams.value.pageNumber = 1
  getListTeacher()
}
async function onConfirm() {
  if (data.selectedRowsIds.length === 0) {
    toast('WARNING', t('please-choose-at-least') + t('user').toLowerCase())
    return
  }
  const selectedIds = data.selectedRowsIds?.map(({ selectedLevel }) => selectedLevel)
  emit('saveChange', selectedIds)
  nextTick(() => {
    emit('update:isShowModalAddTeacher', false)
  })
}
watch(() => props.isShowModalAddTeacher, isShow => {
  if (isShow) {
    getListTeacher()
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
      :is-dialog-visible="isShowModalAddTeacher"
      :button-ok-name="t('save')"
      close-on-back
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
        :type-pagination="2"
        @handlePageClick="handlePageClick"
        @update:selected="selectedRows"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'fullName'">
            <CpCustomInfo
              :context="context"
            />
          </div>
        </template>
      </CmTable>
    </CmDialogs>
  </div>
</template>

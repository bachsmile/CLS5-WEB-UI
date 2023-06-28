<script setup lang="ts">
import toast from '@/plugins/toast'
import CpSearch from '@/components/page/gereral/CpSearch.vue'

import UserService from '@/api/user'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'

const props = withDefaults(defineProps<Props>(), {
  isShowModalAddCapacity: false,
  excludeIds: [],
})

const emit = defineEmits<Emit>()

const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))

interface Props {
  isShowModalAddCapacity: boolean
  excludeIds?: any
}
interface Emit {
  (e: 'update:isShowModalAddCapacity', value: any): void
  (e: 'saveChange', value: any): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

/** state */
const LABEL = Object.freeze({
  TITLE: t('add-capacity'),
  PLH_SELECT: t('select-level'),
})
const data = reactive({
  deleteIds: [], // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})
const queryParams = ref({
  keyword: '',
  pageNumber: 1,
  pageSize: 10,
  excludeProficiencyLevelMapIdList: [] as any,
})
const headers = ref([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('proficiency'), value: 'proficiencyName' },
  { text: t('level'), value: 'levels', type: 'custom', width: 250 },
])
const items = ref()
const totalRecord = ref(0)

/** method */
async function onCancel() {
  emit('update:isShowModalAddCapacity', false)
}
async function onConfirm() {
  if (data.selectedRowsIds.length === 0) {
    toast('WARNING', t('please-choose-at-least') + t('proficiency').toLowerCase())
    return
  }
  const selectedIds = data.selectedRowsIds?.map(({ selectedLevel }) => selectedLevel)
  emit('saveChange', selectedIds)

  nextTick(() => {
    emit('update:isShowModalAddCapacity', false)
  })
}
async function getListCapacity() {
  queryParams.value.excludeProficiencyLevelMapIdList = props.excludeIds ? props.excludeIds : []
  await MethodsUtil.requestApiCustom(UserService.PostProciencyPaging, TYPE_REQUEST.POST, queryParams.value).then((value: any) => {
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
  getListCapacity()
}

// chuyển trang
async function handlePageClick(page: any) {
  queryParams.value.pageNumber = page
  getListCapacity()
}
function selectedRows(e: any) {
  data.selectedRowsIds = e
}
function changeCellvalue(params: any, context: any) {
  items.value[context.originIndex].selectedLevel = context?.selectedLevel
}

watch(() => props.isShowModalAddCapacity, isShow => {
  if (isShow) {
    getListCapacity()
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
      :is-dialog-visible="isShowModalAddCapacity"
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
        :type-pagination="2"
        @handlePageClick="handlePageClick"
        @update:selected="selectedRows"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'levels'">
            <CmSelect
              v-model="context.selectedLevel"
              :items="context.levels"
              custom-key="proficiencyLevelName"
              item-value="proficiencyLevelMapId"
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

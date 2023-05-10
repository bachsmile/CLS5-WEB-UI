<script setup lang="ts">
import ApiUser from '@/api/user/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { configStore } from '@/stores/index'
import toast from '@/plugins/toast'

const props = withDefaults(defineProps<Props>(), ({
  isDialogVisible: false,
  listId: () => ([]),
}))

const emit = defineEmits<Emit>()

// interface
interface Props {
  isDialogVisible: boolean
  listId?: Array<any>
  autoAssign?: any
}
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', value: any): void
}
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CpSearch = defineAsyncComponent(() => import('@/components/page/gereral/CpSearch.vue'))
const CmCheckBox = defineAsyncComponent(() => import('@/components/common/CmCheckBox.vue'))

/** ** Khởi tạo store */

/**
 * lib
 */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const configControl = configStore()
const { settingDefaults } = storeToRefs(configControl)
const DATA_LABEL = Object.freeze({
  TITLE: t('users.user-group.import-file.add'),
})

/**
 * data variable
 */
const headers = reactive([
  { text: '', value: 'checkbox' },
  { text: t('user-group-name'), value: 'nameGroup' },
  { text: t('description'), value: 'description', type: 'custom' },
])
const dataComponent = reactive({
  totalRecord: 0,
  listId: [], // list id các row table được chọn
})
const dataTableGroup = ref ([])
const autoAssignRef = ref (props.autoAssign)
const queryGetLists = reactive({
  listId: [],
  pageSize: 10,
  pageNumber: 1,
  searchData: '',
  sort: '',
  typeId: 2,
  isMinus: true,
})
const disableSave = ref(false)

/**
 *  method
 */
/** event dialog */
// get danh sách nhóm người dùng
const getListGroupModal = async (queryGetList: any) => {
  queryGetList.listId = props.listId
  window.showAllPageLoading('FULL')
  if (queryGetList === null)
    return []
  let strParam = ''
  strParam += `pageSize=${queryGetList.pageSize}&pageNumber=${queryGetList.pageNumber}&`
  if (queryGetList.searchData !== null && queryGetList.searchData !== undefined)
    strParam += `searchData=${queryGetList.searchData}&`

  // Thêm tham số listId dạng mảng
  strParam += `listId=${JSON.stringify(queryGetList.listId)}&`

  strParam += `sort=${queryGetList.sort}&typeId=${queryGetList.typeId}&isMinus=${queryGetList.isMinus}`
  await MethodsUtil.requestApiCustom(`${ApiUser.GetPagingUserGroup}?${strParam}`, TYPE_REQUEST.GET).then((value: any) => {
    dataTableGroup.value = value?.data?.pageLists
    dataComponent.totalRecord = value?.data?.totalRecord
  })

  window.hideAllPageLoading()
}

const onCancel = () => {
  emit('update:isDialogVisible', false)
}

const addGroupUser = () => {
  if (disableSave.value)
    return
  disableSave.value = true

  if (dataComponent.listId.length === 0) {
    const message = t('please-choose-at-least') + t('user').toLowerCase()
    toast('WARNING', t('notification'), t(message))

    disableSave.value = false
  }
  else {
    emit('confirm', dataComponent.listId)
    emit('update:isDialogVisible', false)
  }
}
const handlePageClick = async (page: any, size: any) => {
  queryGetLists.pageNumber = page
  queryGetLists.pageSize = size
  getListGroupModal(queryGetLists)
}
const onConfirmation = () => {
  addGroupUser()
}
const filterData = () => {
  queryGetLists.pageNumber = 1
  getListGroupModal(queryGetLists)
}
const selectedRows = (e: any) => {
  dataComponent.listId = e
}

const show = () => {
  if (autoAssignRef && Object.keys(autoAssignRef).length) {
    const autoCheckAssignUser = settingDefaults.value?.find(item => item.typeId === 7)
    if (autoCheckAssignUser && autoCheckAssignUser?.value) {
      autoAssignRef.course = true
      autoAssignRef.exam = true
    }
  }
  getListGroupModal(queryGetLists)
}

// watch
watch(() => props.isDialogVisible, value => {
  if (value) {
    show()
    disableSave.value = false
  }
}, { immediate: true })
</script>

<template>
  <div>
    <CmDialogs
      :disabled-ok="disableSave"
      :is-dialog-visible="isDialogVisible"
      :title="DATA_LABEL.TITLE"
      persistent
      @cancel="onCancel"
      @confirm="onConfirmation"
    >
      <div v-if="autoAssign">
        <small>{{ t('auto-assign-content') }}</small>
        <VRow class="mt-1">
          <VCol
            v-if="autoAssignRef.course !== null"
            md="3"
          >
            <CmCheckBox v-model="autoAssignRef.course">
              {{ t('course') }}
            </CmCheckBox>
          </VCol>
          <VCol
            v-if="autoAssignRef.exam !== null"
            md="3"
          >
            <CmCheckBox v-model="autoAssignRef.exam">
              {{ t('course') }}
            </CmCheckBox>
          </VCol>
        </VRow>
      </div>
      <VRow
        justify="end"
        class="my-2"
      >
        <VCol cols="4">
          <CpSearch
            v-model:key-search="queryGetLists.searchData"
            @update:key-search="filterData"
          />
        </VCol>
      </VRow>
      <div>
        <CmTable
          :headers="headers"
          :items="dataTableGroup"
          :total-record="dataComponent.totalRecord"
          @handlePageClick="handlePageClick"
          @update:selected="selectedRows"
        >
          <template #rowItem="{ col, context }">
            <div v-if="col === 'nameGroup'">
              {{ context.name }}
            </div>
            <div v-if="col === 'description'">
              {{ context.description }}
            </div>
          </template>
        </CmTable>
      </div>
    </CmDialogs>
  </div>
</template>

<style lang="scss">
.v-dialog .pagination-flex {
  justify-content: center !important;
}
</style>

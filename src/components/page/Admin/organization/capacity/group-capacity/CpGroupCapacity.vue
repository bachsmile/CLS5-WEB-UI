<script setup lang="ts">
import CpHeader from './CpHeader.vue'
import ApiGroupCapacity from '@/api/group-capacity/index'
import MethodsUtil from '@/utils/MethodsUtil'
import type { Params } from '@/typescript/interface/params'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { list } from '@/mock/capacity/index'
import toast from '@/plugins/toast'

// Khởi tạo
const CpAddGroup = defineAsyncComponent(() => import('./modal/CpAddGroup.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

/**
 * gọi api
 * @items danh sách nhóm năng lực
 * @totalRecord tổng số record
 * @params truyền vào call api
 * @headers phần header của table
 */
const items = ref<any>()
const totalRecord = ref<number>(0)

const headers = reactive([
  { text: '', value: 'checkbox' },
  { text: t('group-capacity-name'), value: 'name' },
  { text: t('description'), value: 'description' },
  { text: '', value: 'actions', width: 150 },
])

const TABLE = Object.freeze({
  TOOLTIP_EDIT: t('edit-group-capacity'),
  TOOLTIP_DELETE: t('delete-group-capacity'),
})

const params = ref<Params>({
  search: '',
  pageNumber: 1,
  pageSize: 10,
})

const getDataTable = async () => {
  const res = await MethodsUtil.requestApiCustom(ApiGroupCapacity.GroupCapacityList, TYPE_REQUEST.POST, params.value)

  items.value = res.data.pageLists
  totalRecord.value = res.data.totalRecord
}

getDataTable()

const handlePageClick = async (page: any) => {
  params.value.pageNumber = page
  await getDataTable()
}

const changeCellvalue = (val: number) => {
}

/**
 * Xửa lý component <CpHeader />
 * Delete
 * Show modal confirm Delete
 */
const deleteIds = ref<any[]>()
const disabledDelete = ref<boolean>(false)
const isShowModalConfirmDelete = ref<boolean>(false)

const selectedRows = (e: any) => {
  deleteIds.value = e
  disabledDelete.value = e.length > 0
}

const selectedAll = (e: any) => {
  deleteIds.value = items.value.map((e: any) => e.id)

  disabledDelete.value = e
}

const showModalConfirmDelete = () => {
  isShowModalConfirmDelete.value = true
}

const handleDeleteMultiple = async (val: boolean) => {
  if (val) {
    const res = await MethodsUtil.requestApiCustom(ApiGroupCapacity.DeleteGroup, TYPE_REQUEST.POST, { ids: deleteIds.value })
    if (res && res.code === 200) {
      toast('SUCCESS', t('USR_DeleteSuccess'))
      getDataTable()
    }
    else {
      toast('ERROR', t('error'))
    }
  }
}

/**
 * thêm nhóm năng lực
 */
const MODAL = Object.freeze({
  TITLE_ADD: t('users.capacity-management.proficiency-group.add'),
  TITLE_EDIT: t('users.capacity-management.proficiency-group.edit'),
})

const isShow = ref(false)

const showModalAdd = () => {
  isShow.value = true
}

const hideModalAdd = (val: any) => {
  isShow.value = val
}

const addGroup = async (val: any) => {
  const res = await MethodsUtil.requestApiCustom(ApiGroupCapacity.AddGroup, TYPE_REQUEST.POST, val)
  if (res && res.code === 200)
    toast('SUCCESS', t('common.add-success'))
  else
    toast('ERROR', t('error'))
}

/**
 * Chỉnh sửa dataDetail
 * getDetail
 * */
const dataDetail = ref({})

const getDetail = async (val: any) => {
  const res = await MethodsUtil.requestApiCustom(ApiGroupCapacity.DetailGroup, TYPE_REQUEST.GET, { id: val.id })

  dataDetail.value = { ...res.data }
  if (dataDetail)
    isShow.value = true
}

const editGroup = async (val: any) => {
  const res = await MethodsUtil.requestApiCustom(ApiGroupCapacity.UpdateGroup, TYPE_REQUEST.POST, val)
  if (res && res.code === 200) {
    toast('SUCCESS', t('USR_UpdateSuccess'))
    getDataTable()
  }
  else { toast('ERROR', t('error')) }
}

// Xóa nhóm năng  lực deleteItem
const deleteItem = async (val: any) => {
  deleteIds.value = [val.id]
  isShowModalConfirmDelete.value = true
}
</script>

<template>
  <div class="mt-3">
    <CpHeader
      :is-disable-delete="!disabledDelete"
      @showAdd="showModalAdd"
      @delete-multiple="showModalConfirmDelete"
    />
  </div>
  <div class="mt-3">
    <CmTable
      :headers="headers"
      :items="items"
      :total-record="totalRecord"
      @update:selected="selectedRows"
      @checked-all="selectedAll"
      @handlePageClick="handlePageClick"
      @changeCellvalue="changeCellvalue"
    >
      <template #actions="{ data }">
        <div
          class="px-2 "
        >
          <VIcon
            icon="mdi-pencil"
            :size="18"
            class="align-middle color-primary"
            @click="getDetail(data)"
          />
          <VTooltip
            activator="parent"
            location="top"
          >
            {{ TABLE.TOOLTIP_EDIT }}
          </VTooltip>
        </div>
        <div
          class="px-2 "
        >
          <VIcon
            icon="fe:trash"
            :size="18"
            class="align-middle color-error"
            @click="deleteItem(data)"
          />
          <VTooltip
            activator="parent"
            location="top"
          >
            {{ TABLE.TOOLTIP_DELETE }}
          </VTooltip>
        </div>
      </template>
    </CmTable>
  </div>
  <CpAddGroup
    v-model:is-show="isShow"
    :title="MODAL.TITLE_ADD"
    :data-detail="dataDetail"
    @ok="addGroup"
    @edit="editGroup"
  />
  <CpConfirmDialog
    v-model:is-dialog-visible="isShowModalConfirmDelete"
    :type="1"
    :confirmation-msg="t('Are-you-sure-you-want-to-delete-the-ability-group?')"
    @confirm="handleDeleteMultiple"
  />
</template>

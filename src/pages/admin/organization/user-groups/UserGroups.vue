<script setup lang="ts">
import UserService from '@/api/user'
import MethodsUtil from '@/utils/MethodsUtil'
import type { Params } from '@/typescript/interface/params'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CpContent from '@/components/page/Admin/organization/user-group/CpContent.vue'
import toast from '@/plugins/toast'
import router from '@/router'
import CpHeaderACtion from '@/components/page/Admin/organization/user-group/CpHeaderAction.vue'

const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

/**
 * Lấy dữ liệu bảng
 * */
const TABLE = Object.freeze({
  TOOLTIP_EDIT: t('Chỉnh sửa nhóm người dùng'),
  TOOLTIP_DELETE: t('Xóa nhóm người dùng'),
  TOOLTIP_REPORT: t('Xem báo cáo'),
})

const headers = reactive([
  { text: '', value: 'checkbox' },
  { text: t('name'), value: 'name', type: 'custom' },
  { text: t('number-user-in-group'), value: 'numberUser' },
  { text: t('number-course-group'), value: 'numberCourse' },
  { text: t('description'), value: 'description' },
  { text: '', value: 'actions', width: 150 },
])

const items = ref([])
const totalRecord = ref<number>()
const params = reactive<Params>({
  search: '',
  pageNumber: 1,
  pageSize: 10,
})
async function fetchData() {
  const { data } = await MethodsUtil.requestApiCustom(UserService.ListGroup, TYPE_REQUEST.GET, params)
  items.value = data.listData
  totalRecord.value = data.totalRecord
}
fetchData()
watch(params, val => {
  if (val.search) {
    params.pageNumber = 1

    return
  }
  fetchData()
})

function searchGroupUser(val: any) {
  params.search = val
  params.pageNumber = 1
  fetchData()
}

// Chỉnh sửa
function editGroupUser(id: number) {
  router.push({ name: 'admin-organization-user-groups-edit', params: { id, tab: 'info' } })
}

// Xóa từng item
const listId = ref<number[]>([])
const isShowModalConfirmDelete = ref(false)
function showModalConfirmDelete(val: number[]) {
  listId.value = val
  isShowModalConfirmDelete.value = true
}

function handleDeleteUserGroup() {
  MethodsUtil.requestApiCustom(UserService.DeleteGroup, TYPE_REQUEST.POST, { listModels: listId.value }).then((res: any) => {
    toast('SUCCESS', t('calendar.success-delete-group-user'))
    fetchData()
  }).catch(() => {
    toast('ERROR', t('error'))
  })
}

/**
 * Xử lý header
 * CpHeaderACtion
 * */
const HEADER = Object.freeze({
  TITLE_PAGE: t('list-group-user'),
  BUTTON_EXCEL: t('export-excel'),
  BUTTON_ADD: t('Add-new'),
})

const listItemButtonGroup = [
  {
    title: 'Thêm từ tập tin',
    icon: 'tabler:file-plus',
    key: 'importFile',
    action: () => {
      router.push({ name: 'admin-organization-user-groups-import' })
    },
  },
  {
    title: 'Thêm người dùng từ tập tin',
    icon: 'tabler:file-plus',
    key: 'importFileUser',
    action: () => {
      router.push({ name: 'admin-organization-user-groups-import-user' })
    },
  },
]

function exportExcel() {
  const payload = {
    language: 'vi',
  }
  MethodsUtil.dowloadSampleFile(UserService.PostExportExcelGroupUser, TYPE_REQUEST.POST, 'DanhSachNhomNguoiDung.xlsx', payload).catch(() => {
    toast('ERROR', t('error'))
  })
}
</script>

<template>
  <div class="w-100">
    <CpHeaderACtion
      :is-show-add="false"
      :list-item-button-group="listItemButtonGroup"
      :title-page="HEADER.TITLE_PAGE"
      :button-add="HEADER.BUTTON_ADD"
      :button-prepend="HEADER.BUTTON_EXCEL"
      @click-export="exportExcel"
      @update:key-search="searchGroupUser"
      @click-add="() => { router.push({ name: 'admin-organization-user-groups-add' }) }"
    />
  </div>
  <div class="w-100 mt-3">
    <CpContent
      v-model:pageNumber="params.pageNumber"
      v-model:list-id="listId"
      :headers="headers"
      :items="items"
      :total-record="totalRecord"
      :tootlip-report="TABLE.TOOLTIP_REPORT"
      :tootlip-delete="TABLE.TOOLTIP_DELETE"
      :tootlip-edit="TABLE.TOOLTIP_EDIT"
      :is-show-delete="true"
      :is-show-edit="true"
      :is-show-report="true"
      @update:data-delete="showModalConfirmDelete"
      @update:data-detail="editGroupUser($event.id)"
    />
    <!-- @change:page-number="fetchData" -->
  </div>
  <CpConfirmDialog
    v-model:is-dialog-visible="isShowModalConfirmDelete"
    :type="1"
    :confirmation-msg="t('users.user-group.warning-delete')"
    @confirm="handleDeleteUserGroup"
  />
</template>

<style lang="scss">
@use "/src/styles/style-global" as *;
</style>

<script lang="ts" setup>
import type { Header, Item } from 'vue3-easy-data-table'
import CpTablePermission from '@/components/page/Admin/organization/permission/CpTablePermission.vue'
import type { Params } from '@/typescript/interface/params'
import CpHeaderAction from '@/components/page/Admin/organization/user-group/CpHeaderAction.vue'
import apiPermission from '@/api/permission/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import toast from '@/plugins/toast'
import CpMdDeletePermission from '@/components/page/Admin/organization/permission/Modal/CpMdDeletePermission.vue'

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
interface HeaderPermission extends Header {
  type?: string
}
interface ParamsPermission extends Params {
  keyword: string
}
const params = reactive<ParamsPermission>({
  pageNumber: 1,
  pageSize: 10,
  keyword: '',
})
const router = useRouter()
const headers = ref<HeaderPermission[]>([
  { text: '', value: 'checkbox' },
  { text: t('userTypeName'), value: 'userTypeName' },
  { text: t('Administrator'), value: 'administrator', type: 'custom' },
  { text: t('Teacher'), value: 'teacher', type: 'custom' },
  { text: t('Learner'), value: 'learner', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
])
const items = ref<Item[]>([])
const totalRecord = ref<number>(0)
async function getListUserType() {
  const { data } = await MethodsUtil.requestApiCustom(apiPermission.listUserType, TYPE_REQUEST.GET, params)
  items.value = data?.pageLists
  totalRecord.value = data.totalRecord
}
getListUserType()
function search() {
  params.pageNumber = 1
  getListUserType()
}

// watch(params, val => {
//   getListUserType()
// })

// Chuyển trang thêm quyền
function addPermission() {
  router.push({ name: 'admin-organization-permission-add' })
}
function detailPermission(val: any) {
  router.push({ name: 'admin-organization-permission-edit', params: { id: val.id } })
}
const isShowModalDelete = ref<boolean>(false)
const TITLE_MODAL_DELETE = Object.freeze({
  TITLE_MODAL: t('delete-title'),
  TITLE_FEILD: t('instead-user-type'),
})
const comboboxUserType = ref<any[]>([])
async function getComboboxUserType() {
  const { data } = await MethodsUtil.requestApiCustom(apiPermission.comboboxUserType, TYPE_REQUEST.GET)
  comboboxUserType.value = data
}
const deleteId = ref<number>(0)
async function deleteItem(val: any) {
  deleteId.value = val
  await getComboboxUserType()
  isShowModalDelete.value = true
}

function handleDelete(val: number) {
  const payload = {
    deleteingUserTypeId: deleteId.value,
    newUserTypeId: val,
  }
  let message = 'success-delete'
  let typeErr: any = 'SUCCESS'
  MethodsUtil.requestApiCustom(apiPermission.deleteUserType, TYPE_REQUEST.POST, payload)
    .then((res: any) => {
      getListUserType()
      isShowModalDelete.value = false
    })
    .catch(() => {
      message = t('error')
      typeErr = 'ERROR'
    })
  toast(typeErr, t(message))
}
</script>

<template>
  <CpHeaderAction
    v-model:key-search="params.keyword"
    :is-show-export-excel="false"
    :is-show-delete="false"
    title-page="Danh sách kiểu người dùng"
    :is-show-move="false"
    :is-show-add-group="false"
    button-add="Thêm mới"
    button-prepend="Xuất excel"
    @click-add="addPermission"
    @update:key-search="search"
  />
  <CpTablePermission
    v-model:page-number="params.pageNumber"
    :headers="headers"
    :items="items"
    :total-record="totalRecord"
    @update:data-detail="detailPermission"
    @update:data-delete="deleteItem"
  />
  <CpMdDeletePermission
    v-model:isShow="isShowModalDelete"
    :title="TITLE_MODAL_DELETE.TITLE_MODAL"
    :name-feild="TITLE_MODAL_DELETE.TITLE_FEILD"
    :list="comboboxUserType"
    @confirm="handleDelete"
  />
</template>

<script lang="ts" setup>
import type { Header, Item } from 'vue3-easy-data-table'
import CpTablePermission from '@/components/page/Admin/organization/permission/CpTablePermission.vue'
import type { Params } from '@/typescript/interface/params'
import CpHeaderAction from '@/components/page/Admin/organization/user-group/CpHeaderAction.vue'
import apiPermission from '@/api/permission/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

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
const getListUserType = async () => {
  const { data } = await MethodsUtil.requestApiCustom(apiPermission.listUserType, TYPE_REQUEST.GET, params)
  items.value = data?.pageLists
  totalRecord.value = data.totalRecord
}
getListUserType()

watch(params, val => {
  getListUserType()
})

// Chuyển trang thêm quyền
const addPermission = () => {
  router.push({ name: 'admin-organization-permission-add' })
}
</script>

<template>
  <CpHeaderAction
    title-page="Danh sách kiểu người dùng"
    :is-show-move="false"
    :is-show-add-group="false"
    button-add="Thêm mới"
    button-prepend="Xuất excel"
    @click-add="addPermission"
  />
  <CpTablePermission
    v-model:page-number="params.pageNumber"
    :headers="headers"
    :items="items"
    :total-record="totalRecord"
  />
</template>


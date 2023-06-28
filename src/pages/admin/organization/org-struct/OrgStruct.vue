<script setup lang="ts">
import { orgStructManagerStore } from '@/stores/admin/org-struct/orgStruct'

const CpHeaderPageOrgStruct = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/CpHeaderPageOrgStruct.vue'))
const CpOrganizationListView = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/CpOrganizationListView.vue'))
const CpDeleteNodeOrg = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/modal/CpDeleteNodeOrg.vue'))
const CpModalAddOrgApi = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/modal/CpModalAddOrgApi.vue'))

/**
 * lib
 */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()

/**
 * store
 */
const storeOrgStruct = orgStructManagerStore()
const { render, apiType } = storeToRefs(storeOrgStruct)
const { getListOrgStruct, exportExcel, handleAddFromApi } = storeOrgStruct

/**
 *
 * params
 */
const data = reactive({
  isShowDialogDeleteNode: false,
  isShowDialogAddOrgApi: false,
  view: false,
})
const deleteOrgStructData = ref()
function deleteNode(dataDel: any) {
  deleteOrgStructData.value = dataDel
  data.isShowDialogDeleteNode = true
}
async function reloadOrgStruct() {
  await getListOrgStruct()
  render.value++
}
async function handleAddOrg(type: any) {
  switch (type) {
    case 'handlerAddButton':
      router.push({ name: 'admin-organization-org-struct-add', params: { tab: 'infor' } })
      break
    case 'actionAddFromApi':
      apiType.value = 'org'
      data.isShowDialogAddOrgApi = true
      break
    case 'actionAddFromApiTitle':
      apiType.value = 'title'
      data.isShowDialogAddOrgApi = true
      break

    default:
      break
  }
}
function changeView(view: boolean) {
  data.view = view
}
</script>

<template>
  <div>
    <CpHeaderPageOrgStruct
      :title-aprove="t('browse-user')"
      :title="t('user-list')"
      is-update-btn
      is-export-btn
      is-approve-btn
      @exportExcel="exportExcel"
      @changeView="changeView"
      @click="handleAddOrg"
    />
  </div>
  <div>
    <CpOrganizationListView
      v-if="!data.view"
      @delete-node="deleteNode"
    />
    <div v-else>
      view
    </div>
  </div>
  <div>
    <CpDeleteNodeOrg
      v-model:is-dialog-visible="data.isShowDialogDeleteNode"
      :delete-org-struct-data="deleteOrgStructData"
      @deleteSuccess="reloadOrgStruct"
    />
  </div>
  <div>
    <CpModalAddOrgApi
      v-model:is-dialog-visible="data.isShowDialogAddOrgApi"
      @confirm="handleAddFromApi"
    />
  </div>
</template>

<script setup lang="ts">
import ApiUser from '@/api/user/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { orgStructManagerStore } from '@/stores/admin/org-struct/orgStruct'
import DateUtil from '@/utils/DateUtil'
import { ActionType } from '@/constant/data/actionType.json'
import toast from '@/plugins/toast'

const CpActionHeaderPage = defineAsyncComponent(() => import('@/components/page/gereral/CpActionHeaderPage.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CpCustomInfo = defineAsyncComponent(() => import('@/components/page/gereral/CpCustomInfo.vue'))
const CpMdEditUserOrg = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/modal/CpMdEditUserOrg.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/**
 * store
 */

const storeOrgStruct = orgStructManagerStore()
const { organization, isView } = storeToRefs(storeOrgStruct)
const { fetchUserIds, backOrg, handleSaveOrg, handleSaveUpdateOrg } = storeOrgStruct

/** data */
const queryParams = reactive({
  orStructureId: null,
  pageNumber: 1,
  pageSize: 10,
  search: '',
})
const dataComponent = reactive({
  totalRecord: 0,
  deleteIds: [] as any, // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})
const disabledDelete = computed(() => !dataComponent.selectedRowsIds.length)
const isShowDialogAddUser = ref(false)
const isShowDialogNotiDelete = ref(false)
const userEdit = ref()

/**
 * data table
 */
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('surname-name'), value: 'fullName' },
  { text: t('title-position'), value: 'titleName' },
  { text: t('Register_Date'), value: 'registerDate', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
])
const items = ref ([])
const isEditUser = ref(false)
const disabledOk = ref(false)

/** method */
function reset() {
  dataComponent.deleteIds = []
  dataComponent.selectedRowsIds = []
}
function handlerActionHeader(type: any) {
  switch (type) {
    case 'handlerCustomButton':
      isEditUser.value = false
      isShowDialogAddUser.value = true
      break

    default:
      break
  }
}

// search ở fillter header
async function handleSearch(value: any) {
  queryParams.pageNumber = 1
  queryParams.search = value
  getPagingByUser()
}

// Function to handle when click button Delete
function handleDeleteItem(context: any) {
  dataComponent.deleteIds = []
  dataComponent.deleteIds.push(context.userId)
  isShowDialogNotiDelete.value = true
}
async function handleDeleteMultiple(value: any) {
  dataComponent.deleteIds = dataComponent.selectedRowsIds
  isShowDialogNotiDelete.value = true
}

// Chỉnh sửa chức danh trong cctc
async function handleEditTitle(content: any) {
  userEdit.value = content
  isEditUser.value = true
  isShowDialogAddUser.value = true
}
async function handlePageClick(value: any) {
  queryParams.pageNumber = value
  await getPagingByUser()
}
function selectedRows(e: any) {
  dataComponent.selectedRowsIds = e
}

// lưu người dùng
async function saveUsers(params: any) {
  if (params?.listUser?.length) {
    disabledOk.value = true
    await MethodsUtil.requestApiCustom(isEditUser.value ? ApiUser.PostUpdateUserOrg : ApiUser.PostAddUserOrg, TYPE_REQUEST.POST, params).then((value: any) => {
      toast('SUCCESS', t(value.message))
      queryParams.pageNumber = 1
      getPagingByUser()
      fetchUserIds()
      isShowDialogAddUser.value = false
    })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))
      })
  }

  setTimeout(() => {
    disabledOk.value = false
  }, 500)
}

// delete action
async function deleteAction() {
  const params = {
    orStructureId: organization.value.id,
    listUser: dataComponent.deleteIds,
  }

  await MethodsUtil.requestApiCustom(ApiUser.PostDeleteUserOrg, TYPE_REQUEST.POST, params)
    .then(async (value: any) => {
      toast('SUCCESS', t(value?.message))
      reset()
      await handlePageClick(1)
    })
    .catch((error: any) => {
      toast('ERROR', t(error.response.data.message))
    })
}

// hành động của dialog
function confirmDialog(event: any) {
  if (event)
    deleteAction()
}

async function getPagingByUser() {
  await MethodsUtil.requestApiCustom(ApiUser.getPagingUserOrgByList, TYPE_REQUEST.GET, queryParams).then((value: any) => {
    items.value = value.data.pageLists
    dataComponent.totalRecord = value.data.totalRecord
  })
}

watch(() => organization.value.id, val => {
  if (organization.value.id && organization.value.id !== null) {
    queryParams.orStructureId = organization.value.id
    getPagingByUser()
    fetchUserIds()
  }
}, { deep: true, immediate: true })
</script>

<template>
  <div>
    <div>
      <CpActionHeaderPage
        :title="t('user-list')"
        bg-custom="bg-primary"
        :title-custom="t('add-user')"
        is-custom-btn
        @click="handlerActionHeader"
      />
    </div>
    <div class="my-6">
      <CpHeaderAction
        :is-fillter="false"
        is-delete
        :disabled-delete="disabledDelete"
        @update:keyword="handleSearch"
        @deleteMultiple="handleDeleteMultiple"
      />
    </div>
    <div>
      <CmTable
        :headers="headers"
        :items="items"
        :total-record="dataComponent.totalRecord"
        :page-number="queryParams.pageNumber"
        custom-id="userId"
        @handlePageClick="handlePageClick"
        @update:selected="selectedRows"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'fullName'">
            <CpCustomInfo
              :context="context"
            />
          </div>
          <div v-if="col === 'registerDate'">
            <span>{{ DateUtil.formatDateToDDMM(context.registerDate) }}</span>
          </div>

          <div v-if="col === 'actions'">
            <span class="px-2">
              <VIcon
                :icon="ActionType[0].icon"
                :size="18"
                class="align-middle"
                :class="ActionType[0].color"
                @click="handleEditTitle(context)"
              />
              <VTooltip
                activator="parent"
                location="start"
              >
                {{ t(ActionType[0].name) }}
              </VTooltip>
            </span>
            <span class="px-2">
              <VIcon
                :icon="ActionType[1].icon"
                :size="18"
                class="align-middle"
                :class="ActionType[1].color"
                @click="handleDeleteItem(context)"
              />
              <VTooltip
                activator="parent"
                location="start"
              >
                {{ t(ActionType[1].name) }}
              </VTooltip>
            </span>
          </div>
        </template>
      </CmTable>
      <div
        width="100%"
        class="user-infor no-background py-5"
      >
        <CpActionFooterEdit
          :is-save="!isView"
          :title-cancel="t('come-back')"
          :title-save="t('save')"
          :title-save-and-update="t('save-and-update')"
          @onCancel="backOrg"
          @onSave="handleSaveOrg"
          @onSaveUpdate="handleSaveUpdateOrg"
        />
      </div>
    </div>
    <CpMdEditUserOrg
      v-model:is-dialog-visible="isShowDialogAddUser"
      v-model:disabledOk="disabledOk"
      :is-edit-user="isEditUser"
      :user-edit="userEdit"
      @confirm="saveUsers"
    />
    <CpConfirmDialog
      v-model:is-dialog-visible="isShowDialogNotiDelete"
      :type="2"
      variant="outlined"
      :confirmation-msg="t('delete')"
      @confirm="confirmDialog"
    />
  </div>
</template>

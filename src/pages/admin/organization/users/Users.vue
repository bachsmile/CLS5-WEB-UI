<script setup lang="ts">
import DateUtil from '@/utils/DateUtil'
import ApiUser from '@/api/user/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import toast from '@/plugins/toast'
import CmCollapse from '@/components/common/CmCollapse.vue'
import { tableStore } from '@/stores/table'
import CpActionHeaderPage from '@/components/page/gereral/CpActionHeaderPage.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CpUserFilter from '@/components/page/Admin/organization/users/CpUserFilter.vue'
import CmTable from '@/components/common/CmTable.vue'
import CmAccodion from '@/components/common/CmAccodion.vue'
import CmChip from '@/components/common/CmChip.vue'
import CpConfirmDialog from '@/components/page/gereral/CpConfirmDialog.vue'
import CpModalUpdateStatus from '@/components/page/Admin/organization/users/CpModalUpdateStatus.vue'
import CpCustomInfo from '@/components/page/gereral/CpCustomInfo.vue'
import CpModalAddUserApi from '@/components/page/Admin/organization/users/CpModalAddUserApi.vue'
import CpTableSub from '@/components/page/gereral/CpTableSub.vue'
import CpTableSubIconList from '@/components/page/gereral/CpTableSubIconList.vue'
import CpImportXml from '@/components/page/Admin/organization/users/modal/CpImportXml.vue'

// mock api

// window.showAllPageLoading('COMPONENT')

/** params */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const refTableUserList = ref()
const storeTable = tableStore()
const { callBackAction } = storeToRefs(storeTable)

const isShowFilter = ref(true)
const route = useRoute()
const router = useRouter()
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('surname-name'), value: 'fullName' },
  { text: t('role'), value: 'userTypeName' },
  { text: t('status-name'), value: 'statusName', type: 'custom' },
  { text: t('join-date'), value: 'registeredDate', type: 'custom' },
  { text: t('organization'), value: 'organization', type: 'menu' },
  { text: '', value: 'actions', width: 150 },
])

const orgModels = {
  value: 1,
  label: t('orgStruct'),
  icon: 'tabler-briefcase',
  colorClass: 'color-error',
  content: [],
}

const groupModels = {
  value: 1,
  label: 'Nhóm người dùng',
  icon: 'lucide:users',
  colorClass: 'color-warning',
  content: [],
}

const titleModels = {
  value: 1,
  label: 'Chức danh',
  icon: 'prime-check-circle',
  colorClass: 'color-success',
  content: [],
}

const items = ref ([])
const totalRecord = ref(0)
const modalContent = ref('')
const isShowDialogNoti = ref(false)

const data = reactive({
  deleteIds: [], // list id các row table muốn xóa
  listId: [], // list id các row table được chọn
  showPassword: false,
  isShowDialogPasword: false,
  isShowDialogStatus: false,
  isShowDialogAddUserApi: false,
  isShowDialogImportXml: false,
  typeDialogRessetPass: 1,
  selectedItemId: 0,
  testingCode: '',
})

let queryParam = reactive({
  groupUser: [],
  keyword: '',
  modeAdd: null,
  orStructure: [],
  pageNumber: 1,
  pageSize: 10,
  role: 1,
  sort: ['-createdDate'],
  statusList: null,
  timeFrom: '',
  timeTo: '',
  titleList: [],
  userTypeList: null,
})
const disabledDelete = computed(() => !data.listId.length)
const dataCustomAddUserBaseVn = ref()
const userXml = ref()

/** ***************************** Method *****************************/

// Function to handle when click button Delete
function deleteItem(id: number) {
  data.deleteIds = [id as never]
  modalContent.value = t('delete')
  isShowDialogNoti.value = true
}

// click  multi delete btn to show modal confirm
function deleteItems() {
  data.deleteIds = data.listId
  modalContent.value = t('delete')
  isShowDialogNoti.value = true
}

// delete action
async function deleteAction() {
  const params = {
    listId: data.deleteIds,
  }

  await MethodsUtil.requestApiCustom(ApiUser.UsersDelete, TYPE_REQUEST.POST, params)
    .then(async (value: any) => {
      toast('SUCCESS', t(value?.message))
      await fectchListUsers()
      data.deleteIds = []
      data.listId = []
    })
    .catch(() => {
      toast('ERROR', t('USR_DeleteFail'))
    })
}

// hành động của dialog
function confirmDialog(event: any) {
  if (event)
    deleteAction()
}

// cập nhật trạng thái dialog
function updateDialogVisible(event: any) {
  isShowDialogNoti.value = event
}

// reset password
async function handleRefresh() {
  const params = {
    userId: data.selectedItemId,
  }

  await MethodsUtil.requestApiCustom(ApiUser.ResetPassword, TYPE_REQUEST.POST, params).then((value: any) => {
    data.testingCode = value.data
    data.showPassword = true
    data.typeDialogRessetPass = 0
  })
}

function confirmDialogResetPass(event: any) {
  if (event)
    handleRefresh()
}

function updateDialogVisibleResset(event: any) {
  if (data.showPassword)
    data.isShowDialogPasword = event
}

// reset status
async function handleRefreshStatus(status: number) {
  const params = {
    userId: data.selectedItemId,
    statusId: status,
  }

  await MethodsUtil.requestApiCustom(ApiUser.ChangeStatus, TYPE_REQUEST.POST, params)
    .then(async (value: any) => {
      toast('SUCCESS', t(value?.message))
      await fectchListUsers()
    })
    .catch(() => {
      toast('ERROR', t('USR_UpdateFailed'))
    })
}

function confirmDialogStatus(status: any) {
  handleRefreshStatus(status)
}

function updateDialogVisibleStatus(event: any) {
  data.isShowDialogStatus = event
}

// coppy code
function copyTestingCode() {
  const testingCodeToCopy = document.querySelector('#testing-code') as HTMLInputElement

  testingCodeToCopy?.setAttribute('type', 'text')
  testingCodeToCopy?.select()
  try {
    const successful = document.execCommand('copy')
    const msg = successful ? 'successful' : 'unsuccessful'
  }
  catch (err) {}

  /* unselect the range */
  testingCodeToCopy?.setAttribute('type', 'hidden')
  window?.getSelection()?.removeAllRanges()
}

function selectedRows(e: any) {
  data.listId = e
}

// click pagination
async function handlePageClick(page: any) {
  queryParam.pageNumber = page
  await fectchListUsers()
}

// hàm trả về các loại action khi click
function actionItem(type: any) {
  switch (type[0]?.name) {
    case 'ActionDelete':
      deleteItem(type[1].id)
      break
    case 'issuePasswords':
      data.showPassword = false
      data.selectedItemId = type[1].id
      data.isShowDialogPasword = true
      break
    case 'changeStatus':
      data.selectedItemId = type[1].id
      data.isShowDialogStatus = true
      break
    case 'ActionEdit':
      router.push({ name: 'admin-organization-users-profile-edit', params: { tab: 'infor', id: type[1].id } })
      break

    default:
      break
  }
}
callBackAction.value = actionItem

// Get list Users
async function fectchListUsers() {
  // await fetchData(ApiUser.UsersList, TYPE_REQUEST.POST, queryParam)
  await MethodsUtil.requestApiCustom(ApiUser.UsersList, TYPE_REQUEST.POST, queryParam)
    .then((value: any) => {
      if (value?.data?.pageLists.length) {
        value.data.pageLists.forEach((item: any) => {
          const titleData = window._.clone(item.orgModels)

          item.orgModels = {
            ...orgModels,
            content: window._.clone(item.orgModels),
          }
          item.groupModels = {
            ...groupModels,
            content: window._.clone(item.groupModels),
          }
          item.titleModels = {
            ...titleModels,
            content: titleData,
          }
        })
      }
      items.value = value.data.pageLists
      totalRecord.value = value?.data?.totalRecord
    })
    .catch(() => {
      toast('ERROR', t('USR_GetFailed'))
    })
}

// search ở fillter header
async function handleSearch(value: any) {
  queryParam.pageNumber = 1
  queryParam.keyword = value
  await fectchListUsers()
}

//  fillter header
async function handleFilterCombobox(dataFilter: any) {
  queryParam = {
    ...queryParam,
    ...dataFilter,
  }

  await fectchListUsers()
}

// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  switch (type) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
      break
    case 'delete':
      deleteItems()
      break

    default:
      break
  }
}

function actionAddFromApi() {
  data.isShowDialogAddUserApi = true
}

async function exportExcel() {
  window.showAllPageLoading()
  const params = {
    statusIds: queryParam.statusList,
    userTypeIds: queryParam.userTypeList,
    keyword: queryParam.keyword,
    startDate: queryParam.timeFrom,
    endDate: queryParam.timeTo,
    modeAdd: queryParam.modeAdd,
    orStructure: queryParam.orStructure,
    groupUser: queryParam.groupUser,
  }
  await MethodsUtil.dowloadSampleFile(
    ApiUser.exportUserToExcel,
    'POST',
    'Danh sách người dùng.xlsx',
    params,
  )
  window.hideAllPageLoading()
}

/** ***************************** end Method *****************************/
/**
 * action
 */
const actionAdd = [
  {
    title: t('add-from-file'),
    icon: 'tabler:file-plus',
    action: () => {
      router.push({ name: 'admin-organization-user-import-file-add-user' })
    },
  },
  {
    title: t('add-from-api'),
    icon: 'tabler:folder-plus',
    action: actionAddFromApi,
  },

]
const actionUpdate = [
  {
    title: t('Update-user-info'),
    icon: 'tabler:folder-plus',
    action: () => {
      router.push({ name: 'admin-organization-user-import-file-update-user-infor' })
    },
  },
  {
    title: t('update-tile-from-file'),
    icon: 'tabler:folder-plus',
    action: () => {
      router.push({ name: 'admin-organization-user-import-file-update-user-title' })
    },
  },

]

function handlerActionHeader(type: any) {
  switch (type) {
    case 'handlerAddButton':

      router.push({ name: 'admin-organization-users-profile-add', params: { tab: 'infor' } })
      break
    case 'handlerCustomButton':

      router.push({ name: 'admin-organization-user-approve' })
      break

    default:
      break
  }
}
function handleAddFromApi(model: any) {
  model.forEach((element: any) => {
    element.isSelected = true
  })
  userXml.value = model
  data.isShowDialogImportXml = true
}

// watch
watch(() => route.path, value => {
  // console.log(value)
}, { immediate: true })

// created
fectchListUsers()
window.hideAllPageLoading()
</script>

<template>
  <div>
    <CpActionHeaderPage
      :title-custom="t('browse-user')"
      :title="t('user-list')"
      is-update-btn
      is-export-btn
      is-custom-btn
      is-custom-group-btn
      :action-add="actionAdd"
      :action-update="actionUpdate"
      @exportExcel="exportExcel"
      @click="handlerActionHeader"
    />
  </div>
  <CmCollapse :is-show="isShowFilter">
    <CpUserFilter @update="handleFilterCombobox" />
  </CmCollapse>
  <div>
    <CpHeaderAction
      is-delete
      :disabled-delete="disabledDelete"
      is-fillter
      @click="handleClickBtn"
      @update:keyword="handleSearch"
    />
  </div>
  <div id="cap-report-overview">
    <CmTable
      ref="refTableUserList"
      :headers="headers"
      :items="items"
      is-expand
      :total-record="totalRecord"
      @handlePageClick="handlePageClick"
      @update:selected="selectedRows"
    >
      <template #rowItem="{ col, context }">
        <div v-if="col === 'fullName'">
          <CpCustomInfo
            :context="context"
          />
        </div>
        <div v-if="col === 'organization'">
          <CmAccodion
            v-if="context.orgModels?.content?.length"
            :data="[context.orgModels]"
            custom-key="name"
            is-open
          />
          <CmAccodion
            v-if="context.groupModels?.content?.length"
            :data="[context.groupModels]"
            custom-key="name"
            is-open
          />

          <CmAccodion
            v-if="context.titleModels?.content?.length"
            :data="[context.titleModels]"
            custom-key="titleName"
            is-open
          />
        </div>
        <div v-if="col === 'registeredDate'">
          <span>{{ DateUtil.formatDateToDDMM(context.registeredDate) }}</span>
        </div>
        <div v-if="col === 'statusName'">
          <CmChip
            class="ma-2"
            :class="MethodsUtil.checkStatusTypeUser(context.statusName)?.color"
          >
            <VIcon
              start
              icon="carbon:dot-mark"
              size="12"
            />
            <span>{{ t(MethodsUtil.checkStatusTypeUser(context.statusName)?.name) }}</span>
          </CmChip>
        </div>
      </template>
      <template #tableSub>
        <VRow>
          <VCol
            col="12"
            sm="12"
            md="6"
          >
            <CpTableSub />
          </VCol>
          <VCol
            col="12"
            sm="6"
            md="3"
          >
            <CpTableSubIconList />
          </VCol>
          <VCol
            col="12"
            sm="6"
            md="3"
          >
            <CpTableSubIconList />
          </VCol>
        </VRow>
      </template>
    </CmTable>
  </div>
  <CpConfirmDialog
    :type="2"
    variant="outlined"
    :max-width="400"
    :confirmation-msg-sub-title="t('delete')"
    :confirmation-msg="t('deleteUser')"
    :is-dialog-visible="isShowDialogNoti"
    @update:isDialogVisible="updateDialogVisible"
    @confirm="confirmDialog"
  />
  <CpConfirmDialog
    :is-dialog-visible="data.isShowDialogPasword"
    :type="data.typeDialogRessetPass"
    :confirmation-msg="data.showPassword === true ? t('new-passworded') : t('title')"
    :confirmation-msg-sub-title="!data.showPassword === true ? t('waning-password') : ''"
    :is-hide-footer="data.showPassword"
    @confirm="confirmDialogResetPass"
    @update:isDialogVisible="updateDialogVisibleResset"
  >
    <template
      v-if="data.showPassword"
      #sub-title
    >
      <div>{{ t('new-password') }}</div>
      <div class="value-coppy">
        <span class="text-red">{{ data.testingCode }}</span>
        <span
          :title="t('coppy')"
          class="icon-coppy"
          @click.stop.prevent="copyTestingCode"
        >
          <VIcon icon="tabler:copy" />
        </span>
        <input
          id="testing-code"
          type="hidden"
          :value="data.testingCode"
        >
      </div>
    </template>
  </CpConfirmDialog>
  <CpModalUpdateStatus
    v-if="data.isShowDialogStatus"
    :is-dialog-visible="data.isShowDialogStatus"
    @confirm="confirmDialogStatus"
    @update:is-dialog-visible="updateDialogVisibleStatus"
  />
  <CpModalAddUserApi
    v-model:is-dialog-visible="data.isShowDialogAddUserApi"
    @confirm="handleAddFromApi"
  />
  <CpImportXml
    v-model:is-dialog-visible="data.isShowDialogImportXml"
    :users="userXml"
    @confirm="handleAddFromApi"
  />
</template>

<style lang="scss">
.value-coppy {
  margin: 15px;
  text-align: center;

  .text-red {
    padding: 10px;
    border: 1px solid #d6d8de;
    border-radius: 6px;
  }

  .icon-coppy {
    cursor: pointer;
    margin-inline-start: 15px;
  }
}
</style>

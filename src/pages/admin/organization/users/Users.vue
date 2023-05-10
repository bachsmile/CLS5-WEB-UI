<script setup lang="ts">
import ApiUser from '@/api/user/index'
import MethodsUtil from '@/utils/MethodsUtil'
import DateUtil from '@/utils/DateUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import StringUtil from '@/utils/StringUtil'
import toast from '@/plugins/toast'

// mock api

window.showAllPageLoading('COMPONENT')
const CpActionHeaderPage = defineAsyncComponent(() => import('@/components/page/gereral/CpActionHeaderPage.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CpUserFilter = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/CpUserFilter.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CmAccodion = defineAsyncComponent(() => import('@/components/common/CmAccodion.vue'))
const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))
const CpModalUpdateStatus = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/CpModalUpdateStatus.vue'))
const CpCustomInfo = defineAsyncComponent(() => import('@/components/page/gereral/CpCustomInfo.vue'))

/** params */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const refTableUserList = ref()

const isShowFilter = ref(true)
const route = useRoute()
const router = useRouter()

const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('surname-name'), value: 'fullName' },
  { text: t('role'), value: 'userTypeName' },
  { text: t('status-name'), value: 'statusName', type: 'custom' },
  { text: t('join-date'), value: 'registeredDate', type: 'custom' },
  { text: t('organization'), value: 'organization', type: 'menu', width: 300 },
  { text: '', value: 'actions', width: 150 },
])

const orgModels = {
  value: 1,
  label: 'Cơ cấu tổ chức',
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

/** ***************************** Method *****************************/

// Function to handle when click button Delete
const deleteItem = (id: number) => {
  data.deleteIds = [id as never]
  modalContent.value = t('users.user.action-modal.delete')
  isShowDialogNoti.value = true
}

// click  multi delete btn to show modal confirm
const deleteItems = () => {
  data.deleteIds = data.listId
  modalContent.value = t('users.user.action-modal.delete')
  isShowDialogNoti.value = true
}

// delete action
const deleteAction = async () => {
  const params = {
    listId: data.deleteIds,
  }

  await MethodsUtil.requestApiCustom(ApiUser.UsersDelete, TYPE_REQUEST.POST, params)
    .then(async (value: any) => {
      toast('SUCCESS', value?.message)
      await fectchListUsers()
      data.deleteIds = []
      data.listId = []
    })
    .catch(() => {
      toast('ERROR', t('USR_DeleteFail'))
    })
}

// hành động của dialog
const confirmDialog = (event: any) => {
  if (event)
    deleteAction()
}

// cập nhật trạng thái dialog
const updateDialogVisible = (event: any) => {
  isShowDialogNoti.value = event
}

// reset password
const handleRefresh = async () => {
  const params = {
    userId: data.selectedItemId,
  }

  await MethodsUtil.requestApiCustom(ApiUser.ResetPassword, TYPE_REQUEST.POST, params).then((value: any) => {
    data.testingCode = value.data
    data.showPassword = true
    data.typeDialogRessetPass = 0
  })
}

const confirmDialogResetPass = (event: any) => {
  if (event)
    handleRefresh()
}

const updateDialogVisibleResset = (event: any) => {
  if (data.showPassword)
    data.isShowDialogPasword = event
}

// reset status
const handleRefreshStatus = async (status: number) => {
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

const confirmDialogStatus = (status: any) => {
  handleRefreshStatus(status)
}

const updateDialogVisibleStatus = (event: any) => {
  data.isShowDialogStatus = event
}

// coppy code
const copyTestingCode = () => {
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

const selectedRows = (e: any) => {
  console.log(e)

  data.listId = e
}

// click pagination
const handlePageClick = async (page: any) => {
  queryParam.pageNumber = page
  await fectchListUsers()
}

// hàm trả về các loại action khi click
const actionItem = (type: any) => {
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
          item.actions = item.actions.map((el: any) => {
            return MethodsUtil.checkActionType(el, actionItem)
          })
        })
        items.value = value.data.pageLists
        totalRecord.value = value?.data?.totalRecord
      }
    })
    .catch(() => {
      toast('ERROR', t('USR_GetFailed'))
    })
}

// search ở fillter header
const handleSearch = async (value: any) => {
  queryParam.pageNumber = 1
  queryParam.keyword = value.search
  await fectchListUsers()
}

//  fillter header
const handleFilterCombobox = (dataFilter: any) => {
  console.log(dataFilter)

  queryParam = {
    ...queryParam,
    ...dataFilter,
  }
  fectchListUsers()
}

// hàm trả về các loại action từ header filter
const handleClickBtn = (type: string) => {
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
const actionAddFromFile = () => {
  console.log('actionAddFromFile')
}
const actionAddFromApi = () => {
  console.log('actionAddFromApi')
}

const exportExcel = async () => {
  console.log('exportExcel')
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
    action: actionAddFromFile,
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
      :title-aprove="t('browse-user')"
      :title="t('user-list')"
      is-update-btn
      is-export-btn
      is-approve-btn
      :action-add="actionAdd"
      :action-update="actionUpdate"
      @exportExcel="exportExcel"
      @click="router.push({ name: 'admin-organization-users-profile-add', params: { tab: 'infor' } })"
    />
  </div>
  <div
    v-if="isShowFilter"
    class="filter-action"
  >
    <CpUserFilter @update="handleFilterCombobox" />
  </div>
  <div>
    <CpHeaderAction
      is-delete
      :disabled-delete="disabledDelete"
      is-fillter
      @click="handleClickBtn"
      @search="handleSearch"
    />
  </div>
  <div>
    <CmTable
      ref="refTableUserList"
      :headers="headers"
      :items="items"
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
          <VChip
            class="ma-2"
            :class="MethodsUtil.checkStatusTypeUser(context.statusName)?.color"
          >
            <VIcon
              start
              icon="carbon:dot-mark"
              size="12"
            />
            <span>{{ t(MethodsUtil.checkStatusTypeUser(context.statusName)?.name) }}</span>
          </VChip>
        </div>
      </template>
    </CmTable>
  </div>
  <CpConfirmDialog
    :type="2"
    variant="outlined"
    :confirmation-msg-sub-title="t('users.user.action-modal.delete')"
    :confirmation-msg="t('users.branch.deleteUser')"
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

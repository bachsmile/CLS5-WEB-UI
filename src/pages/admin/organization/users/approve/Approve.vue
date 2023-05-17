<script setup lang="ts">
import ApiUser from '@/api/user/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import toast from '@/plugins/toast'
import { ApproveType } from '@/constant/data/actionType.json'

window.showAllPageLoading('COMPONENT')

const CpApproveFilter = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/approve/CpApproveFilter.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))
const CpModalApprove = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/approve/modal/CpModalApprove.vue'))

/**
 * lib
 */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/**
 * data
 */

const data = reactive({
  customerIds: [] as Array<any>,
  listId: [],
})

let queryParam = reactive({
  keyword: '',
  pageNumber: 1,
  pageSize: 10,
  startDate: null,
  endDate: null,
})
const isShowFilter = ref(true)
const disabledDelete = computed(() => !data.listId.length)
const disabledApprove = computed(() => !data.listId.length)
const disabledBack = computed(() => !data.listId.length)
const modalContent = reactive({
  content: '',
  subContent: '',
})
const isShowDialogNoti = ref(false)
const isShowDialogApprove = ref(false)
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('full-name'), value: 'fullName', width: 250 },
  { text: t('email'), value: 'email', width: 250 },
  { text: t('userName'), value: 'userName', width: 150 },
  { text: t('phone-number'), value: 'phoneNumber', width: 100 },
  { text: t('status-name'), value: 'statusId', type: 'custom', width: 150 },
  { text: '', value: 'actions', width: 150 },
])
const items = ref ([])
const totalRecord = ref(0)
const configRegister = ref()
const keyModal = ref('')

/**
 * method
 */
// filter
const handleFilter = async (dataFilter: any) => {
  queryParam = {
    ...queryParam,
    ...dataFilter,
  }
  await fectchListUsers()
}

// cập nhật trạng thái dialog
const updateDialogVisible = (event: any) => {
  isShowDialogNoti.value = event
}

// Function to handle when click button Delete
const deleteItem = (id: number) => {
  data.customerIds = [id as never]
  modalContent.content = t('deleteUser')
  modalContent.subContent = t('delete')
  keyModal.value = 'delete'
  isShowDialogNoti.value = true
}

// click  multi delete btn to show modal confirm
const deleteItems = () => {
  data.customerIds = data.listId
  modalContent.content = t('deleteUser')
  modalContent.subContent = t('delete')
  keyModal.value = 'delete'
  isShowDialogNoti.value = true
}

// delete action
const deleteAction = async () => {
  const params = {
    ids: data.customerIds,
  }

  await MethodsUtil.requestApiCustom(ApiUser.deleteCustomer, TYPE_REQUEST.DELETE, params)
    .then(async (value: any) => {
      toast('SUCCESS', value?.message)
      queryParam.pageNumber = 1
      await fectchListUsers()
      data.customerIds = []
      data.listId = []
      keyModal.value = ''
    })
    .catch(() => {
      toast('ERROR', t('USR_DeleteFail'))
    })
}
const approveItems = async (id?: any) => {
  console.log('approve')
  if (id)
    data.customerIds = [id]

  else
    data.customerIds = data.listId
  await MethodsUtil.requestApiCustom(ApiUser.GetRegisterConfig, TYPE_REQUEST.GET).then((value: any) => {
    configRegister.value = value.data
    isShowDialogApprove.value = true
    console.log(value)
  })
}
const rebackItems = async (id?: any) => {
  console.log('approve')
  if (id)
    data.customerIds = [id]

  else
    data.customerIds = data.listId
  modalContent.content = t('confirm')
  modalContent.subContent = t('confirm-return-user')
  keyModal.value = 'back'
  isShowDialogNoti.value = true
}
const handleReturnCustomer = async () => {
  const params = {
    ids: [...data.customerIds],
  }
  await MethodsUtil.requestApiCustom(ApiUser.PutReturnCustomer, TYPE_REQUEST.PUT, params)
    .then((value: any) => {
      toast('SUCCESS', t(value.message))
      fectchListUsers()
    })
    .catch((error: any) => {
      toast('ERROR', t(error.message))
    })
}

// hành động của dialog
const confirmDialog = (event: any, key: string) => {
  if (event) {
    switch (key) {
      case 'delete':
        deleteAction()
        break
      case 'back':
        handleReturnCustomer()
        break

      default:
        break
    }
  }
}

// hàm trả về các loại action từ header filter
const handleClickBtn = (type: string) => {
  switch (type) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
      break
    case 'approve':
      approveItems()
      break
    case 'delete':
      deleteItems()
      break
    case 'back':
      rebackItems()
      break

    default:
      break
  }
}

// search ở fillter header
const handleSearch = async (value: any) => {
  queryParam.pageNumber = 1
  queryParam.keyword = value
  await fectchListUsers()
}
const selectedRows = (e: any) => {
  data.listId = e
}

// click pagination
const handlePageClick = async (page: any) => {
  queryParam.pageNumber = page
  await fectchListUsers()
}

// hàm trả về các loại action khi click
const actionItem = (type: any) => {
  console.log(type)

  switch (type[0]?.name) {
    case 'ActionDelete':
      deleteItem(type[1].id)
      break
    case 'ActionAgree':
      approveItems(type[1].id)
      break
    case 'ActionDeclined':
      rebackItems(type[1].id)
      break

    default:
      break
  }
}
const handleModalApproveAccept = async (infor: any) => {
  const params = {
    userTypeId: infor.userTypeId,
    orgId: infor.organizationalStructureId,
    groupId: infor.groupId,
    titleId: infor.titleId,
    customerIds: [...data.customerIds],
  }
  await MethodsUtil.requestApiCustom(ApiUser.PostApproveCustomer, TYPE_REQUEST.POST, params)
    .then((value: any) => {
      toast('SUCCESS', t(value.message))
      fectchListUsers()
    })
    .catch((error: any) => {
      toast('ERROR', t(error.message))
    })
}
const confirmDialogApprove = (infor: any) => {
  console.log(infor)
  handleModalApproveAccept(infor)
}

// Get list Users
async function fectchListUsers() {
  // await fetchData(ApiUser.UsersList, TYPE_REQUEST.POST, queryParam)
  await MethodsUtil.requestApiCustom(ApiUser.GetListCustomerRequest, TYPE_REQUEST.GET, queryParam)
    .then((value: any) => {
      if (value.data)
        totalRecord.value = value.data?.totalRecord
      items.value = value.data?.pageLists
      value.data.pageLists.forEach((item: any) => {
        item.actions = [
          {
            id: 2,
            name: 'ActionDelete',
          },
          {
            id: 9,
            name: 'ActionAgree',
          },
          {
            id: 17,
            name: 'ActionDeclined',
          },
        ]
        item.actions = item.actions.map((el: any) => {
          return MethodsUtil.checkActionType(el, actionItem)
        })
      })
    })
    .catch(() => {
      toast('ERROR', t('USR_GetFailed'))
    })
}

// created
fectchListUsers()
window.hideAllPageLoading()
</script>

<template>
  <div class="text-medium-lg mb-6">
    {{ t('user-list') }}
  </div>
  <div
    v-if="isShowFilter"
    class="filter-action"
  >
    <CpApproveFilter @update="handleFilter" />
  </div>
  <div>
    <CpHeaderAction
      is-delete
      is-fillter
      is-approve
      is-back
      :disabled-delete="disabledDelete"
      :disabled-approve="disabledApprove"
      :disabled-back="disabledBack"
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
        <div v-if="col === 'statusId'">
          <VChip
            class="ma-2"
            :class="MethodsUtil.checkStatus(context.statusId, ApproveType)?.color"
          >
            <VIcon
              start
              icon="carbon:dot-mark"
              size="12"
            />
            <span>{{ t(MethodsUtil.checkStatus(context.statusId, ApproveType)?.name) }}</span>
          </VChip>
        </div>
      </template>
    </CmTable>
  </div>
  <CpConfirmDialog
    :type="2"
    variant="outlined"
    :max-width="400"
    :key-modal="keyModal"
    :confirmation-msg-sub-title="modalContent.subContent"
    :confirmation-msg="modalContent.content"
    :is-dialog-visible="isShowDialogNoti"
    @update:isDialogVisible="updateDialogVisible"
    @confirm="confirmDialog"
  />
  <CpModalApprove
    v-if="isShowDialogApprove"
    v-model:is-dialog-visible="isShowDialogApprove"
    :config-register="configRegister"
    @confirm="confirmDialogApprove"
  />
</template>


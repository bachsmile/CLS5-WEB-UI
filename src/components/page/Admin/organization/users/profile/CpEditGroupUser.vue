<script setup lang="ts">
import ApiUser from '@/api/user/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import DateUtil from '@/utils/DateUtil'
import { ActionType } from '@/constant/data/actionType.json'
import toast from '@/plugins/toast'

const props = withDefaults(defineProps<Props>(), ({
  idUser: null,
}))

/**
 * component
 */
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))
const CpModalAddUserGroup = defineAsyncComponent(() => import('@/components/page/gereral/modal/CpModalAddUserGroup.vue'))
interface Props {
  idUser?: any
  emit: any
}

/**
 * data main
 */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const { emitEvent } = props.emit()

/**
 * data variable
 */
const headers = reactive([
  { text: '', value: 'checkbox' },
  { text: t('user-group-name'), value: 'nameGroup' },
  { text: t('date-register'), value: 'dateRegister' },

  // { text: t('description'), value: 'description' },
  { text: '', value: 'actions', width: 150 },
])
const dataTableGroup = ref ([])
const queryParams = reactive({
  id: props.idUser !== null ? props.idUser : Number(route.params.id),
  pageSize: 10,
  pageNumber: 1,
  searchData: '',
})
const dataComponent = reactive({
  totalRecord: 0,
  deleteIds: [] as any, // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
  listId: [],
})
const isShowDialogNotiDelete = ref(false)
const isShowDialogAddGroup = ref(false)
const queryBodyAdd = reactive({
  id: props.idUser !== null ? props.idUser : Number(route.params.id),
  listId: [],
})
const disabledDelete = computed(() => !dataComponent.selectedRowsIds.length)

/**
 * method
 */
// danh sách nhóm người dùng
async function getPagingByUser(queryParam: any) {
  if (props.idUser != null || Number(route.params.id) != null) {
    await MethodsUtil.requestApiCustom(ApiUser.GetPagingByUser, TYPE_REQUEST.GET, queryParam).then((value: any) => {
      dataTableGroup.value = value?.data?.pageLists
      dataComponent.totalRecord = value?.data?.totalRecord
    })
  }
}

// lấy danh sách id
async function getListIdStructureUser() {
  dataComponent.listId = []
  const params = {
    id: queryParams.id,
    typeId: 1,
  }
  await MethodsUtil.requestApiCustom(ApiUser.GetListIdStructureUser, TYPE_REQUEST.GET, params).then((value: any) => {
    dataComponent.listId = value.data
  })
}

// search ở fillter header
async function handleSearch(value: any) {
  queryParams.pageNumber = 1
  queryParams.searchData = value
  await getPagingByUser(queryParams)
}
async function handleAddGroup(value: any) {
  await getListIdStructureUser()
  isShowDialogAddGroup.value = true
}
async function handleDeleteMultiple(value: any) {
  dataComponent.deleteIds = dataComponent.selectedRowsIds
  isShowDialogNotiDelete.value = true
}
async function handlePageClick(value: any) {
  queryParams.pageNumber = value
  await getPagingByUser(queryParams)
}
function selectedRows(e: any) {
  dataComponent.selectedRowsIds = e
}

// Function to handle when click button Delete
function handleDeleteItem(context: any) {
  dataComponent.deleteIds = []
  dataComponent.deleteIds.push(context.id)
  isShowDialogNotiDelete.value = true

  // this.modalContent = this.$t('delete')
  // this.$bvModal.show(this.confirmModalId)
}

// delete action
async function deleteAction() {
  const params = {
    id: queryParams.id,
    listId: dataComponent.deleteIds,
  }

  await MethodsUtil.requestApiCustom(ApiUser.DeleteGroupWithUser, TYPE_REQUEST.POST, params)
    .then(async (value: any) => {
      toast('SUCCESS', t(value?.message))
      await getPagingByUser(queryParams)
      dataComponent.selectedRowsIds = []
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

async function confirmDialogAddGroup(listGroup: any) {
  if (listGroup.length > 0) {
    queryBodyAdd.listId = listGroup
    await MethodsUtil.requestApiCustom(ApiUser.PostAddGroupUser, TYPE_REQUEST.POST, queryBodyAdd)
      .then((value: any) => {
        toast('SUCCESS', t(value?.message))
        getPagingByUser(queryParams)
      })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))
      })
  }
}

// cập nhật trạng thái dialog
function updateDialogVisible(event: any) {
  isShowDialogNotiDelete.value = event
}
function updateDialogVisibleAddStatus(event: any) {
  isShowDialogAddGroup.value = event
}

getPagingByUser(queryParams)
</script>

<template>
  <div>
    <div class="my-6">
      <CpHeaderAction
        :is-fillter="false"
        is-delete
        is-add
        :disabled-delete="disabledDelete"
        :add-button-name="t('add-group')"
        @search="handleSearch"
        @add-handler="handleAddGroup"
        @deleteMultiple="handleDeleteMultiple"
      />
    </div>
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
          <div v-if="col === 'dateRegister'">
            {{ DateUtil.formatDateToDDMM(context.registeredDate) }}
          </div>
          <div v-if="col === 'actions'">
            <VIcon
              :icon="ActionType[1].icon"
              :size="18"
              class="align-middle"
              :color="ActionType[1].color"
              @click="handleDeleteItem(context)"
            />
            <VTooltip
              activator="parent"
              location="start"
            >
              {{ t(ActionType[1].name) }}
            </VTooltip>
          </div>
        </template>
      </CmTable>
    </div>
    <CpConfirmDialog
      :type="2"
      variant="outlined"
      :confirmation-msg="t('delete')"
      :is-dialog-visible="isShowDialogNotiDelete"
      @update:isDialogVisible="updateDialogVisible"
      @confirm="confirmDialog"
    />
    <CpModalAddUserGroup
      :is-dialog-visible="isShowDialogAddGroup"
      :list-id="dataComponent.listId"
      @confirm="confirmDialogAddGroup"
      @update:is-dialog-visible="updateDialogVisibleAddStatus"
    />
  </div>
</template>

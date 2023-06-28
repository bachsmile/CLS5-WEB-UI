<script lang="ts" setup>
import CpHeaderAction from './CpHeaderAction.vue'
import CpMdAddUser from './Modal/CpMdAddUser.vue'
import CpMdMoveGroup from './Modal/CpMdMoveGroup.vue'
import DateUtil from '@/utils/DateUtil'
import CpCustomInfo from '@/components/page/gereral/CpCustomInfo.vue'
import { useUserGroupStore } from '@/stores/admin/group-user/cpUser'

const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const { t } = window.i18n()

const TITLE = Object.freeze({
  BUTTON_EXCEL: t('export-excel'),
  TITLE_PAGE: t('user-list'),
  BUTTON_ADD: t('Add-new'),
  BUTTON_MOVE: t('Chuyển nhóm'),
  BUTTON_DELETE: t('Xóa người dùng'),
})

// Danh sách người dùng
const headers = [
  { text: '', value: 'checkbox' },
  { text: t('user-name'), value: 'name', type: 'custom' },
  { text: t('org-struct'), value: 'orgName' },
  { text: t('title'), value: 'titleName' },
  { text: t('register-date'), value: 'registerDate', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
]

const store = useUserGroupStore()
const route = useRoute()
const { listUserInGroup, totalRecord, queryParams } = storeToRefs(store)
const { moveUser, deleteItem, getListUser } = store

// Tìm kiếm người dùng
function handleSearch(val: string) {
  store.queryParams.search = val
  store.queryParams.pageNumber = 1
}
watch(queryParams.value, val => {
  getListUser()
})

const isShowAddUser = ref(false)
function showModalAdd() {
  isShowAddUser.value = true
}

onBeforeUnmount(() => {
  store.$reset()
  store.$dispose()
})

onDeactivated(() => {
  store.$dispose()
})

// Chuyển nhóm người dùng
interface DataMove {
  currentGroup: number | null
  isTotal: boolean | null
  newGroup: number | null
  userIds: any[]
}
const isShowModalMove = ref<boolean>(false)
const listSelected = ref<any[]>([])
const dataMove = reactive<DataMove>({
  currentGroup: Number(route.params.id),
  isTotal: false,
  newGroup: null,
  userIds: [],
})
function showModalShowMove(data: any) {
  dataMove.userIds = [data.userId]
  isShowModalMove.value = true
}
async function handleSubmit(val: any | null) {
  dataMove.isTotal = !dataMove.userIds.length
  dataMove.newGroup = val
  const isHidden = await moveUser(dataMove)
  isShowModalMove.value = isHidden
}
function moveMultipleUser() {
  dataMove.userIds = listSelected.value
  isShowModalMove.value = true
}

// Xóa người dùng khỏi nhóm
const isShowModalConfirmDelete = ref<boolean>(false)
function showModalDeleteUser(val: any | null) {
  if (val)
    listSelected.value = [val.userId]
  isShowModalConfirmDelete.value = true
}
function handleDeleteMultiple() {
  deleteItem(listSelected.value)
}
</script>

<template>
  <CpHeaderAction
    :button-prepend="TITLE.BUTTON_EXCEL"
    :title-page="TITLE.TITLE_PAGE"
    :button-add="TITLE.BUTTON_ADD"
    :is-show-add-group="false"
    :is-show-move="true"
    :is-disabled-move="!listSelected.length"
    :is-disabled-delete="!listSelected.length"
    @update:key-search="handleSearch"
    @click-add="showModalAdd"
    @click-move-multiple="moveMultipleUser"
    @click-delete="showModalDeleteUser"
  />
  <CmTable
    v-model:page-number="store.queryParams.pageNumber"
    v-model:selected="listSelected"
    :headers="headers"
    :items="listUserInGroup"
    :total-record="totalRecord"
    custom-id="userId"
  >
    <template #rowItem="{ col, context }">
      <div v-if="col === 'name'">
        <CpCustomInfo :context="context" />
      </div>
      <span v-if="col === 'registerDate'">
        <span>{{ DateUtil.formatDateToDDMM(context.registerDate) }}</span>
      </span>
    </template>
    <template #actions="{ data }">
      <div>
        <VIcon
          icon="simple-line-icons:cursor-move"
          :size="18"
          class="align-middle color-success"
          @click="showModalShowMove(data)"
        />
        <VTooltip
          activator="parent"
          location="top"
        >
          {{ TITLE.BUTTON_MOVE }}
        </VTooltip>
      </div>
      <div>
        <VIcon
          icon="fe:trash"
          :size="18"
          class="align-middle color-error ml-2"
          @click="showModalDeleteUser(data)"
        />
        <VTooltip
          activator="parent"
          location="top"
        >
          {{ TITLE.BUTTON_DELETE }}
        </VTooltip>
      </div>
    </template>
  </CmTable>

  <CpMdAddUser
    v-model:is-show="isShowAddUser"
    title="Thêm mới nhóm người dùng"
  />
  <CpMdMoveGroup
    v-model:is-show="isShowModalMove"
    title="Chuyển nhóm người dùng"
    @ok="handleSubmit"
  />
  <CpConfirmDialog
    v-model:is-dialog-visible="isShowModalConfirmDelete"
    :type="2"
    :confirmation-msg="t('Are-you-sure-you-want-to-delete-the-ability-group?')"
    @confirm="handleDeleteMultiple"
  />
</template>

<script setup lang="ts">
import ApiUser from '@/api/user/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { ActionType } from '@/constant/data/actionType.json'
import toast from '@/plugins/toast'
import { orgStructManagerStore } from '@/stores/admin/org-struct/orgStruct'

const props = withDefaults(defineProps<Props>(), ({
  idUser: null,
}))

/**
 * component
 */
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpActionHeaderPage = defineAsyncComponent(() => import('@/components/page/gereral/CpActionHeaderPage.vue'))
const CpAddTitleOrfStructTab = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/edit/title/CpAddTitleOrgStructTab.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))
const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))

interface Props {
  idUser?: any
  emit: any
}

/**
 * store
 */
const storeOrgStruct = orgStructManagerStore()
const { organization, title, viewModeAddTitle, isView } = storeToRefs(storeOrgStruct)
const { fetchDataUserOrg, getInforTitleById, backOrg, handleSaveOrg, handleSaveUpdateOrg } = storeOrgStruct

/**
 * data main
 */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const router = useRouter()
const { emitEvent } = props.emit()

/**
 * data variable
 */
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('title-name'), value: 'name' },
  { text: t('level'), value: 'level', width: 150 },
  { text: '', value: 'actions', width: 150 },
])
const dataTableTitles = ref ([])
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
const isShowDialogNotiDelete = ref(false)
const isShowDialogAddGroup = ref(false)

/**
 * method
 */
// danh sách chức danh
async function getPagingByTitles() {
  await MethodsUtil.requestApiCustom(ApiUser.GetListTitle, TYPE_REQUEST.POST, queryParams).then((value: any) => {
    dataTableTitles.value = value?.data?.pageLists
    dataComponent.totalRecord = value?.data?.totalRecord
  })
}

function handlerActionHeader(type: any) {
  switch (type) {
    case 'handlerCustomButton':
      title.value.id = null
      viewModeAddTitle.value = true
      break

    default:
      break
  }
}

function selectedRows(e: any) {
  dataComponent.selectedRowsIds = e
}

// search ở fillter header
async function handleSearch(value: any) {
  queryParams.pageNumber = 1
  queryParams.search = value
  await getPagingByTitles()
}
async function handlePageClick(value: any) {
  queryParams.pageNumber = value
  await getPagingByTitles()
}

async function handleDeleteMultiple(value: any) {
  dataComponent.deleteIds = dataComponent.selectedRowsIds
  isShowDialogNotiDelete.value = true
}

// Function to handle when click button Delete
function handleDeleteItem(context: any) {
  dataComponent.deleteIds = []
  dataComponent.deleteIds.push(context.id)
  isShowDialogNotiDelete.value = true
}

function reset() {
  dataComponent.deleteIds = []
  dataComponent.selectedRowsIds = []
}

// delete action
async function deleteAction() {
  const params = {
    listId: dataComponent.deleteIds,
  }

  await MethodsUtil.requestApiCustom(ApiUser.DeleteTitleOrgStruct, TYPE_REQUEST.DELETE, params)
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

// thêm chức danh thành công
async function addTitleSuccess() {
  viewModeAddTitle.value = false
  await getPagingByTitles()
  await fetchDataUserOrg()
}

// Chỉnh sửa chức danh trong cctc
async function handleEditTitle(content: any) {
  await getInforTitleById(content?.id)
}
onUnmounted(() => {
  viewModeAddTitle.value = false
})
watch(() => organization.value.id, val => {
  if (organization.value.id && organization.value.id !== null) {
    queryParams.orStructureId = organization.value.id
    getPagingByTitles()
  }
}, { deep: true, immediate: true })

/** ***************************************************************************** */
</script>

<template>
  <div>
    <div v-if="viewModeAddTitle">
      <CpAddTitleOrfStructTab @addTitleSuccess="addTitleSuccess" />
    </div>
    <div v-else>
      <div>
        <CpActionHeaderPage
          :title="t('position-list')"
          bg-custom="bg-primary"
          :title-custom="t('add-titles')"
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
          :items="dataTableTitles"
          :total-record="dataComponent.totalRecord"
          :page-number="queryParams.pageNumber"
          @handlePageClick="handlePageClick"
          @update:selected="selectedRows"
        >
          <template #rowItem="{ col, context }">
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
      </div>
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
    <CpConfirmDialog
      v-model:is-dialog-visible="isShowDialogNotiDelete"
      :type="2"
      variant="outlined"
      :confirmation-msg="t('delete')"
      @confirm="confirmDialog"
    />
  </div>
</template>

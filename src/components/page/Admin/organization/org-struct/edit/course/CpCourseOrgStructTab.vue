<script setup lang="ts">
import CourseService from '@/api/course/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { orgStructManagerStore } from '@/stores/admin/org-struct/orgStruct'
import { comboboxStore } from '@/stores/combobox'
import { ActionType } from '@/constant/data/actionType.json'
import toast from '@/plugins/toast'

const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpActionHeaderPage = defineAsyncComponent(() => import('@/components/page/gereral/CpActionHeaderPage.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))
const CpMdEditCourseOrg = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/modal/CpMdEditCourseOrg.vue'))
const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/**
 * store
 */

const storeOrgStruct = orgStructManagerStore()
const { isView, organization } = storeToRefs(storeOrgStruct)
const { backOrg, handleSaveOrg, handleSaveUpdateOrg } = storeOrgStruct

// Combobox chủ đề
const combobox = comboboxStore()
const { listTopicCourseCombobox } = storeToRefs(combobox)
const { getlistTopicCourseCombobox } = combobox

/** data */
const queryParams = reactive({
  id: null,
  pageNumber: 1,
  pageSize: 10,
  search: '',
})
const dataComponent = reactive({
  totalRecord: 0,
  deleteIds: [] as any, // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
  excludeListId: [],
})
const disabledDelete = computed(() => !dataComponent.selectedRowsIds.length)
const isShowDialogNotiDelete = ref(false)
const isShowDialogAddCourse = ref(false)
const disabledOk = ref(false)
const items = ref ([])

/**
 * data table
 */
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-course'), value: 'name' },
  { text: t('topic'), value: 'topicName' },
  { text: '', value: 'actions', width: 150 },
])

/** method */
function reset() {
  dataComponent.deleteIds = []
  dataComponent.selectedRowsIds = []
}

// danh sách id khóa học
async function fetchAllCourseId() {
  const params = { id: organization.value.id, typeId: 3 }
  await MethodsUtil.requestApiCustom(CourseService.GetCourseExclude, TYPE_REQUEST.GET, params).then((value: any) => {
    dataComponent.excludeListId = value?.data
  })
}

// search ở fillter header
async function handleSearch(value: any) {
  queryParams.pageNumber = 1
  queryParams.search = value
  getPagingByCourse()
}

function handlerActionHeader(type: any) {
  switch (type) {
    case 'handlerCustomButton':

      isShowDialogAddCourse.value = true
      break

    default:
      break
  }
}

// xóa một
function handleDeleteItem(context: any) {
  dataComponent.deleteIds = []
  dataComponent.deleteIds.push(context.id)
  isShowDialogNotiDelete.value = true
}

// xóa nhiều
async function handleDeleteMultiple(value: any) {
  dataComponent.deleteIds = dataComponent.selectedRowsIds
  isShowDialogNotiDelete.value = true
}

// delete action
async function deleteAction() {
  const params = {
    orStructureId: organization.value.id,
    courseModel: dataComponent.deleteIds,
  }

  await MethodsUtil.requestApiCustom(CourseService.PostDeleteCourseOrg, TYPE_REQUEST.POST, params)
    .then(async (value: any) => {
      toast('SUCCESS', t(value?.message))
      reset()
      queryParams.pageNumber = 1
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

// thêm khóa học
async function saveAddCourseOrg(listCourse: any) {
  const listIds = listCourse.map(({ id }: any) => id)
  const params = {
    orStructureId: organization.value.id,
    courseModel: listIds,
  }
  if (listIds.length) {
    disabledOk.value = true
    await MethodsUtil.requestApiCustom(CourseService.PostAddCourseOrg, TYPE_REQUEST.POST, params).then((value: any) => {
      toast('SUCCESS', t(value.message))
      queryParams.pageNumber = 1
      getPagingByCourse()
      fetchAllCourseId()
      isShowDialogAddCourse.value = false
    })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))
      })
  }

  setTimeout(() => {
    disabledOk.value = false
  }, 500)
}

async function getPagingByCourse() {
  await MethodsUtil.requestApiCustom(CourseService.GetCourseOrgStruct, TYPE_REQUEST.GET, queryParams).then((value: any) => {
    value?.data.pageLists.forEach((element: any) => {
      const topic: any = listTopicCourseCombobox.value.find((topicItem: any) => topicItem.key === element.topicId)
      if (topic)
        element.topicName = topic.value
    })
    items.value = value.data.pageLists
    dataComponent.totalRecord = value.data.totalRecord
  })
}
watch(() => organization.value.id, (val: any) => {
  if (!listTopicCourseCombobox.value?.length)
    getlistTopicCourseCombobox()
  if (organization.value.id && organization.value.id !== null) {
    queryParams.id = organization.value.id
    getPagingByCourse()
    fetchAllCourseId()
  }
}, { deep: true, immediate: true })
watch(queryParams, val => {
  getPagingByCourse()
  fetchAllCourseId()
})
</script>

<template>
  <div>
    <div>
      <CpActionHeaderPage
        :title="t('list-course')"
        bg-custom="bg-primary"
        :title-custom="t('add-course')"
        is-custom-btn
        @click="handlerActionHeader"
      />
    </div>
    <div class="my-6">
      <CpHeaderAction
        :is-fillter="false"
        is-delete
        :disabled-delete="disabledDelete"
        @search="handleSearch"
        @deleteMultiple="handleDeleteMultiple"
      />
    </div>
    <div>
      <CmTable
        v-model:pageNumber="queryParams.pageNumber"
        v-model:pageSize="queryParams.pageSize"
        v-model:selected="dataComponent.selectedRowsIds"
        :headers="headers"
        :items="items"
        :total-record="dataComponent.totalRecord"
        custom-id="id"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'actions'">
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
    <CpMdEditCourseOrg
      v-model:is-dialog-visible="isShowDialogAddCourse"
      v-model:disabledOk="disabledOk"
      :exclude-list-id="dataComponent.excludeListId"
      @confirm="saveAddCourseOrg"
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

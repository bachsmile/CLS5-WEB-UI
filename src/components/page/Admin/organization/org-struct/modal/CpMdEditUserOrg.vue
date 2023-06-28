<!-- eslint-disable @typescript-eslint/indent -->
<script setup lang="ts">
import ApiUser from '@/api/user/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { orgStructManagerStore } from '@/stores/admin/org-struct/orgStruct'
import { configStore } from '@/stores/index'

const props = withDefaults(defineProps<Props>(), ({
  isEditUser: false,
  disabledOk: false,
}))
const emit = defineEmits<Emit>()
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpCustomInfo = defineAsyncComponent(() => import('@/components/page/gereral/CpCustomInfo.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CpFilterUserOrgStructTab = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/edit/user/CpFilterUserOrgStructTab.vue'))

interface Props {
  isDialogVisible: boolean
  isEditUser: boolean
  disabledOk: boolean
  userEdit?: any
}
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'update:disabledOk', value: boolean): void
  (e: 'confirm', data: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/**
 * store
 */
const storeOrgStruct = orgStructManagerStore()
const { userIds, listTitles, organization } = storeToRefs(storeOrgStruct)
const { getPagingByTitles } = storeOrgStruct

const configControl = configStore()
const { settingDefaults } = storeToRefs(configControl)

const LABEL = Object.freeze({
  TITLE: t('add-user'),
  TITLE1: t('choose-titles'),
})

const dataComponent = reactive({
  titleId: null,
  totalRecord: 0,
})
const headers = computed(() => {
  if (props.isEditUser) {
    return [
      { text: t('user-name'), value: 'fullName' },
      { text: t('career-titles'), value: 'title' },
    ]
  }
  return [{ text: '', value: 'checkbox', width: 50 },
    { text: t('user-name'), value: 'fullName' },
    { text: t('career-titles'), value: 'title' }]
})

const items = ref<Array<any>>([])
const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  orStructureId: 0,
  groupUserId: 0,
  searchData: null,
  sort: '',
  roleValue: 0,
  listModel: [] as Array<any>,
})

const isShowFilter = ref(true)
const tableAsignUser = ref()
const autoAssignConfig = reactive({
  isCourse: false,
  isTraining: false,
  orStructureId: organization.value.id,
  listUser: [] as any,
  isExam: false,
})

/** method */
// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  switch (type) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
      break
    default:
      break
  }
}

// search ở fillter header
async function handleSearch(value: any) {
  queryParams.pageNumber = 1
  queryParams.searchData = value
  getUserAsignOrg()
}

async function onCancel() {
  emit('update:isDialogVisible', false)
}
async function onConfirm() {
  dataComponent.titleId = null
  if (props.disabledOk)
    return
  emit('update:disabledOk', true)
  emit('confirm', autoAssignConfig)
  emit('update:isDialogVisible', false)
}
async function handlePageClick(value: any) {
  queryParams.pageNumber = value
  getUserAsignOrg()
}
function changeTitleAll(idTitle: any) {
  items.value.forEach((item: any) => { item.titleId = idTitle })
  tableAsignUser.value.checkedAll()
}
function changeCellvalue(id: any, content: any) {
  items.value[content.originIndex] = content
}
function changeDataFilter(content: any) {
  autoAssignConfig.isCourse = content?.isCourse
  autoAssignConfig.isTraining = content?.isTraining
}
function selectedRows(users: any) {
  autoAssignConfig.listUser = users.map((item: any) => ({ userId: item.userId, titleId: item.titleId }))
}
async function getUserAsignOrg() {
  queryParams.listModel = userIds.value
  await MethodsUtil.requestApiCustom(ApiUser.PostPeopleRolevalue, TYPE_REQUEST.POST, queryParams).then((value: any) => {
    const rows: Array<any> = []
    value?.data.pageLists.forEach((element: any) => {
      rows.push({
        code: element.code,
        userName: `${element.firstName} ${element.lastName}`,
        firstName: element.firstName,
        lastName: element.lastName,
        avatar: element.avatar,
        userId: parseInt(element.id, 10),
        titleId: null,
      })
    })
    items.value = rows
    dataComponent.totalRecord = value?.data.totalRecord
  })
}
watch(() => props.isDialogVisible, isShow => {
  if (isShow) {
    if (autoAssignConfig && Object.keys(autoAssignConfig).length) {
      const autoCheckAssignUser = settingDefaults.value.find(item => item.typeId === 7)
      if (autoCheckAssignUser && autoCheckAssignUser?.value) {
        autoAssignConfig.isCourse = true
        autoAssignConfig.isTraining = true
      }
    }
    dataComponent.titleId = null
    getPagingByTitles()
    if (props.isEditUser !== true) {
      queryParams.pageNumber = 1
      queryParams.pageSize = 10
      queryParams.searchData = null
      getUserAsignOrg()
    }
    else {
      items.value = []
      items.value.push(props.userEdit)
      autoAssignConfig.listUser = [{
        titleId: props.userEdit.titleId,
        userId: props.userEdit.userId,
      }]
    }
  }
  else {
    //
  }

  // getUserAsignOrg()
})
</script>

<template>
  <CmDialogs
    ref="dialog"
    :is-dialog-visible="isDialogVisible"
    :title="LABEL.TITLE"
    persistent
    :disabled-ok="disabledOk"
    :button-ok-name="t('save')"
    @cancel="onCancel"
    @confirm="onConfirm"
  >
    <div class="text-medium-lg mb-4">
      {{ t('user-list') }}
    </div>
    <div v-if="!isEditUser">
      <div
        v-if="isShowFilter"
        class="filter-action"
      >
        <CpFilterUserOrgStructTab
          @changeTitleAll="changeTitleAll"
          @changeDataFilter="changeDataFilter"
        />
      </div>
      <div>
        <CpHeaderAction
          is-fillter
          @click="handleClickBtn"
          @search="handleSearch"
        />
      </div>
    </div>
    <div>
      <CmTable
        ref="tableAsignUser"
        :headers="headers"
        :items="items"
        custom-id="userId"
        :total-record="dataComponent.totalRecord"
        :page-number="queryParams.pageNumber"
        :disiable-pagination="isEditUser"
        :type-pagination="2"
        return-object
        @handlePageClick="handlePageClick"
        @update:selected="selectedRows"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'fullName'">
            <CpCustomInfo
              :context="context"
            />
          </div>
          <div v-if="col === 'title'">
            <CmSelect
              v-model="context.titleId"
              :items="listTitles"
              custom-key="name"
              item-value="id"
              :append-to-body="isEditUser"
              :placeholder="LABEL.TITLE1"
              @update:modelValue="changeCellvalue($event, context)"
            />
          </div>
        </template>
      </CmTable>
    </div>
  </CmDialogs>
</template>

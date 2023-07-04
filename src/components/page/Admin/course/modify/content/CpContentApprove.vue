<script setup lang="ts">
import toast from '@/plugins/toast'

/** call api */
import MethodsUtil from '@/utils/MethodsUtil'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CmTextField from '@/components/common/CmTextField.vue'
import { contentManagerStore } from '@/stores/admin/course/content'
import { tableStore } from '@/stores/table'

const CpApproveContentFilter = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/CpApproveContentFilter.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpCustomInforCourse = defineAsyncComponent(() => import('@/components/page/gereral/CpCustomInforCourse.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const storeContentManager = contentManagerStore()
const { viewMode } = storeToRefs(storeContentManager)
const storeTable = tableStore()
const { callBackAction } = storeToRefs(storeTable)

/** state */
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('content'), value: 'name', type: 'custom' },
  { text: t('author-name'), value: 'authorName' },
  { text: t('type-content'), value: 'contentArchiveTypeName' },
  { text: t('note-course'), value: 'description', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
])
const items = ref<any>([])
const totalRecord = ref(0)
const isShowFilter = ref(true)
let queryParams = reactive({
  courseId: route?.params?.id || null,
  authorId: undefined,
  contentArchiveTypeId: 0,
  topicId: 0,
  searchData: '',
  sort: ['-name'],
  pageSize: 10,
  pageNumber: 1,
})
const actionsTable = [
  {
    id: 23,
  },
  {
    id: 9,
  },
]
const data = reactive({
  listIds: [], // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})
const disabledBack = computed(() => !data.selectedRowsIds.length)
const disabledApprove = computed(() => !data.selectedRowsIds.length)

/** method */
// hàm trả về các loại action khi click
function actionItem(type: any) {
  switch (type[0]?.name) {
    case 'ActionDeclined':
      handleApproveRejectById(type[1], 'back')
      break
    case 'ActionAgree':
      handleApproveRejectById(type[1], 'approve')
      break
    default:
      break
  }
}
callBackAction.value = actionItem

//  fillter header
async function handleFilterCombobox(dataFilter: any) {
  queryParams = {
    ...queryParams,
    ...dataFilter,
  }
  await getListAprove()
}

// search ở fillter header
async function handleSearch(value: any) {
  queryParams.pageNumber = 1
  queryParams.searchData = value
  await getListAprove()
}

// chuyển trang
async function handlePageClick(page: any) {
  queryParams.pageNumber = page
  await getListAprove()
}
function selectedRows(e: any) {
  data.selectedRowsIds = e
}
async function handleApproveReject(key: string) {
  const params = {
    listModel: [] as any,
  }
  data.selectedRowsIds.forEach((item: any) => {
    params.listModel.push({
      id: item,
      description: items.value.find((rowData: any) => rowData.id = item)?.description,
    })
  })

  await MethodsUtil.requestApiCustom(
    key === 'approve'
      ? CourseService.PostApproveContentCourse
      : CourseService.PostSendRejectContentCourse,
    TYPE_REQUEST.POST, params)
    .then((value: any) => {
      toast('SUCCESS', t(value?.message))
      getListAprove()
    })
    .catch((error: any) => {
      toast('ERROR', t(error.response.data.message))
    })
}
async function handleApproveRejectById(rowItem: any, key: string) {
  const params = {
    listModel: [
      {
        id: rowItem.id,
        description: rowItem.description,
      },
    ],
  }
  await MethodsUtil.requestApiCustom(
    key === 'approve'
      ? CourseService.PostApproveContentCourse
      : CourseService.PostSendRejectContentCourse,
    TYPE_REQUEST.POST, params)
    .then((value: any) => {
      toast('SUCCESS', t(value?.message))
      getListAprove()
    })
    .catch((error: any) => {
      toast('ERROR', t(error.response.data.message))
    })
}

// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  switch (type) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
      break

    case 'back':
      handleApproveReject('back')
      break

    case 'approve':
      handleApproveReject('approve')
      break

    default:
      break
  }
}

// lấy thông tin tác giả
async function getAuthorName(pageLists: any) {
  const userIds = pageLists?.map((user: any) => user.authorId)

  const users = await MethodsUtil.searchUserInfoByIds(userIds)

  pageLists.forEach((element: any) => {
    const user = users.pageLists.find((item: any) => item.id === element.authorId)
    element.statusId = 2
    if (user)
      element.authorName = MethodsUtil.formatFullName(user.firstName, user.lastName)
    element.actions = actionsTable
  })
}
async function getListAprove() {
  await MethodsUtil.requestApiCustom(CourseService.PostListApproveContent, TYPE_REQUEST.POST, queryParams).then(async (value: any) => {
    if (value?.data) {
      if (value?.data?.pageLists) {
        items.value = value?.data?.pageLists
        await getAuthorName(value?.data?.pageLists)
      }
      else {
        items.value = []
      }

      totalRecord.value = value?.data?.totalRecord
    }
  })
}
function valueChange(value: any, rowData: any) {
  items.value[rowData?.originIndex].description = value
}
function onCancel() {
  viewMode.value = 'view'
}
getListAprove()
</script>

<template>
  <div>
    <div class="text-medium-lg mb-6">
      {{ t('approve-content') }}
    </div>
    <div
      v-if="isShowFilter"
      class="filter-action"
    >
      <CpApproveContentFilter
        :data-filter="queryParams"
        @update="($event: any) => handleFilterCombobox($event)"
      />
    </div>
    <div>
      <CpHeaderAction
        is-back
        is-fillter
        is-approve
        :disabled-back="disabledBack"
        :disabled-approve="disabledApprove"
        @click="handleClickBtn"
        @update:keyword="handleSearch"
      />
    </div>
    <div class="mb-6">
      <!-- ref="refTableCourseList" -->
      <CmTable
        v-model:pageSize="queryParams.pageSize"
        :headers="headers"
        :items="items"
        :total-record="totalRecord"
        :page-number="queryParams.pageNumber"
        @handlePageClick="handlePageClick"
        @update:selected="selectedRows"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'name'">
            <CpCustomInforCourse
              label-title="name"
              label-sub-title="statusId"
              :context="context"
            />
          </div>
          <div v-if="col === 'description'">
            <CmTextField
              v-model="context.description"
              @update:model-value="valueChange($event, context)"
            />
          </div>
        </template>
      </CmTable>
    </div>
    <div>
      <CpActionFooterEdit
        is-cancel
        :title-cancel="t('come-back')"
        @onCancel="onCancel"
      />
    </div>
  </div>
</template>

<style lang="scss">
@use "/src/styles/style-global" as *;
</style>

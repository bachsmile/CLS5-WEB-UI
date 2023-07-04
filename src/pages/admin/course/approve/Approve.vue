<script setup lang="ts">
import toast from '@/plugins/toast'

/** call api */
import MethodsUtil from '@/utils/MethodsUtil'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CmTextField from '@/components/common/CmTextField.vue'
import { tableStore } from '@/stores/table'

const CpApproveFilter = defineAsyncComponent(() => import('@/components/page/Admin/course/approve/CpApproveFilter.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpCustomInforCourse = defineAsyncComponent(() => import('@/components/page/gereral/CpCustomInforCourse.vue'))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const storeTable = tableStore()
const { callBackAction } = storeToRefs(storeTable)

/** state */
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-course'), value: 'name', type: 'custom' },
  { text: t('creator'), value: 'authorName' },
  { text: t('note-course'), value: 'description', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
])
const items = ref<any>([])
const totalRecord = ref(0)
const isShowFilter = ref(true)
let queryParams = reactive({
  authorId: undefined,
  statusId: 0,
  fromDate: '',
  toDate: '',
  searchData: '',
  sort: ['-name'],
  pageSize: 10,
  pageNumber: 1,
})
const actionsTable = [
  {
    id: 17,
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
      ? CourseService.PostApproveCourse
      : CourseService.PostSendRejectCourse,
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
      ? CourseService.PostApproveCourse
      : CourseService.PostSendRejectCourse,
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
  const userIds = pageLists.map((user: any) => user.authorId)

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
  await MethodsUtil.requestApiCustom(CourseService.GetPagingAgreeCourse, TYPE_REQUEST.GET, queryParams).then(async (value: any) => {
    if (value?.data) {
      await getAuthorName(value?.data?.pageLists)
      items.value = value?.data?.pageLists
      totalRecord.value = value?.data?.totalRecord
    }
  })
}
function valueChange(value: any, rowData: any) {
  items.value[rowData?.originIndex].description = value
}
getListAprove()
</script>

<template>
  <div>
    <div class="text-medium-lg mb-6">
      Danh sách khóa học
    </div>
    <div
      v-if="isShowFilter"
      class="filter-action"
    >
      <CpApproveFilter
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
    <div>
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
  </div>
</template>

<style lang="scss">
@use "/src/styles/style-global" as *;
</style>

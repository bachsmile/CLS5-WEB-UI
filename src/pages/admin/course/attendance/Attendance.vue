<script setup lang="ts">
import CourseService from '@/api/course/index'
import StringUtil from '@/utils/StringUtil'
import DateUtil from '@/utils/DateUtil'
import MethodsUtil from '@/utils/MethodsUtil'
import { StatusAttendance } from '@/constant/data/status.json'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CpConfirmDialog from '@/components/page/gereral/CpConfirmDialog.vue'
import CmTable from '@/components/common/CmTable.vue'
import CmChip from '@/components/common/CmChip.vue'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import toast from '@/plugins/toast'
import { tableStore } from '@/stores/table'
import CpActionFooterEdit from '@/components/page/gereral/CpActionFooterEdit.vue'

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const router = useRouter()

/** store */
const storeTable = tableStore()
const { callBackAction } = storeToRefs(storeTable)

const data = reactive({
  deleteIds: [], // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})
const queryParams = ref<any>({
  sort: [],
  keyword: '',
  pageNumber: 1,
  pageSize: 10,
})
const disabledDelete = computed(() => !data.selectedRowsIds.length)
const isShowDialogNotiDelete = ref(false)

// data table
const items = ref([])
const totalRecord = ref(0)
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('date-attendance'), value: 'date', type: 'custom' },
  { text: t('name-content'), value: 'content' },
  { text: t('Teacher'), value: 'fullname', type: 'custom' },
  { text: t('amount-students'), value: 'students', type: 'custom' },
  { text: t('status'), value: 'statusId', type: 'custom' },
  { text: '', value: 'actions', width: 150, type: 'custom' },
])

// search ở fillter header
async function handleSearch(value: any) {
  queryParams.value.pageNumber = 1
  queryParams.value.keyword = value

  await getListAttendance()
}
async function handlePageClick(page: any) {
  queryParams.value.pageNumber = page
  await getListAttendance()
}

// click  multi delete btn to show modal confirm
function deleteItems() {
  data.deleteIds = data.selectedRowsIds
  isShowDialogNotiDelete.value = true
}
function deleteItem(id: number) {
  data.deleteIds = [id as never]
  isShowDialogNotiDelete.value = true
}

// hành động của dialog
function confirmDialogDelete(event: any) {
  if (event)
    deleteAction()
}

// delete action
async function deleteAction() {
  const params = {
    ids: data.deleteIds,
  }
  await window.requestApiCustom(
    CourseService.PostDelCheckinCourse(Number(route.params.id)),
    TYPE_REQUEST.POST, params)
    .then(async (value: any) => {
      toast('SUCCESS', t(value?.message))
      data.deleteIds = []
      data.selectedRowsIds = []
      await getListAttendance()
    })
    .catch(() => {
      toast('ERROR', t('USR_DeleteFail'))
    })
}
function selectedRows(e: any) {
  data.selectedRowsIds = e
}

// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  switch (type) {
    case 'delete':
      deleteItems()
      break

    default:
      break
  }
}
function handleCancle() {
  router.push({ name: 'course' })
}

// hàm trả về các loại action khi click
function actionItem(type: any) {
  switch (type[0]?.name) {
    case 'ActionViewDetail':
      router.push({
        name: 'attendance-view',
        params: { id: Number(route.params.id), idAttendance: Number(type[1].id) },
      })
      break
    case 'ActionDelete':
      deleteItem(type[1].id)
      break
    case 'ActionEdit':
      router.push({
        name: 'attendance-update',
        params: { id: Number(route.params.id), idAttendance: Number(type[1].id) },
      })
      break
    default:
      break
  }
}
callBackAction.value = actionItem
async function getListAttendance() {
  await window.requestApiCustom(CourseService.GetListCheckinCourse(Number(route.params.id)), TYPE_REQUEST.GET, queryParams.value).then(async (value: any) => {
    if (value?.data) {
      value.data.pageLists.forEach((element: any) => {
        element.actions = [
          MethodsUtil.checkActionType({ id: 1 }),
          MethodsUtil.checkActionType({ id: 2 }),
          MethodsUtil.checkActionType({ id: 4 }),
        ]
      })
      items.value = value.data.pageLists
      totalRecord.value = value.data.totalRecord
    }
  })
}

/** ***************** */
getListAttendance()
</script>

<template>
  <div>
    <div class="text-medium-lg mb-6">
      {{ t('attendance-list') }}
    </div>
    <div>
      <CpHeaderAction
        is-delete
        :is-fillter="false"
        is-add
        :add-button-name="t('Add-new')"
        :disabled-delete="disabledDelete"
        @click="handleClickBtn"
        @add-handler="router.push({ name: 'attendance-add' })"
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
          <div v-if="col === 'fullname'">
            {{ StringUtil.formatFullName(context.firstName, context.lastName) }}
          </div>
          <div v-if="col === 'date'">
            <span>{{ DateUtil.formatDateToDDMM(context[col]) }}</span>
          </div>
          <div v-if="col === 'students'">
            <span>{{ context.count }} / {{ context.total }}</span>
          </div>
          <div v-if="col === 'statusId'">
            <CmChip
              :color="MethodsUtil.checkType(context.statusId, StatusAttendance, 'id')?.color"
            >
              <VIcon
                start
                :icon="MethodsUtil.checkType(context.statusId, StatusAttendance, 'id')?.icon"
                size="12"
              />
              <span>{{ t(MethodsUtil.checkType(context.statusId, StatusAttendance, 'id')?.name) }}</span>
            </CmChip>
          </div>
        </template>
      </CmTable>
    </div>
    <div>
      <CpActionFooterEdit
        is-cancel
        :title-cancel="t('come-back')"
        @on-cancel="handleCancle"
      />
    </div>
    <CpConfirmDialog
      v-model:is-dialog-visible="isShowDialogNotiDelete"
      :type="2"
      variant="outlined"
      :max-width="400"
      :confirmation-msg-sub-title="t('warning-delete-day-attendance')"
      :confirmation-msg="t('delete-attendance')"
      @confirm="confirmDialogDelete"
    />
  </div>
</template>

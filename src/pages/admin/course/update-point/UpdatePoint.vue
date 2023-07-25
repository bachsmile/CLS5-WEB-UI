<script setup lang="ts">
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CpActionHeaderPage from '@/components/page/gereral/CpActionHeaderPage.vue'
import CmTable from '@/components/common/CmTable.vue'
import StringUtil from '@/utils/StringUtil'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import toast from '@/plugins/toast'
import CmTextField from '@/components/common/CmTextField.vue'
import CpActionFooterEdit from '@/components/page/gereral/CpActionFooterEdit.vue'
import CpMdUpdatePointAll from '@/components/page/Admin/course/modal/CpMdUpdatePointAll.vue'
import { load } from '@/stores/loadComponent.js'
import CpCustomInfo from '@/components/page/gereral/CpCustomInfo.vue'

const emit = defineEmits<Emit>() /** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const router = useRouter()
interface Emit {
  (e: 'back'): void
}
const store = load()
const { unLoadComponent } = store

/** state */
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

const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('student'), value: 'fullname', type: 'custom' },
  { text: t('scores'), value: 'scores', width: 250, type: 'custom' },
  { text: '', value: 'actions', width: 150, type: 'custom' },
])
const items = ref<any[]>([])
const totalRecord = ref(0)
const totalRecordScored = ref(0)
const searchField = ref(['code', 'info'])
const searchValue = ref()
const courseid = Number(route.params.id)
const contentId = Number(route.params.contentId)
const scored = ref(0)
const listPointStudent = ref<any>({})
const isShowMdUpdatePoint = ref(false)
const actionUpdate = ref([
  {
    title: t('update-point'),
    icon: 'tabler:folder-plus',
    disabled: disabledDelete,
    action: openModalPointAll,
  },
  {
    title: t('update-point-import'),
    icon: 'tabler:folder-plus',
    action: () => {
      router.push({ name: 'update-from-file-point-offline', params: { id: courseid, contentId } })
    },
  },
])

// search ở fillter header
async function handleSearch(value: any) {
  queryParams.value.pageNumber = 1
  queryParams.value.keyword = value
  searchValue.value = value
}
async function handlePageClick(page: any) {
  queryParams.value.pageNumber = page
}
function selectedRows(e: any) {
  data.selectedRowsIds = e
}
function openModalPointAll(value: any) {
  isShowMdUpdatePoint.value = true
}
function valueChange(value: any, dataChange: any) {
  if (value || value === '0')
    items.value[dataChange?.originIndex].scores = StringUtil.decimalToFixed(Number(value), 4)
  else
    items.value[dataChange?.originIndex].scores = null

  listPointStudent.value[items.value[dataChange?.originIndex].learnerId] = items.value[dataChange?.originIndex]

  scored.value = items.value.filter(item => item.scores === 0 || item.scores > 0)?.length
}
function handleCancle() {
  router.push({ name: 'course-edit', params: { id: Number(route.params.id) }, query: { tab: 'content' } })
}

// trở về trang danh sách nội dung
function backToListContent() {
  router.push({ name: 'course-edit', params: { id: Number(route.params.id) }, query: { tab: 'content' } })
  emit('back')
}

// fetch
// danh sách
async function getListPointStudent() {
  const params = {
    contentId,
  }
  await window.requestApiCustom(CourseService.GetListPointStudent(`${courseid}`), TYPE_REQUEST.GET, params)
    .then((value: any) => {
      value.data.pageLists.forEach((item: any) => {
        item.info = StringUtil.formatFullName(item.firstName, item.lastName)
      })
      items.value = value.data.pageLists

      if (value?.data) {
        value.data.pageLists.forEach((item: any, index: any) => {
          item.listIndex = index
          item.isSelected = false
          item.info = StringUtil.formatFullName(item.firstName, item.lastName)
        })
        items.value = value.data.pageLists
        totalRecord.value = value.data?.totalRecord
        scored.value = items.value[0]?.scored ? items.value[0]?.scored : 0
        totalRecordScored.value = items.value[0]?.totalRecord ? items.value[0]?.totalRecord : 0
      }
    })
    .catch((error: any) => {
      if (error?.response?.data?.errors?.length > 0)
        toast('ERROR', t(window.getErrorsMessage(error?.response?.data?.errors, t)))
    })
}

// api cập nhật điểm
async function handleUpdatePoint(idx: any, listPoint: any[]) {
  const params = {
    contentId,
    scores: listPoint,
  }
  await window.requestApiCustom(CourseService.PutUpdatePointContent(`${courseid}`), TYPE_REQUEST.PUT, params)
    .then((value: any) => {
      toast('SUCCESS', t(value.message))
      backToListContent()
      unLoadComponent(idx)
    })
    .catch((error: any) => {
      if (error?.response?.data?.errors?.length > 0)
        toast('ERROR', t(window.getErrorsMessage(error?.response?.data?.errors, t)))
      unLoadComponent(idx)
    })
}

// dowload file
async function changeAll(value: any) {
  // const listScoreSelected = this.$refs['data-table'].selectedRows
  const listScoreSelected = await items.value.filter(item => item.isSelected)

  listScoreSelected.forEach(item => {
    item.scores = value
  })

  handleUpdatePoint(0, listScoreSelected)
}

/** main */
getListPointStudent()
</script>

<template>
  <div>
    <div>
      <CpActionHeaderPage
        :action-update="actionUpdate"
        is-update-btn
        :title="t('attendance-list')"
      />
    </div>
    <div>
      <CpHeaderAction
        :is-fillter="false"
        :add-button-name="t('Add-new')"
        @add-handler="router.push({ name: 'attendance-add' })"
        @update:keyword="handleSearch"
      />
    </div>
    <div class="mb-6">
      <CmTable
        v-model:pageSize="queryParams.pageSize"
        v-model:page-number="queryParams.pageNumber"
        :headers="headers"
        :items="items"
        :total-record="totalRecord"
        is-local-table
        is-action-footer
        :search-field="searchField"
        :search-value="searchValue"
        custom-id="learnerId"
        @handlePageClick="handlePageClick"
        @update:selected="selectedRows"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'fullname'">
            <CpCustomInfo
              label-code="code"
              is-show-code
              :context="context"
            />
          </div>
          <div v-if="col === 'scores'">
            <CmTextField
              v-model="context.scores"
              type="number"
              :min="0"
              :max="100"
              is-null-number
              :maxlength="3"
              @change="valueChange(Number($event), context)"
            />
          </div>
        </template>
        <template #action-footer>
          <div class="d-flex justify-end text-primary">
            {{ t('scored') }}: {{ scored }} / {{ totalRecord }}
          </div>
        </template>
      </CmTable>
    </div>
    <div>
      <CpActionFooterEdit
        is-save
        is-cancel
        :title-cancel="t('come-back')"
        :title-save="t('save')"
        @on-save="(idx: any) => handleUpdatePoint(idx, Object.values(listPointStudent))"
        @on-cancel="handleCancle"
      />
    </div>
    <CpMdUpdatePointAll
      v-model:isShowModal="isShowMdUpdatePoint"
      @update:changeAll="changeAll"
    />
  </div>
</template>

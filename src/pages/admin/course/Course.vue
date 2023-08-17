<script lang="ts" setup>
import { courseListManagerStore } from '@/stores/admin/course/courseList'
import { courseApproveManagerStore } from '@/stores/admin/course/approve'
import { courseManagerStore } from '@/stores/admin/course/course'
import StringUtil from '@/utils/StringUtil'
import MethodsUtil from '@/utils/MethodsUtil'
import DateUtil from '@/utils/DateUtil'
import { StatusTypeFormStudy } from '@/constant/data/status.json'
import StringJwt from '@/utils/Jwt'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CmCollapse from '@/components/common/CmCollapse.vue'
import toast from '@/plugins/toast'
import { tableStore } from '@/stores/table'
import { ContentType } from '@/constant/data/contentCourseType.json'

window.showAllPageLoading('COMPONENT')

const CpActionHeaderPage = defineAsyncComponent(() => import('@/components/page/gereral/CpActionHeaderPage.vue'))
const CpCourseFilter = defineAsyncComponent(() => import('@/components/page/Admin/course/CpCourseFilter.vue'))
const CmChip = defineAsyncComponent(() => import('@/components/common/CmChip.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpCustomInforCourse = defineAsyncComponent(() => import('@/components/page/gereral/CpCustomInforCourse.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))
const CpMdApproveCourse = defineAsyncComponent(() => import('@/components/page/Admin/course/modal/CpMdApproveCourse.vue'))
const CpMdRatioPointContent = defineAsyncComponent(() => import('@/components/page/Admin/course/modal/CpMdRatioPointContent.vue'))
const CpMdCoppyCourse = defineAsyncComponent(() => import('@/components/page/Admin/course/modal/CpMdCoppyCourse.vue'))
const CpMdFeedBack = defineAsyncComponent(() => import('@/components/page/Admin/course/modal/CpMdFeedBack.vue'))
const CpMdDownloadMul = defineAsyncComponent(() => import('@/components/page/gereral/modal/CpMdDownloadMul.vue'))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const router = useRouter()

/** Store */
const storeCourseListManager = courseListManagerStore()
const {
  isShowFilter, queryParams, items, totalRecord,
  settingDefaults, constant, compoboxSortCourse,
  users, topicCombobox, disabledDelete,
  disabledApprove, isShowDialogNotiDelete,

} = storeToRefs(storeCourseListManager)
const {
  handlerActionHeader, handleFilterCombobox,
  handlePageClick, selectedRows, pushQuery, handleSearch,
  deleteItem, deleteItems, confirmDialogDelete,
  updateDialogVisible, approveCourses, approve,
} = storeCourseListManager

const storecourseManager = courseManagerStore()
const { isShowModalCoppyCourse, coppyData } = storeToRefs(storecourseManager)

const storeCourseApproveManager = courseApproveManagerStore()
const { idModalSendApproveCourse, idModalSendRatioPoint } = storeToRefs(storeCourseApproveManager)
const { sendApproveCourse } = storeCourseApproveManager

const storeTable = tableStore()
const { callBackAction } = storeToRefs(storeTable)

const queryParamsInit = {
  dateFrom: null,
  dateTo: null,
  userId: null,
  search: null,
  sort: '-modifiedDate',
  pageNumber: 1,
  pageSize: 10,
  topicIds: [],
  formOfStudy: null,
  isDisplayHome: null,
  statusId: null,
  ownerId: null,
}

const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-course'), value: 'name', type: 'custom' },
  { text: t('topic'), value: 'topicCourse' },
  { text: t('author-name'), value: 'fullname', type: 'custom' },
  { text: t('form-study'), value: 'formStudy', type: 'custom' },
  { text: t('duration-time'), value: 'time', type: 'custom' },
  { text: t('date-update'), value: 'modifiedDate', type: 'custom' },
  { text: '', value: 'actions', width: 150, type: 'custom' },
])
const isShowModalFeedBack = ref(false)
const isShowModalDownload = ref(false)
const dataFeedBack = ref<any>()
const paramsDowloadContent = ref({
  courseId: '' as any,
  keyword: '',
  pageNumber: null,
  pageSize: null,
})

// hàm trả về các loại action khi click
function actionItem(type: any) {
  switch (type[0]?.name) {
    case 'ActionViewDetail':
      router.push({ name: 'course-view', params: { tab: 'infor', id: type[1].id } })
      break
    case 'ActionDelete':
      deleteItem(type[1].id)
      break
    case 'ActionSendAgree':
      sendApproveCourse(type[1].id, type[1].courseApprovers || [])
      break
    case 'approve':
      approve(type[1].id)
      break
    case 'ActionViewFeedBack':
      handleViewFeedBack(type[1].id)
      break
    case 'ActionEdit':
      router.push({ name: 'course-edit', params: { id: Number(type[1].id) } })
      break
    case 'CopyCourse':
      isShowModalCoppyCourse.value = true
      coppyData.value.id = type[1].id
      break
    case 'ActionRollCallOffline':
      router.push({ name: 'attendance-list', params: { id: Number(type[1].id) } })
      break
    case 'DownloadContentCourse':
      paramsDowloadContent.value.courseId = Number(type[1].id)
      getListFilesCourse()
      nextTick(() => {
        isShowModalDownload.value = true
      })

      break

    default:
      break
  }
}
callBackAction.value = actionItem

// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  switch (type) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
      break
    case 'delete':
      deleteItems()
      break

    case 'approve':
      approveCourses()
      break

    default:
      break
  }
}
async function handleViewFeedBack(id: number) {
  isShowModalFeedBack.value = true

  const params = {
    id,
  }
  await MethodsUtil.requestApiCustom(CourseService.GetFeedBackCourse, TYPE_REQUEST.GET, params).then((value: any) => {
    dataFeedBack.value = value.data?.feedback
  })
}
async function handleApproveCourse() {
  queryParams.value = queryParamsInit
  await pushQuery()
}

async function handleCoppyCourse() {
  window.showAllPageLoading('FULL-OPACITY')
  await MethodsUtil.requestApiCustom(CourseService.PostCoppyCourse, TYPE_REQUEST.POST, coppyData.value).then((value: any) => {
    toast('SUCCESS', t(value.message))
    nextTick(() => {
      isShowModalCoppyCourse.value = false
      fetchListCourse()
      window.hideAllPageLoading()
    })
  })
    .catch((error: any) => {
      toast('ERROR', t(error.response.data.message))
      window.hideAllPageLoading()
    })
}

// tải khóa học

const listFileDown = ref([])
function searchFile(keyword: any) {
  paramsDowloadContent.value.keyword = keyword
  getListFilesCourse()
}

const isDowloading = ref(false)
const itemDownloading = ref<any>({})
function cancelModal() {
  if (isDowloading.value)
    toast('WARNING', t('progress-file'))
  else
    isShowModalDownload.value = false
}
async function getListFilesCourse() {
  await window.requestApiCustom(CourseService.GetListFilesCourse, TYPE_REQUEST.GET, paramsDowloadContent.value).then((value: any) => {
    if (value.data?.pageLists) {
      listFileDown.value = value.data?.pageLists
        .map((item: any) => ({
          name: item.name,
          type: t(MethodsUtil.checkType(item?.contentArchiveTypeId, ContentType, 'id')?.name),
          icon: MethodsUtil.checkType(item?.contentArchiveTypeId, ContentType, 'id')?.icon,
          size: 0,
          processing: 0,
          folder: MethodsUtil.getFolder(item.urlFile, item.contentArchiveTypeId),
          statusDownload: (isDowloading.value || (itemDownloading.value && item.id === itemDownloading.value?.id)) ? 2 : 1,
          ...item,
        }))
    }
  })
}

// Fetch data danh sách khóa học
async function fetchListCourse() {
  if (!route?.query?.sort) {
    const sortSetting = settingDefaults?.value.find(item => item.typeId === 8) // type 8 cài đặt mặc định sắp xếp khóa học
    if (sortSetting && sortSetting?.value) {
      const sortDefault = constant.value.sortCourseDefault?.find(item => item.value === sortSetting.value)
      if (sortDefault && compoboxSortCourse.value?.find(item => item.key === sortDefault.key))
        queryParams.value.sort = sortDefault?.key
    }
  }
  const params = {
    ...queryParams.value,
    role: StringJwt.getRole(),
  }
  await MethodsUtil.requestApiCustom(CourseService.GetCourseList, TYPE_REQUEST.GET, params).then(async (value: any) => {
    if (value?.data) {
      items.value = value.data.pageLists
      totalRecord.value = value.data.totalRecord
    }
  })
}

watch(() => route.query, (val: any) => {
  if (Object.keys(val).length > 0) {
    queryParams.value.pageNumber = val.pageNumber ? Number(val.pageNumber) : 1
    queryParams.value.pageSize = val.pageSize ? Number(val.pageSize) : 10
    queryParams.value.search = val.search ? val.search : null
    queryParams.value.topicIds = (val.topicIds && val.topicIds.length) ? val.topicIds.map((item: any) => Number(item)) : []
    queryParams.value.formOfStudy = val.formOfStudy ? Number(val.formOfStudy) : null
    queryParams.value.sort = val.sort ? val.sort : '-modifiedDate'

    queryParams.value.isDisplayHome = val.isDisplayHome === 'true' ? true : val.isDisplayHome === 'false' ? false : null
    queryParams.value.statusId = val.statusId ? Number(val.statusId) : null
    queryParams.value.dateFrom = val.dateFrom ? val.dateFrom : null
    queryParams.value.userId = val.userId ? val.userId : null
    queryParams.value.ownerId = val.ownerId ? Number(val.ownerId) : null
  }
}, { deep: true, immediate: true })

watch(() => queryParams.value, (val: any) => {
  if (val.dateFrom && val.dateTo) {
    const start: any = new Date(val.dateFrom)
    const end: any = new Date(val.dateTo)
    if ((start - end) > 0)
      return
  }
  queryParams.value = val
  if (Object.keys(val).length <= 0) {
    queryParams.value = {
      pageNumber: 1,
      pageSize: 10,
      search: null,
      topicIds: [],
      formOfStudy: null,
      sort: '-modifiedDate',
      isDisplayHome: null,
      statusId: null,
      dateFrom: null,
      dateTo: null,
      ownerId: null,
      userId: null,
    }
  }
  pushQuery()
  fetchListCourse()
}, { deep: true, immediate: true })

// chạy
window.hideAllPageLoading()
</script>

<template>
  <div>
    <div>
      <CpActionHeaderPage
        :title-custom="t('course-approve')"
        :title-custom-add="t('add-course')"
        :title="t('list-course')"
        is-custom-btn
        is-custom-add-btn
        @click="handlerActionHeader"
      />
    </div>

    <CmCollapse :is-show="isShowFilter">
      <CpCourseFilter
        :data-filter="queryParams"
        @update="($event: any) => handleFilterCombobox($event)"
      />
    </CmCollapse>

    <div>
      <CpHeaderAction
        is-delete
        is-fillter
        is-approve
        :disabled-delete="disabledDelete"
        :disabled-approve="disabledApprove"
        @click="handleClickBtn"
        @update:keyword="handleSearch"
      />
    </div>
    <div id="cap-report-overview">
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
          <div v-if="col === 'fullname'">
            {{ StringUtil.formatFullName(context.firstName, context.lastName) }}
          </div>
          <div v-if="col === 'formStudy'">
            <CmChip
              v-if="context.formOfStudyName"
              :color="MethodsUtil.checkType(context.formOfStudyName, StatusTypeFormStudy, 'name')?.color"
            >
              <VIcon
                start
                icon="carbon:dot-mark"
                size="12"
              />
              <span>{{ t(MethodsUtil.checkType(context.formOfStudyName, StatusTypeFormStudy, 'name')?.name) }}</span>
            </CmChip>
          </div>
          <div v-if="col === 'time'">
            {{ DateUtil.formatSecond(context.time) }}
          </div>
          <div v-if="col === 'modifiedDate'">
            <span>{{ DateUtil.formatDateToDDMM(context[col]) }}</span>
          </div>
        </template>
      </CmTable>
    </div>
    <CpMdApproveCourse
      v-model:is-dialog-visible="idModalSendApproveCourse"
      @confirm="handleApproveCourse"
    />
    <CpMdCoppyCourse
      v-model:is-show-modal="isShowModalCoppyCourse"
      @save-change="handleCoppyCourse"
    />
    <CpMdRatioPointContent
      v-model:is-dialog-visible="idModalSendRatioPoint"
    />
    <CpConfirmDialog
      :type="2"
      variant="outlined"
      :max-width="400"
      :confirmation-msg-sub-title="t('warning-delete-course')"
      :confirmation-msg="t('Delete-course')"
      :is-dialog-visible="isShowDialogNotiDelete"
      @update:isDialogVisible="($event) => updateDialogVisible($event)"
      @confirm="confirmDialogDelete"
    />
    <CpMdFeedBack
      v-model:is-show-modal-feed-back="isShowModalFeedBack"
      :data-feed-back="dataFeedBack"
    />
    <CpMdDownloadMul
      v-model:is-show-modal="isShowModalDownload"
      v-model:dowloading="isDowloading"
      v-model:item-downloading="itemDownloading"
      :list-item="listFileDown"
      @search="searchFile"
      @cancel="cancelModal"
    />
  </div>
</template>

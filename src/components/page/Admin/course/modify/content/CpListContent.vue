<script lang="ts" setup>
import CpMdEditMeeting from './type/meeting/CpMdEditMeeting.vue'
import { contentManagerStore } from '@/stores/admin/course/content'
import { courseApproveManagerStore } from '@/stores/admin/course/approve'
import MethodsUtil from '@/utils/MethodsUtil'
import { StatusTypeCourse } from '@/constant/data/status.json'
import { ContentType } from '@/constant/data/contentCourseType.json'
import DateUtil from '@/utils/DateUtil'
import CmTableGroup from '@/components/common/CmTableGroup.vue'
import CpActionHeaderPage from '@/components/page/gereral/CpActionHeaderPage.vue'
import CpMdFeedBack from '@/components/page/Admin/course/modal/CpMdFeedBack.vue'
import CmChip from '@/components/common/CmChip.vue'
import CpConfirmDialog from '@/components/page/gereral/CpConfirmDialog.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CmButton from '@/components/common/CmButton.vue'
import CmDropDown from '@/components/common/CmDropDown.vue'
import CpMdRatioPointContent from '@/components/page/Admin/course/modal/CpMdRatioPointContent.vue'
import CpContentApprove from '@/components/page/Admin/course/modify/content/CpContentApprove.vue'
import CpActionFooterEdit from '@/components/page/gereral/CpActionFooterEdit.vue'
import CpMdMoveThematicContent from '@/components/page/Admin/course/modal/CpMdMoveThematicContent.vue'
import CpMdEditThematic from '@/components/page/Admin/course/modal/CpMdEditThematic.vue'
import CpMdAddFromStockContent from '@/components/page/Admin/course/modal/CpMdAddFromStockContent.vue'
import { tableStore } from '@/stores/table'
import CourseService from '@/api/course'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Any, typeToast } from '@/typescript/interface'
import toast from '@/plugins/toast'

/**
 * Store
 */

const storeContentManager = contentManagerStore()
const {
  items, isShowModelFeedback, feedbackContent, isShowDialogNotiDelete,
  disabledDelete, disabledEdit, data, viewMode, isShowModalMoveThematic,
  isShowModalUpdateThematic, isShowModalAddStockContent, isShowModalMeeting, dataDetailMeeting,
} = storeToRefs(storeContentManager)
const { getListContentCourse, handleMoveThematic, handleAddContentFromStock, confirmDialogDelete, handlerActionHeader, handleSearch, selectedRows, deleteItems, actionItemUserReg, checkMove, approveContent } = storeContentManager
const storeCourseApproveManager = courseApproveManagerStore()
const { idModalSendRatioPoint } = storeToRefs(storeCourseApproveManager)
const storeTable = tableStore()
const { callBackAction } = storeToRefs(storeTable)
const groupOptions = {
  allowEmptySelect: false,
  collapsable: false,
  enabled: false,
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const router = useRouter()

const headers = reactive([
  { text: '', value: 'checkbox' },
  { text: t('content'), value: 'name', key: true },
  { text: t('author-name'), value: 'fullname', type: 'custom' },
  { text: t('type-content'), value: 'contentArchiveTypeName', type: 'custom' },
  { text: t('status'), value: 'statusId', type: 'custom' },
  { text: t('duration-time'), value: 'time', type: 'custom' },
  { text: t('create-day'), value: 'registerDate', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
])

const isViewDetail = computed(() => route.name === 'course-view')

const headerTable = computed(() => {
  if (route.name === 'course-view') {
    return [{ text: t('content'), value: 'name', key: true },
      { text: t('author-name'), value: 'fullname', type: 'custom' },
      { text: t('type-content'), value: 'contentArchiveTypeName', type: 'custom' },
      { text: t('status'), value: 'statusId', type: 'custom' },
      { text: t('duration-time'), value: 'time', type: 'custom' },
      { text: t('create-day'), value: 'registerDate', type: 'custom' },
      { text: '', value: 'actions', width: 150 }]
  }
  return headers
})
const actionUpdate = [
  {
    title: t('add-from-stock-content'),
    icon: 'tabler:folder-plus',
    underline: true,
    action: () => {
      isShowModalAddStockContent.value = true
    },
  },
  {
    title: t('thematics'),
    icon: 'tabler:list',
    underline: true,
    action: () => {
      isShowModalUpdateThematic.value = true
    },
  },
  {
    title: t('text-content'),
    icon: MethodsUtil.checkType('text-content', ContentType, 'name')?.icon,
    action: () => {
      router.push({
        name: 'content-add',
        params: {
          id: Number(route.params.id),
          tab: route.params.tab,
          type: 'text-content',
          contentTab: 'infor',
        },
      })
    },
  },

  // Họp trực tuyến
  {
    title: t('meeting'),
    icon: MethodsUtil.checkType('online-content', ContentType, 'name')?.icon,
    underline: true,
    action: showModalAddMeeting,
  },
  {
    title: t('video-content'),
    icon: MethodsUtil.checkType('video-content', ContentType, 'name')?.icon,
    action: () => {
      router.push({
        name: 'content-add',
        params: {
          id: Number(route.params.id),
          tab: route.params.tab,
          type: 'video-content',
          contentTab: 'infor',
        },
      })
    },
  },
  {
    title: t('document-course'),
    icon: MethodsUtil.checkType('document-content', ContentType, 'name')?.icon,
    action: () => {
      router.push({
        name: 'content-add',
        params: {
          id: Number(route.params.id),
          tab: route.params.tab,
          type: 'document-content',
          contentTab: 'infor',
        },
      })
    },
  },
  {
    title: t('audio'),
    icon: MethodsUtil.checkType('audio-content', ContentType, 'name')?.icon,
    underline: true,
    action: () => {
      router.push({
        name: 'content-add',
        params: {
          id: Number(route.params.id),
          tab: route.params.tab,
          type: 'audio-content',
          contentTab: 'infor',
        },
      })
    },
  },
  {
    title: t('scorm'),
    icon: MethodsUtil.checkType('scorm-content', ContentType, 'name')?.icon,
    action: () => {
      router.push({
        name: 'content-add',
        params: {
          id: Number(route.params.id),
          tab: route.params.tab,
          type: 'scorm-content',
          contentTab: 'infor',
        },
      })
    },
  },
  {
    title: t('Iframe'),
    icon: MethodsUtil.checkType('iframe-content', ContentType, 'name')?.icon,
    underline: true,
    action: () => {
      router.push({
        name: 'content-add',
        params: {
          id: Number(route.params.id),
          tab: route.params.tab,
          type: 'iframe-content',
          contentTab: 'infor',
        },
      })
    },
  },
  {
    title: t('essay-content'),
    icon: MethodsUtil.checkType('essay-content', ContentType, 'name')?.icon,
    underline: true,
    action: () => {
      router.push({
        name: 'content-add',
        params: {
          id: Number(route.params.id),
          tab: route.params.tab,
          type: 'essay-content',
          contentTab: 'infor',
        },
      })
    },
  },
  {
    title: t('offline-content'),
    icon: MethodsUtil.checkType('offline-content', ContentType, 'name')?.icon,
    action: () => {
      router.push({
        name: 'content-add',
        params: {
          id: Number(route.params.id),
          tab: route.params.tab,
          type: 'offline-content',
          contentTab: 'infor',
        },
      })
    },
  },

]
const actionApprove = [
  {
    title: t('chosen-content'),
    icon: 'prime-check-circle',
    action: approveMultiContent,
  },
  {
    title: t('sent-content'),
    icon: 'tabler:send',
    action: () => {
      viewMode.value = 'approve'
    },
  },

]
function handleClickRow(e: any) {
  // console.log(e)
}

async function approveMultiContent() {
  const listId = data.value.selectedRowsIds.map((item: any) => ({
    id: item,
  }))
  await approveContent(listId).then(() => {
    getListContentCourse()
  })
}

function onCancel() {
  router.replace({ name: 'course' })
}

// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  switch (type) {
    case 'delete':
      deleteItems()
      break

    case 'edit':
      isShowModalMoveThematic.value = true
      break

    default:
      break
  }
}
onMounted(() => {
  callBackAction.value = actionItemUserReg
  getListContentCourse()
})

onUnmounted(() => {
  items.value = []
})

// Thêm cuộc họ trực tuyến
// const isShowModalMeeting = ref(false)
function showModalAddMeeting() {
  isShowModalMeeting.value = true
}

async function addOnlineLesson(lessonInfo: Any, unload: any) {
  let variant: typeToast = 'ERROR'
  let message = 'add-content-failed'
  await MethodsUtil.requestApiCustom(CourseService.PostCreateContent, TYPE_REQUEST.POST, lessonInfo).then(() => {
    variant = 'SUCCESS'
    message = 'add-content-success'
    isShowModalMeeting.value = false
  })
  unload()
  toast(variant, t(message))
}

async function updateOnlineLesson(lessonInfo: Any, unload: any) {
  let variant: typeToast = 'ERROR'
  let message = 'system-management.edit-content-failed'
  await MethodsUtil.requestApiCustom(CourseService.PostUpdateContent, TYPE_REQUEST.POST, lessonInfo).then(result => {
    variant = 'SUCCESS'
    message = 'system-management.edit-content-success'
    isShowModalMeeting.value = false
  })
  unload()
  toast(variant, t(message))
}
</script>

<template>
  <div
    v-if="viewMode === 'view'"
    class="mt-6"
  >
    <div>
      <CpActionHeaderPage
        :title="t('content-list')"
      >
        <template
          v-if="!isViewDetail"
          #actions
        >
          <div
            cols="12"
            md="3"
            class="d-flex justify-end  mr-2"
          >
            <CmButton
              :title="t('setting-point')"
              color="primary"
              variant="tonal"
              @click="handlerActionHeader('setting-point')"
            />
          </div>
          <div
            cols="12"
            md="3"
            class="d-flex justify-end  mr-2"
          >
            <CmDropDown
              :title="t('approve-content')"
              variant="tonal"
              color="success"
              :list-item="actionApprove"
              :type="2"
              icon="tabler:chevron-down"
              @click.stop
            />
          </div>
          <div
            cols="12"
            md="3"
            class="d-flex justify-end  mr-2"
          >
            <CmDropDown
              :title="t('add-content')"
              variant="tonal"
              color="primary"
              :list-item="actionUpdate"
              :type="2"
              icon="tabler:chevron-down"
              @click.stop
            />
          </div>
        </template>
      </CpActionHeaderPage>
    </div>
    <div>
      <CpHeaderAction
        :is-fillter="false"
        :is-delete="!isViewDetail"
        :disabled-delete="disabledDelete"
        @click="handleClickBtn"
        @update:keyword="handleSearch"
      >
        <template
          v-if="!isViewDetail"
          #actionLeft
        >
          <CmButton
            :disabled="disabledEdit"
            size="40"
            color="primary"
            @click="handleClickBtn('edit')"
          >
            <VIcon icon="fe:edit" />
          </CmButton>
        </template>
      </CpHeaderAction>
    </div>
    <div
      class="mb-6"
    >
      <CmTableGroup
        key-check-parent-row="contentArchiveTypeId"
        :value-check-parent-row="13"
        :group-options="groupOptions"
        :headers="headerTable"
        :items="items"
        custom-id="courseContentId"
        disiable-pagination
        @handleClickRow="handleClickRow"
        @update:selected="selectedRows"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'fullname'">
            {{ MethodsUtil.formatFullName(context.firstName, context.lastName) }}
          </div>
          <div v-if="col === 'contentArchiveTypeName'">
            {{ t(context[col]) }}
          </div>
          <div v-if="col === 'time'">
            {{ DateUtil.formatSecond(context.time) }}
          </div>
          <div v-if="col === 'registerDate'">
            <span>{{ DateUtil.formatDateToDDMM(context.registerDate) }}</span>
          </div>
          <div v-if="col === 'statusId'">
            <CmChip
              class="ma-2"
              :color="MethodsUtil.checkStatus(context[col], StatusTypeCourse)?.color"
            >
              <VIcon
                start
                icon="carbon:dot-mark"
                size="12"
              />
              <span>{{ t(MethodsUtil.checkStatus(context[col], StatusTypeCourse)?.name) }}</span>
            </CmChip>
          </div>
        </template>
        <template #actionDrop="{ context }">
          <VListItem
            class="mx-0"
            :disabled="!checkMove(context, true)"
            @click="actionItemUserReg([{ name: 'MoveUp' }, context])"
          >
            <VListItemTitle>
              <VIcon
                icon="tabler:corner-left-up"
                :size="18"
                class="mr-2"
                color="purple"
              />
              <span>{{ t('MoveUp') }}</span>
            </VListItemTitle>
          </VListItem>
          <VListItem
            class="mx-0"
            :disabled="!checkMove(context, false)"
            @click="actionItemUserReg([{ name: 'MoveDown' }, context])"
          >
            <VListItemTitle>
              <VIcon
                icon="tabler:corner-right-down"
                :size="18"
                class="mr-2"
                color="purple"
              />
              <span>{{ t('MoveDown') }}</span>
            </VListItemTitle>
          </VListItem>
        </template>
      </CmTableGroup>
    </div>
    <div>
      <CpActionFooterEdit
        is-cancel
        :title-cancel="t('come-back')"
        @onCancel="onCancel"
      />
    </div>
    <CpMdFeedBack
      v-model:is-show-modal-feed-back="isShowModelFeedback"
      :data-feed-back="feedbackContent"
    />
    <CpConfirmDialog
      v-model:is-dialog-visible="isShowDialogNotiDelete"
      :type="2"
      variant="outlined"
      :max-width="400"
      :confirmation-msg-sub-title="t('warning-delete-course')"
      :confirmation-msg="t('Delete-course')"
      @confirm="confirmDialogDelete"
    />
    <CpMdRatioPointContent
      v-model:is-dialog-visible="idModalSendRatioPoint"
    />
    <CpMdMoveThematicContent
      v-model:isShowModal="isShowModalMoveThematic"
      @saveChange="handleMoveThematic"
    />
    <CpMdEditThematic
      v-model:isShowModal="isShowModalUpdateThematic"
      @saveChange="handleMoveThematic"
    />
    <CpMdAddFromStockContent
      v-model:isShowModal="isShowModalAddStockContent"
      @saveChange="handleAddContentFromStock"
    />
    <CpMdEditMeeting
      v-model:isShow="isShowModalMeeting"
      :data-detail="dataDetailMeeting"
      :title="t('meeting  ')"
      @add="addOnlineLesson"
      @edit="updateOnlineLesson"
    />
    <!--
      @edit="updateOnlineLesson"
      @addZoom="addMeetingZoom"
      @editZoom="updateMeetingZoom"
    -->
  </div>
  <div
    v-else-if="viewMode === 'approve'"
    class="mt-6"
  >
    <CpContentApprove />
  </div>
</template>

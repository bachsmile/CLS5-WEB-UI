<script lang="ts" setup>
import { contentManagerStore } from '@/stores/admin/course/content'
import { courseApproveManagerStore } from '@/stores/admin/course/approve'
import MethodsUtil from '@/utils/MethodsUtil'
import { StatusTypeCourse } from '@/constant/data/status.json'
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

/**
 * Store
 */

const storeContentManager = contentManagerStore()
const {
  items, isShowModelFeedback, feedbackContent, isShowDialogNotiDelete,
  disabledDelete, disabledEdit, data, viewMode, isShowModalMoveThematic,
  isShowModalUpdateThematic, isShowModalAddStockContent,
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
    title: t('video'),
    icon: 'solar:video-frame-play-vertical-linear',
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
    icon: 'tabler:file-description',
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
  router.replace({ name: 'admin-course' })
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
        <template #actions>
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
        is-delete
        :is-fillter="false"
        :disabled-delete="disabledDelete"
        @click="handleClickBtn"
        @update:keyword="handleSearch"
      >
        <template #actionLeft>
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
        :headers="headers"
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
  </div>
  <div
    v-else-if="viewMode === 'approve'"
    class="mt-6"
  >
    <CpContentApprove />
  </div>
</template>

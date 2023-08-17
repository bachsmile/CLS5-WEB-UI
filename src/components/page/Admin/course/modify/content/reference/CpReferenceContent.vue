<script lang="ts" setup>
import { contentManagerStore } from '@/stores/admin/course/content'
import CmTableGroup from '@/components/common/CmTableGroup.vue'
import DateUtil from '@/utils/DateUtil'
import MethodsUtil from '@/utils/MethodsUtil'

const CpActionHeaderPage = defineAsyncComponent(() => import('@/components/page/gereral/CpActionHeaderPage.vue'))
const CpMdReferenceStock = defineAsyncComponent(() => import('@/components/page/Admin/course/modal/CpMdReferenceStock.vue'))
const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CmDropDown = defineAsyncComponent(() => import('@/components/common/CmDropDown.vue'))
const CpReferenceFile = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/reference/CpReferenceFile.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))

/** store */
/**
 * Store
 */
const storeContentManager = contentManagerStore()
const {
  viewModeRefer, contentRefer, callBackAction,
  itemsRefer, isShowDialogNotiDeleteRefer, disabledDeleteRefer,
  isShowModalAddRefStock, dataSelectRef,
} = storeToRefs(storeContentManager)
const {
  getListReferContentCourse, actionItemRefer,
  confirmDialogDeleteRefer, handleSearchRefer, selectedRowsRefer,
  deleteItemsRefer, handleAddRefContentStock,
} = storeContentManager
const groupOptions = {
  allowEmptySelect: false,
  collapsable: false,
  enabled: false,
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()
const courseId = Number(route.params.id)
const isViewDetail = computed(() => route.name === 'course-view')
const headers = computed(() => {
  if (route.name === 'course-view') {
    return [{ text: t('content'), value: 'name', key: true },
      { text: t('creator'), value: 'fullname', type: 'custom' },
      { text: t('create-day'), value: 'registerDate', type: 'custom' }]
  }
  return [
    { text: '', value: 'checkbox' },
    { text: t('content'), value: 'name', key: true },
    { text: t('creator'), value: 'fullname', type: 'custom' },
    { text: t('create-day'), value: 'registerDate', type: 'custom' },
    { text: '', value: 'actions', width: 150 },
  ]
})

const actionAdd = [
  {
    title: t('document-course'),
    icon: 'tabler:file',
    color: 'primary',
    action: () => {
      viewModeRefer.value = 'file'
    },
  },
  {
    title: t('LOG_ContentArchiveActionType'),
    icon: 'tabler:folder',
    color: 'warning',
    action: () => {
      isShowModalAddRefStock.value = true
    },
  },

]
function handleClickRow(e: any) {
  // console.log(e)
}

function onCancel() {
  router.replace({ name: 'course' })
}
function addSuccessFile() {
  getListReferContentCourse(courseId)
}

// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  switch (type) {
    case 'delete':
      deleteItemsRefer()
      break
    default:
      break
  }
}
onMounted(async () => {
  callBackAction.value = actionItemRefer
  if (courseId)
    await getListReferContentCourse(courseId)
})
onUnmounted(() => {
  viewModeRefer.value = 'view'
})
</script>

<template>
  <div
    v-if="viewModeRefer === 'view'"
    class="mt-6"
  >
    <div>
      <CpActionHeaderPage
        :title="t('list-reference')"
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
            <CmDropDown
              :title="t('add-content')"
              variant="tonal"
              color="primary"
              :list-item="actionAdd"
              :type="2"
              icon="tabler:chevron-down"
            />
          </div>
        </template>
      </CpActionHeaderPage>
    </div>
    <div>
      <CpHeaderAction
        :is-delete="!isViewDetail"
        :is-fillter="false"
        :disabled-delete="disabledDeleteRefer"
        @click="handleClickBtn"
        @update:keyword="handleSearchRefer"
      />
    </div>
    <div class="mb-6">
      <CmTableGroup
        key-check-parent-row="id"
        :value-check-parent-row="0"
        :group-options="groupOptions"
        :headers="headers"
        :items="itemsRefer"
        custom-id="courseContentId"
        disiable-pagination
        @handleClickRow="handleClickRow"
        @update:selected="selectedRowsRefer"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'fullname'">
            {{ MethodsUtil.formatFullName(context.firstName, context.lastName) }}
          </div>
          <div v-if="col === 'registerDate'">
            <span>{{ DateUtil.formatDateToDDMM(context.registerDate) }}</span>
          </div>
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

    <CpConfirmDialog
      v-model:is-dialog-visible="isShowDialogNotiDeleteRefer"
      :type="2"
      variant="outlined"
      :max-width="400"
      :confirmation-msg-sub-title="t('warning-delete-reference')"
      :confirmation-msg="t('delete-reference')"
      @confirm="confirmDialogDeleteRefer"
    />

    <CpMdReferenceStock
      v-model:is-show-modal="isShowModalAddRefStock"
      @saveChange="handleAddRefContentStock"
    />
  </div>
  <div
    v-else-if="viewModeRefer === 'file'"
    class="mt-6"
  >
    <CpReferenceFile
      :data="dataSelectRef"
      @cancel="viewModeRefer = 'view'"
      @addSuccess="addSuccessFile"
    />
  </div>
</template>

<script setup lang="ts">
import CourseService from '@/api/course/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { comboboxStore } from '@/stores/combobox'
import toast from '@/plugins/toast'

const props = withDefaults(defineProps<Props>(), ({
  disabledOk: false,
  excludeListId: [],
}))
const emit = defineEmits<Emit>()
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CpFilterCourseOrgStructTab = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/edit/course/CpFilterCourseOrgStructTab.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))

interface Props {
  isDialogVisible: boolean
  disabledOk: boolean
  excludeListId?: any
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

// Combobox chủ đề
const combobox = comboboxStore()
const { listTopicCourseCombobox } = storeToRefs(combobox)
const { getlistTopicCourseCombobox } = combobox

/** data */
const queryParams = reactive({
  excludeListId: props.excludeListId,
  topicCourseId: null,
  pageNumber: 1,
  pageSize: 10,
  keyword: null,
})
const dataComponent = reactive({
  totalRecord: 0,
  selectedRowsIds: [], // list id các row table được chọn
})
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-course'), value: 'name' },
  { text: t('topic'), value: 'topicCourseName' },
  { text: '', value: 'actions', width: 150 },
])
const items = ref ([])

const LABEL = Object.freeze({
  TITLE: t('add-user'),
  TITLE1: t('choose-titles'),
})
const isShowFilter = ref(true)

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
  queryParams.keyword = value
  getCourseAsignOrg()
}
async function changeTopic(value: any) {
  queryParams.topicCourseId = value
  queryParams.pageNumber = 1
  getCourseAsignOrg()
}
async function onCancel() {
  emit('update:isDialogVisible', false)
}
async function onConfirm() {
  if (props.disabledOk)
    return
  if (!dataComponent.selectedRowsIds?.length) {
    toast('WARNING', t('please-choose-at-least') + t('course').toLowerCase())
  }
  else {
    emit('update:disabledOk', true)
    emit('confirm', dataComponent.selectedRowsIds)
    emit('update:isDialogVisible', false)
  }
}
async function getCourseAsignOrg() {
  queryParams.excludeListId = props.excludeListId
  await MethodsUtil.requestApiCustom(CourseService.GetListCourseAdd, TYPE_REQUEST.GET, queryParams).then((value: any) => {
    if (value?.data?.pageLists !== null) {
      value.data.pageLists.forEach((element: any) => {
        const topic: any = listTopicCourseCombobox.value.find((topicItem: any) => topicItem.key === element.topicCourseId)

        if (topic)
          element.topicCourseName = topic.value
      })

      items.value = value?.data?.pageLists
      dataComponent.totalRecord = value?.data.totalRecord
    }
  })
}

watch(() => props.isDialogVisible, async (isShow: any) => {
  if (isShow) {
    if (!listTopicCourseCombobox.value?.length)
      await getlistTopicCourseCombobox()
    await getCourseAsignOrg()
  }
})
</script>

<template>
  <CmDialogs
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

    <div
      v-if="isShowFilter"
      class="filter-action"
    >
      <CpFilterCourseOrgStructTab @change-topic="changeTopic" />
    </div>
    <div>
      <CpHeaderAction
        is-fillter
        @click="handleClickBtn"
        @update:keyword="handleSearch"
      />
    </div>
    <div>
      <CmTable
        v-model:pageNumber="queryParams.pageNumber"
        v-model:pageSize="queryParams.pageSize"
        v-model:selected="dataComponent.selectedRowsIds"
        is-update-row-force
        :headers="headers"
        :items="items"
        :total-record="dataComponent.totalRecord"
        :type-pagination="2"
        return-object
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'name'">
            <CpCustomInfo
              :context="context"
            />
          </div>
        </template>
      </CmTable>
    </div>
  </CmDialogs>
</template>

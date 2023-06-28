<script setup lang="ts">
import toast from '@/plugins/toast'
import CpSearch from '@/components/page/gereral/CpSearch.vue'
import { comboboxStore } from '@/stores/combobox'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'

const props = withDefaults(defineProps<Props>(), {
  isShowModalAddCourse: false,
  excludeIds: [],
})

const emit = defineEmits<Emit>()

const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))

interface Props {
  isShowModalAddCourse: boolean
  excludeIds?: any
}
interface Emit {
  (e: 'update:isShowModalAddCourse', value: any): void
  (e: 'saveChange', value: any): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const combobox = comboboxStore()
const { listTopicCourseCombobox } = storeToRefs(combobox)
const { getlistTopicCourseCombobox } = combobox

/** state */
const LABEL = Object.freeze({
  TITLE: t('add-course'),
})
const data = reactive({
  deleteIds: [], // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})
const queryParams = ref({
  keyword: '',
  pageNumber: 1,
  pageSize: 10,
  excludeListId: [] as any,
})
const headers = ref([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-course'), value: 'name' },
  { text: t('topic'), value: 'topicCourseName' },
])
const items = ref()
const totalRecord = ref(0)

/** method */
async function onCancel() {
  emit('update:isShowModalAddCourse', false)
}
async function onConfirm() {
  if (data.selectedRowsIds.length === 0) {
    toast('WARNING', t('please-choose-at-least') + t('proficiency').toLowerCase())
    return
  }
  emit('saveChange', data.selectedRowsIds)

  nextTick(() => {
    emit('update:isShowModalAddCourse', false)
  })
}
async function getListCourse() {
  queryParams.value.excludeListId = props.excludeIds ? props.excludeIds : []
  await MethodsUtil.requestApiCustom(CourseService.GetListCourseAdd, TYPE_REQUEST.GET, queryParams.value).then(async (value: any) => {
    if (value.data) {
      if (!listTopicCourseCombobox.value?.length)
        await getlistTopicCourseCombobox()
      value.data.pageLists.forEach((element: any) => {
        const topic: any = listTopicCourseCombobox.value?.find((x: any) => x.key === element.topicCourseId)

        if (topic)
          element.topicCourseName = topic.value
      })
      items.value = value.data.pageLists
      totalRecord.value = value.data.totalRecord
    }
  })
}
async function handleSearch() {
  queryParams.value.pageNumber = 1
  getListCourse()
}

// chuyển trang
async function handlePageClick(page: any) {
  queryParams.value.pageNumber = page
  getListCourse()
}
function selectedRows(e: any) {
  data.selectedRowsIds = e
}

watch(() => props.isShowModalAddCourse, isShow => {
  if (isShow) {
    getListCourse()
  }
  else {
    queryParams.value.pageNumber = 1
    queryParams.value.pageSize = 10
    queryParams.value.keyword = ''
  }
})
</script>

<template>
  <div>
    <CmDialogs
      :title="LABEL.TITLE"
      :is-dialog-visible="isShowModalAddCourse"
      :button-ok-name="t('save')"
      close-on-back
      persistent
      @cancel="onCancel"
      @confirm="onConfirm"
    >
      <div class="d-flex justify-end mb-6">
        <div class="w-50">
          <CpSearch
            v-model:key-search="queryParams.keyword"
            @update:key-search="handleSearch"
          />
        </div>
      </div>
      <CmTable
        v-model:pageSize="queryParams.pageSize"
        :headers="headers"
        :items="items"
        :total-record="totalRecord"
        :page-number="queryParams.pageNumber"
        return-object
        :type-pagination="2"
        @handlePageClick="handlePageClick"
        @update:selected="selectedRows"
      />
    </CmDialogs>
  </div>
</template>

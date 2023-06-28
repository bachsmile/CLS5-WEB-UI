<script setup lang="ts">
import { conditionManagerStore } from '@/stores/admin/course/condition'

const CpActionHeaderPage = defineAsyncComponent(() => import('@/components/page/gereral/CpActionHeaderPage.vue'))
const CmMdAddCourseRequired = defineAsyncComponent(() => import('@/components/page/Admin/course/modal/CpMdAddCourseRequired.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()

/**
 * Store
 */
const storeConditionInforManager = conditionManagerStore()
const { disabledDeleteCourse, queryParamsCourse, itemsCourse, totalRecordCourse, isShowDialogNotiDeleteCourse } = storeToRefs(storeConditionInforManager)
const { deleteItemsCourse, handleSearchCourse, handlePageClickCourse, selectedRowsCourse, getCourseRequired, confirmDialogDeleteCourse, addCourse } = storeConditionInforManager

/** state */
const isShowModalAddCourse = ref(false)
const excludeIds = computed(() => {
  const listExclude = itemsCourse.value?.map((item: any) => item.courseId)
  return [...listExclude, Number(route.params.id)]
})
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('courseName'), value: 'courseName' },
  { text: t('topic'), value: 'topicCourseName' },
  { text: '', value: 'actions', width: 150 },
])

/** method */
/* ==> thực hiện các action được chọn ở header page CP */
function handlerActionHeader(type: any) {
  if (type === 'handlerAddButton')
    isShowModalAddCourse.value = true
}

// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  switch (type) {
    case 'delete':
      deleteItemsCourse()

      break

    default:
      break
  }
}
onMounted(async () => {
  await getCourseRequired()
})
</script>

<template>
  <div class="mt-6">
    <div>
      <CpActionHeaderPage
        :title="t('list-course')"
        :title-custom-add="t('add-course')"
        is-custom-add-btn
        @click="handlerActionHeader"
      />
    </div>
    <div>
      <CpHeaderAction
        is-delete
        :is-fillter="false"
        :disabled-delete="disabledDeleteCourse"
        @click="handleClickBtn"
        @search="handleSearchCourse"
      />
    </div>
    <div>
      <CmTable
        v-model:pageSize="queryParamsCourse.pageSize"
        v-model:page-number="queryParamsCourse.pageNumber"
        :headers="headers"
        :items="itemsCourse"
        custom-id="courseRequiredId"
        :total-record="totalRecordCourse"
        @handlePageClick="handlePageClickCourse"
        @update:selected="selectedRowsCourse"
      />
    </div>
    <div>
      <CmMdAddCourseRequired
        v-model:isShowModalAddCourse="isShowModalAddCourse"
        :exclude-ids="excludeIds"
        @saveChange="($event) => addCourse($event)"
      />
    </div>
    <CpConfirmDialog
      v-model:is-dialog-visible="isShowDialogNotiDeleteCourse"
      :type="2"
      variant="outlined"
      :confirmation-msg="t('Delete-course')"
      :confirmation-msg-sub-title="t('confirm-delete-course')"
      @confirm="confirmDialogDeleteCourse"
    />
  </div>
</template>

<script setup lang="ts">
import { courseInforManagerStore } from '@/stores/admin/course/infor'

const CpActionHeaderPage = defineAsyncComponent(() => import('@/components/page/gereral/CpActionHeaderPage.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpMdAsignTeacher = defineAsyncComponent(() => import('@/components/page/Admin/course/modal/CpMdAsignTeacher.vue'))
const CpCustomInfo = defineAsyncComponent(() => import('@/components/page/gereral/CpCustomInfo.vue'))
const CmRadio = defineAsyncComponent(() => import('@/components/common/CmRadio.vue'))
const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/**
 * Store
 */
const storeCourseInforManager = courseInforManagerStore()
const { disabledDelete, queryParams, totalRecord, courseData, getAuthor, isShowDialogNotiDelete, data, isOwner } = storeToRefs(storeCourseInforManager)
const { handleSearchTeacher, selectedRows, handlePageClick, addUser, confirmDialogDelete, deleteItems, addOrginAuthor, fetchAuthor } = storeCourseInforManager

/** state */
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('author-name'), value: 'fullname', type: 'custom' },
  { text: t('own-course'), value: 'isOwner', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
])
const isShowModalAddTeacher = ref(false)
const tableAddTeachers = ref()
const excludeIds = computed(() => {
  return courseData.value.authorList?.map((item: any) => item.id)
})

/** method */
/* ==> thực hiện các action được chọn ở header page CP */
function handlerActionHeader(type: any) {
  if (type === 'handlerAddButton')
    isShowModalAddTeacher.value = true
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
function selectedOwner(context: any) {
  courseData.value.authorList.forEach((item: any) => {
    item.isOwner = item.id === context.id
  })
}
watch(() => courseData.value?.id, (Val: any) => {
  if (courseData.value?.id && courseData.value?.id !== null)
    fetchAuthor()
  else
    addOrginAuthor()
}, { immediate: true, deep: true })
</script>

<template>
  <div>
    <div>
      <CpActionHeaderPage
        :title-custom-add="t('add-teacher')"
        :title="t('list-author')"
        is-custom-add-btn
        @click="handlerActionHeader"
      />
    </div>
    <div>
      <CpHeaderAction
        is-delete
        :is-fillter="false"
        :disabled-delete="disabledDelete"
        @click="handleClickBtn"
        @update:keyword="handleSearchTeacher"
      />
    </div>

    <div>
      <CmTable
        ref="tableAddTeachers"
        v-model:pageSize="queryParams.pageSize"
        :headers="headers"
        :items="getAuthor"
        :selected="data?.selectedRowsIds"
        is-update-row-force
        :total-record="totalRecord"
        :page-number="queryParams.pageNumber"
        @handlePageClick="handlePageClick"
        @update:selected="selectedRows"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'fullname'">
            <CpCustomInfo
              :context="context"
            />
          </div>
          <div v-if="col === 'isOwner'">
            <CmRadio
              v-model="isOwner"
              name="isOwner"
              :value="context.userId"
              @change="selectedOwner(context)"
            />
          </div>
        </template>
      </CmTable>
    </div>
    <CpMdAsignTeacher
      v-model:isShowModalAddTeacher="isShowModalAddTeacher"
      :exclude-ids="excludeIds"
      @saveChange="($event) => addUser($event)"
    />
    <CpConfirmDialog
      v-model:is-dialog-visible="isShowDialogNotiDelete"
      :type="2"
      variant="outlined"
      :confirmation-msg-sub-title="t('delete-author-warning')"
      :confirmation-msg="t('delete-author')"
      @confirm="confirmDialogDelete"
    />
  </div>
</template>

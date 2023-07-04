<script setup lang="ts">
import CpStudentRegFilter from './filter/CpStudentRegFilter.vue'
import { asignUserManagerStore } from '@/stores/admin/course/asignUser'
import CmCollapse from '@/components/common/CmCollapse.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { StatusUserAprove } from '@/constant/data/status.json'
import DateUtil from '@/utils/DateUtil'
import CmCheckBox from '@/components/common/CmCheckBox.vue'

const CpActionHeaderPage = defineAsyncComponent(() => import('@/components/page/gereral/CpActionHeaderPage.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpMdAsignTeacher = defineAsyncComponent(() => import('@/components/page/Admin/course/modal/CpMdAsignTeacher.vue'))
const CpCustomInfo = defineAsyncComponent(() => import('@/components/page/gereral/CpCustomInfo.vue'))
const CmChip = defineAsyncComponent(() => import('@/components/common/CmChip.vue'))
const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()

/**
 * Store
 */
// const storeCourseInforManager = courseInforManagerStore()
// const { disabledDelete, totalRecord, courseData, getAuthor, isOwner } = storeToRefs(storeCourseInforManager)
// const { handleSearchTeacher, selectedRows, handlePageClick, addUser, confirmDialogDelete, deleteItems, addOrginAuthor, fetchAuthor } = storeCourseInforManager

const storeAsignUserManager = asignUserManagerStore()
const { queryParamsUserReg, totalRecordUserReg, itemsUserReg, disabledUserRegBack, disabledUserRegApprove, disabledUserRegDelete, isShowDialogNotiDeleteUserReg } = storeToRefs(storeAsignUserManager)
const { getUserRegCourse, handleSearchUserReg, handlePageClickUserReg, handleFilterCombobox, postRegisterContactUser, exportExcelUserReg, confirmDialogDeleteUserReg, deleteItemsUserReg, handleApproveUserRegReject, selectedRowsUserReg } = storeAsignUserManager

/** state */
const option = ref([
  {
    id: 5,
    value: 'pending-approved',
  },
  {
    id: 3,
    value: 'approved',
  },
  {
    id: 6,
    value: 'rejected',
  },
])
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('user-name'), value: 'fullname', type: 'custom' },
  { text: t('email'), value: 'email' },
  { text: t('organizational'), value: 'orgName' },
  { text: t('career-titles'), value: 'titleName' },
  { text: t('phone-number'), value: 'phoneNumber' },
  { text: t('status'), value: 'statusId', type: 'custom' },
  { text: t('Register_Date'), value: 'registeredDate', type: 'custom' },
  { text: t('contact'), value: 'isContact', type: 'custom' },
  { text: '', value: 'actions', width: 100 },
])

const isShowModalAddTeacher = ref(false)
const isShowFilter = ref(true)
const tableAddTeachers = ref()

/** method */
/* ==> thực hiện các action được chọn ở header page CP */
// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  switch (type) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
      break
    case 'delete':
      deleteItemsUserReg()
      break
    case 'back':
      handleApproveUserRegReject('back')
      break

    case 'approve':
      handleApproveUserRegReject('approve')
      break
    default:
      break
  }
}
async function changeCellvalue(params: any, context: any) {
  itemsUserReg.value[context.originIndex].isContact = context?.isContact
  await postRegisterContactUser(context?.id)
}

onMounted(async () => {
  queryParamsUserReg.value.courseId = Number(route.params.id)
  await getUserRegCourse()
})
</script>

<template>
  <div>
    <div>
      <CpActionHeaderPage
        is-export-btn
        :title-custom-add="t('add-teacher')"
        :title="t('list-student-register')"
        @exportExcel="exportExcelUserReg"
      />
    </div>
    <CmCollapse :is-show="isShowFilter">
      <CpStudentRegFilter
        :data-filter="queryParamsUserReg"
        @update="($event: any) => handleFilterCombobox($event)"
      />
    </CmCollapse>
    <div>
      <CpHeaderAction
        is-delete
        is-back
        is-fillter
        is-approve
        :disabled-back="disabledUserRegBack"
        :disabled-approve="disabledUserRegApprove"
        :disabled-delete="disabledUserRegDelete"
        @click="handleClickBtn"
        @update:keyword="handleSearchUserReg"
      />
    </div>

    <div>
      <CmTable
        ref="tableAddTeachers"
        v-model:pageSize="queryParamsUserReg.pageSize"
        v-model:page-number="queryParamsUserReg.pageNumber"
        :headers="headers"
        :items="itemsUserReg"
        :total-record="totalRecordUserReg"
        @handlePageClick="handlePageClickUserReg"
        @update:selected="selectedRowsUserReg"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'fullname'">
            <CpCustomInfo
              :context="context"
            />
          </div>

          <div v-if="col === 'statusId'">
            <CmChip
              class="ma-2"
              :color="MethodsUtil.checkStatus(context.statusId, StatusUserAprove)?.color"
            >
              <VIcon
                start
                icon="carbon:dot-mark"
                size="12"
              />
              <span>{{ t(MethodsUtil.checkStatus(context.statusId, StatusUserAprove)?.name) }}</span>
            </CmChip>
          </div>
          <div v-if="col === 'registeredDate'">
            {{ DateUtil.formatDateToDDMM(context.registeredDate) }}
          </div>
          <div v-if="col === 'isContact'">
            <CmCheckBox
              v-model:model-value="context.isContact"
              @update:modelValue="changeCellvalue($event, context)"
            />
          </div>
        </template>
      </CmTable>
    </div>
    <CpConfirmDialog
      v-model:is-dialog-visible="isShowDialogNotiDeleteUserReg"
      :type="2"
      variant="outlined"
      :confirmation-msg-sub-title="t('confirm-delete-student')"
      :confirmation-msg="t('delete-student')"
      @confirm="confirmDialogDeleteUserReg"
    />
  </div>
</template>

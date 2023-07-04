<script setup lang="ts">
import { conditionManagerStore } from '@/stores/admin/course/condition'

const CpActionHeaderPage = defineAsyncComponent(() => import('@/components/page/gereral/CpActionHeaderPage.vue'))
const CpMdAddCapacity = defineAsyncComponent(() => import('@/components/page/Admin/course/modal/CpMdAddCapacity.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/** state */
const isShowModalAddCapacity = ref(false)
const excludeIds = computed(() => {
  // return courseData.value.authorList?.map((item: any) => item.id)
})
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('capacity-name'), value: 'proficiencyName' },
  { text: t('level'), value: 'proficiencyLevelName' },
  { text: '', value: 'actions', width: 150 },
])

/**
 * Store
 */
const storeConditionInforManager = conditionManagerStore()
const { disabledDeleteCapacity, queryParamsCapacity, itemsCapacity, totalRecordCapacity, isShowDialogNotiDeleteCapacity, callBackAction } = storeToRefs(storeConditionInforManager)
const { deleteItemsCapacity, handleSearchCapacity, handlePageClickCapacity, selectedRowsCapacity, getCapacityRequired, confirmDialogDeleteCapacity, addCapacity, actionItemCapacity } = storeConditionInforManager

/** method */
/* ==> thực hiện các action được chọn ở header page CP */
function handlerActionHeader(type: any) {
  if (type === 'handlerAddButton')
    isShowModalAddCapacity.value = true
}

// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  switch (type) {
    case 'delete':
      deleteItemsCapacity()

      break

    default:
      break
  }
}
onMounted(async () => {
  callBackAction.value = actionItemCapacity
  await getCapacityRequired()
})
</script>

<template>
  <div class="mt-6">
    <div>
      <CpActionHeaderPage
        :title-custom-add="t('add-capacity')"
        :title="t('capacity-list')"
        is-custom-add-btn
        @click="handlerActionHeader"
      />
    </div>
    <div>
      <CpHeaderAction
        is-delete
        :is-fillter="false"
        :disabled-delete="disabledDeleteCapacity"
        @click="handleClickBtn"
        @update:keyword="handleSearchCapacity"
      />
    </div>
    <div>
      <CmTable
        v-model:pageSize="queryParamsCapacity.pageSize"
        v-model:page-number="queryParamsCapacity.pageNumber"
        :headers="headers"
        :items="itemsCapacity"
        :total-record="totalRecordCapacity"
        @handlePageClick="handlePageClickCapacity"
        @update:selected="selectedRowsCapacity"
      />
    </div>
    <div>
      <CpMdAddCapacity
        v-model:isShowModalAddCapacity="isShowModalAddCapacity"
        :exclude-ids="excludeIds"
        @saveChange="($event) => addCapacity($event)"
      />
    </div>
    <CpConfirmDialog
      v-model:is-dialog-visible="isShowDialogNotiDeleteCapacity"
      :type="2"
      variant="outlined"
      :confirmation-msg="t('delete-proficiency')"
      :confirmation-msg-sub-title="t('confirm-delete-proficiency')"
      @confirm="confirmDialogDeleteCapacity"
    />
  </div>
</template>

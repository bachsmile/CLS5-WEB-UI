<script setup lang="ts">
import { courseManagerStore } from '@/stores/admin/course/course'
import { comboboxStore } from '@/stores/combobox'

const CpActionHeaderPage = defineAsyncComponent(() => import('@/components/page/gereral/CpActionHeaderPage.vue'))
const CmMdAddCost = defineAsyncComponent(() => import('@/components/page/Admin/course/modal/CpMdAddCost.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()

/**
 * Store
 */
const combobox = comboboxStore()
const { compoboxCostTypes } = storeToRefs(combobox)
const { categoryCostCombobox } = combobox

const storecourseManager = courseManagerStore()
const { disabledDeleteCost, queryParamsCost, itemsCost, totalRecordCost, isShowDialogNotiDeleteCost, courseData, isShowModalAddCost, callBackAction } = storeToRefs(storecourseManager)
const { deleteItemsCost, handleSearchCost, handlePageClickCost, selectedRowsCost, getCostRequired, confirmDialogDeleteCost, actionItemCost } = storecourseManager

/** state */
const excludeIds = computed(() => {
  const listExclude = itemsCost.value?.map((item: any) => item.courseId)
  return [...listExclude, Number(route.params.id)]
})
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('cost-name'), value: 'costName' },
  { text: t('cost-type'), value: 'costTypeName' },
  { text: t('money'), value: 'unitPrice' },
  { text: t('description'), value: 'description' },
  { text: '', value: 'actions', width: 150 },
])

/** method */
/* ==> thực hiện các action được chọn ở header page CP */
function handlerActionHeader(type: any) {
  if (type === 'handlerAddButton')
    isShowModalAddCost.value = true
}

// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  switch (type) {
    case 'delete':
      deleteItemsCost()

      break

    default:
      break
  }
}
onMounted(async () => {
  callBackAction.value = actionItemCost
  if (!compoboxCostTypes.value?.length)
    await categoryCostCombobox()
  await getCostRequired()
})
</script>

<template>
  <div class="mt-6">
    <div>
      <CpActionHeaderPage
        :title="t('list-cost')"
        :title-custom-add="t('add-cost')"
        is-custom-add-btn
        @click="handlerActionHeader"
      />
    </div>
    <div>
      <CpHeaderAction
        is-delete
        :is-fillter="false"
        :disabled-delete="disabledDeleteCost"
        @click="handleClickBtn"
        @update:keyword="handleSearchCost"
      />
    </div>
    <div>
      <CmTable
        v-model:pageSize="queryParamsCost.pageSize"
        v-model:page-number="queryParamsCost.pageNumber"
        :headers="headers"
        :items="itemsCost"
        :total-record="totalRecordCost"
        @handlePageClick="handlePageClickCost"
        @update:selected="selectedRowsCost"
      />
    </div>
    <div>
      <CmMdAddCost
        v-model:isShowModalAddCost="isShowModalAddCost"
        :exclude-ids="excludeIds"
        :course-id="courseData.id"
        @saveChange="getCostRequired"
      />
    </div>
    <CpConfirmDialog
      v-model:is-dialog-visible="isShowDialogNotiDeleteCost"
      :type="2"
      variant="outlined"
      :confirmation-msg="t('delete-cost')"
      :confirmation-msg-sub-title="t('confirm-delete-cost')"
      @confirm="confirmDialogDeleteCost"
    />
  </div>
</template>

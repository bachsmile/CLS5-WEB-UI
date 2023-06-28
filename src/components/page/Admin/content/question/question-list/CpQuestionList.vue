<script setup lang="ts">
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CpActionHeaderPage = defineAsyncComponent(() => import('@/components/page/gereral/CpActionHeaderPage.vue'))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()

/** data */
const dataComponent = reactive({
  totalRecord: 0,
  deleteIds: [] as any, // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})
const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  search: '',
})

/** computed */
const disabledDelete = computed(() => !dataComponent.selectedRowsIds.length)

/** method */
// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  // switch (type) {
  //   case 'fillter':
  //     isShowFilter.value = !isShowFilter.value
  //     break
  //   case 'delete':
  //     deleteItems()
  //     break

  //   default:
  //     break
  // }
}

// search ở fillter header
async function handleSearch(value: any) {
  queryParams.pageNumber = 1
  queryParams.search = value
}
function handlerActionHeader(type: any) {
  switch (type) {
    case 'handlerCustomButton':

      router.push({ name: 'question-add' })
      break

    default:
      break
  }
}
</script>

<template>
  <div>
    <CpActionHeaderPage
      :title-custom="t('browse-user')"
      :title="t('user-list')"
      is-update-btn
      is-export-btn
      is-custom-btn
      is-custom-group-btn
      @click="handlerActionHeader"
    />
    <!--
      :action-add="actionAdd"
      :action-update="actionUpdate"
      @exportExcel="exportExcel"
    -->
  </div>
  <div>
    <CpHeaderAction
      is-delete
      :disabled-delete="disabledDelete"
      is-fillter
      @click="handleClickBtn"
      @search="handleSearch"
    />
  </div>
</template>

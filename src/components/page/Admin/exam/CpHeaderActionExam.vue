<script lang="ts" setup>
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CpActionHeaderPage from '@/components/page/gereral/CpActionHeaderPage.vue'
import CmCollapse from '@/components/common/CmCollapse.vue'
import CmButton from '@/components/common/CmButton.vue'
import CmSelect from '@/components/common/CmSelect.vue'
import type { Any } from '@/typescript/interface'
import ComboboxService from '@/api/combobox'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

interface Props {
  pageNumber: number
  pageSize: number
  statusId: number | null
  fromDate: string
  toDate: string
  authorId: number | null
  searchData: string
  disabledDelete: boolean
  authorIds: number[]
}
const props = withDefaults(defineProps<Props>(), {
  pageNumber: 1,
  pageSize: 10,
  fromDate: '',
  authorId: null,
  toDate: '',
  searchData: '',
  statusId: null,
  disabledDelete: true,
  authorIds: () => ([]),
})
const emit = defineEmits<Emit>()
const { t } = window.i18n()
const isShowFilter = ref<boolean>(true)
interface Emit {
  (e: 'clickAdd'): void
  (e: 'clickApprove'): void
  (e: 'clickSupervision'): void
  (e: 'clickDelete'): void
  (e: 'update:toDate', data: unknown): void
  (e: 'update:fromDate', data: unknown): void
  (e: 'update:authorId', data: unknown): void
  (e: 'update:searchData', data: unknown): void
  (e: 'update:pageNumber', data: unknown): void
  (e: 'update:statusId', data: unknown): void
  (e: 'update:pageSize', data: unknown): void
}
function handleButton(val: string) {
  switch (val) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
      break
    case 'handlerAddButton':
      emit('clickAdd')
      break
    case 'supervision':
      emit('clickSupervision')
      break
    case 'approve':
      emit('clickApprove')
      break
    case 'delete':
      emit('clickDelete')
      break
    default:
      break
  }
}

const statusExam = ref<Any[]>([])
async function getUserCreate() {
  const { data } = await MethodsUtil.requestApiCustom(ComboboxService.GetComboboxStatusExam, TYPE_REQUEST.GET)
  data.forEach((element: Any) => {
    element.text = t(element.value)
  })
  statusExam.value = data
}
getUserCreate()
function handleUpdateStatus(val: number) {
  emit('update:statusId', val)
  updatePage()
}
function updatePage() {
  emit('update:pageNumber', 1)
  emit('update:pageSize', 10)
}
function handleSearch(val: string) {
  emit('update:searchData', val)
  updatePage()
}
</script>

<template>
  <div>
    <CpActionHeaderPage
      :title="t('exam-list')"
      is-custom-add-btn
      :title-custom-add="t('add-exam')"
      :title-custom="t('browse-exam')"
      @click="handleButton"
    >
      <template #actions>
        <CmButton
          :title="t('exam-supervision')"
          variant="tonal"
          @click="handleButton('supervision')"
        />
        <CmButton
          :title="t('browse-exam')"
          class="ml-2"
          color="success"
          @click="handleButton('approve')"
        />
      </template>
    </CpActionHeaderPage>
  </div>
  <CmCollapse :is-show="isShowFilter">
    <VRow>
      <VCol
        cols="12"
        lg="4"
      >
        <CmSelect :text="t('user-create')" />
      </VCol>
      <VCol
        cols="12"
        lg="4"
      >
        <CmSelect
          :model-value="statusId"
          :items="statusExam"
          :text="t('exam-status')"
          custom-key="text"
          item-value="key"
          @update:model-value="handleUpdateStatus"
        />
      </VCol>
      <VCol
        cols="12"
        lg="4"
      >
        <CmSelect :text="t('from-date-to-date')" />
      </VCol>
    </VRow>
  </CmCollapse>
  <div>
    <CpHeaderAction
      is-delete
      :disabled-delete="props.disabledDelete"
      :keyword="searchData"
      @click="handleButton"
      @update:keyword="handleSearch"
    />
  </div>
</template>

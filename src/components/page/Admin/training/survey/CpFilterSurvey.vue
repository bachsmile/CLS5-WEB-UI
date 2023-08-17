<script lang="ts" setup>
import CmSelect from '@/components/common/CmSelect.vue'
import CmDateTimePicker from '@/components/common/CmDateTimePicker.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import ComboboxService from '@/api/combobox'
import type { Any } from '@/typescript/interface'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

interface Props {
  authorId: number | null
  statusId: number | null
  fromDate: any
  toDate: any
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<Emit>()
const { t } = window.i18n()
interface Emit {
  (e: 'update:authorId', data: number | null): void
  (e: 'update:statusId', data: number | null): void
  (e: 'update:fromDate', data: any): void
  (e: 'update:toDate', data: any): void
  (e: 'update:pageSize', data: number): void
  (e: 'update:pageNumber', data: number): void
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

function updateDateNumberPage() {
  emit('update:pageNumber', 1)
  emit('update:pageSize', 10)
}

const listUserCreate = ref<Any[]>([])
</script>

<template>
  <VRow>
    <VCol
      lg="4"
      cols="12"
    >
      <CmSelect
        :text="t('user-create')"
        :items="listUserCreate"
      />
    </VCol>
    <VCol
      lg="4"
      cols="12"
    >
      <CmSelect
        :model-value="statusId"
        :text="t('status')"
        :items="statusExam"
        custom-key="value"
        item-value="key"
        @update:model-value="(val) => {
          emit('update:statusId', val)
          updateDateNumberPage()
        }"
      />
    </VCol>
    <VCol
      lg="4"
      cols="12"
    >
      <VRow>
        <VCol cols="6">
          <CmDateTimePicker
            :text="t('start-time')"
            :model-value="fromDate"
            @update:model-value="(val) => {
              emit('update:fromDate', val)
              updateDateNumberPage()
            }"
          />
        </VCol>
        <VCol cols="6">
          <CmDateTimePicker
            :text="t('end-time')"
            :model-value="toDate"
            @update:model-value="(val) => {
              emit('update:toDate', val)
              updateDateNumberPage()
            }"
          />
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>

<script lang="ts" setup>
import CmSelect from '@/components/common/CmSelect.vue'
import CmDateTimePicker from '@/components/common/CmDateTimePicker.vue'

const emit = defineEmits<Emit>()

const { t } = window.i18n()

interface Emit {
  (e: 'update:authorId', data: any): void
  (e: 'update:fromDate', data: any): void
  (e: 'update:toDate', data: any): void
  (e: 'update:pageNumber', data: any): void
  (e: 'update:pageSize', data: any): void
}
function updateAuthor(val: number | null) {
  emit('update:authorId', val)
  updatePage()
}
function updateFromDate(val: any) {
  emit('update:fromDate', val)
  updatePage()
}
function updateToDate(val: any) {
  emit('update:toDate', val)
  updatePage()
}
function updatePage() {
  emit('update:pageNumber', 1)
  emit('update:pageSize', 10)
}
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      lg="4"
    >
      <CmSelect
        :text="t('user-create')"
        @update:model-value="updateAuthor"
      />
    </VCol>
    <VCol
      cols="12"
      lg="4"
    >
      <CmDateTimePicker
        :text="t('start-time')"
        @update:model-value="updateFromDate"
      />
    </VCol>
    <VCol
      cols="12"
      lg="4"
    >
      <CmDateTimePicker
        :text="t('end-time')"
        @update:model-value="updateToDate"
      />
    </VCol>
  </VRow>
</template>

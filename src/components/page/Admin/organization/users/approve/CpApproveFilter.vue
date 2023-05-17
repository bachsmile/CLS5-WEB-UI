<script setup lang="ts">
const emit = defineEmits<Emit>()
const CmDateTimePicker = defineAsyncComponent(() => import('@/components/common/CmDateTimePicker.vue'))

/** ** Interface */
interface Emit {
  (e: 'update', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/** ** Khởi tạo store */

const LABEL = Object.freeze({
  FILLTER1: t('start-day'),
  FILLTER2: t('to-day'),
})

const formFilter = reactive({
  startDate: null,
  endDate: null,
})

// method

const change = (e: any) => {
  emit('update', formFilter)
}
</script>

<template>
  <VRow class="mb-3">
    <VCol
      cols="12"
      md="2"
      sm="4"
    >
      <CmDateTimePicker
        v-model="formFilter.startDate"
        :text="LABEL.FILLTER1"
        placeholder="dd/mm/yyyy"
        @update:model-value="change"
      />
    </VCol>
    <VCol
      cols="12"
      md="2"
      sm="4"
    >
      <CmDateTimePicker
        v-model="formFilter.endDate"
        :text="LABEL.FILLTER2"
        placeholder="dd/mm/yyyy"
        @update:model-value="change"
      />
    </VCol>
  </VRow>
</template>

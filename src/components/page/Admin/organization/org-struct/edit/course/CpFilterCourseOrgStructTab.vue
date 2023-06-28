<script setup lang="ts">
import { comboboxStore } from '@/stores/combobox'

const emit = defineEmits<Emit>()

const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
interface Emit {
  (e: 'changeTopic', value: any): void
}

/** data */
const formFilter = reactive({
  titltopicCourseIdeId: null,
})
const LABEL = Object.freeze({
  FILLTER1: t('topic'),
  PHD_FILLTER1: t('choose-topic'),
})

// Combobox chủ đề
const combobox = comboboxStore()
const { listTopicCourseCombobox } = storeToRefs(combobox)

/** method */
const changeAllTopic = (topicId: any) => {
  emit('changeTopic', topicId)
}
</script>

<template>
  <VRow class="mt-3">
    <VCol
      cols="12"
      md="6"
      sm="6"
    >
      <CmSelect
        v-model="formFilter.titltopicCourseIdeId"
        :items="listTopicCourseCombobox"
        item-value="key"
        custom-key="value"
        :text="LABEL.FILLTER1"
        :placeholder="LABEL.PHD_FILLTER1"
        @update:model-value="changeAllTopic"
      />
    </VCol>
  </VRow>
</template>


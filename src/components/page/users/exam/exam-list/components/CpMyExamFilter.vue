<script setup lang="ts">
import CpTopicSelect from '@/components/page/gereral/CpTopicSelect.vue'
import CmDateTimePicker from '@/components/common/CmDateTimePicker.vue'

const props = withDefaults(defineProps<Props>(), ({
  topicIds: () => ([]),
  startTime: null,
  endTime: null,
}))
const emit = defineEmits<Emit>()

/** ** Interface */
interface Emit {
  (e: string, value: any): void
  (e: 'update:pageSize', value: any): void
  (e: 'update:pageNumber', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

interface Props {
  topicIds: any[]
  startTime?: any
  endTime?: any
}
const topics = ref([])

watch(() => props.topicIds, (val: any) => {
  topics.value = val
})

const LABEL = Object.freeze({
  FILLTER1: t('start-time'),
  FILLTER2: t('end-time'),
})

// method

function change(key: any, value: any) {
  emit(`update:${key}`, value)
  emit('update:pageSize', 12)
  emit('update:pageNumber', 1)
}
</script>

<template>
  <div>
    <VRow class="mb-3">
      <VCol
        cols="12"
        md="4"
        sm="4"
      >
        <CpTopicSelect
          v-model:model-value="topics"
          multiple
          :type="3"
          :text="`${t('topic')}`"
          :is-show-add="false"
          :placeholder="t('topic')"
          @update:model-value="($event) => change('topicIds', $event)"
        />
      </VCol>
      <VCol
        cols="12"
        md="2"
        sm="4"
      >
        <CmDateTimePicker
          :model-value="startTime"
          :text="LABEL.FILLTER1"
          :placeholder="LABEL.FILLTER1"
          @update:model-value="($event) => change('startTime', $event)"
        />
      </VCol>
      <VCol
        cols="12"
        md="2"
        sm="4"
      >
        <CmDateTimePicker
          :model-value="endTime"
          :text="LABEL.FILLTER2"
          :placeholder="LABEL.FILLTER2"
          @update:model-value="($event) => change('endTime', $event)"
        />
      </VCol>
    </VRow>
  </div>
</template>

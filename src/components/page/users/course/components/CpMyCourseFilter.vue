<script setup lang="ts">
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import QuestionService from '@/api/question'
import type { Any } from '@/typescript/interface'
import CpTopicSelect from '@/components/page/gereral/CpTopicSelect.vue'

const props = withDefaults(defineProps<Props>(), ({
  topicIds: () => ([]),
  studyTypeId: null,
  sort: null,
  statusId: null,
  ownerId: null,
  isDisplayHome: null,
  dateFrom: null,
  dateTo: null,
}))
const emit = defineEmits<Emit>()
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))

/** ** Interface */
interface Emit {
  (e: 'update', value: any): void
  (e: 'update:topicIds', value: any): void
  (e: 'update:studyTypeId', value: any): void
  (e: 'update:sort', value: any): void
  (e: 'update:pageSize', value: any): void
  (e: 'update:pageNumber', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

interface Props {
  topicIds: any[]
  studyTypeId?: any
  sort?: any
}
const topics = ref([])

watch(() => props.topicIds, (val: any) => {
  topics.value = val
})

const LABEL = Object.freeze({
  FILLTER1: t('form-study'),
  FILLTER2: t('latest-course'),
})
const sortOption = [
  { key: t('latest-course'), value: '-date' },
  { key: t('oldest-course'), value: '*date' },
]
const studyTypes = [
  { key: 1, value: 'Online' },
  { key: 2, value: 'Offline' },
]

// method

function change(key: any, value: any) {
  switch (key) {
    case 'topicIds':
      emit('update:topicIds', value)
      break
    case 'studyTypeId':
      emit('update:studyTypeId', value)
      break
    case 'sort':
      emit('update:sort', value)
      break
    default:
      break
  }

  emit('update:pageSize', value)
  emit('update:pageNumber', value)
}

const questionLevel = ref()
function getComboboxQuestionLevel() {
  if (window._.isEmpty(questionLevel.value)) {
    MethodsUtil.requestApiCustom(QuestionService.GetComboboxQuestionLevel, TYPE_REQUEST.GET).then(({ data }: { data: Any[] }) => {
      questionLevel.value = data
    })
  }
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
          :type="2"
          :text="`${t('topic')}`"
          :is-show-add="false"
          :placeholder="t('topic')"
          @update:model-value="($event) => change('topicIds', $event)"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
        sm="4"
      >
        <CmSelect
          :model-value="studyTypeId"
          :items="studyTypes"
          item-value="key"
          custom-key="value"
          :text="LABEL.FILLTER1"
          :placeholder="LABEL.FILLTER1"
          @update:model-value="($event) => change('studyTypeId', $event)"
          @open="getComboboxQuestionLevel"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
        sm="4"
      >
        <CmSelect
          :model-value="sort"
          :items="sortOption"
          :text="LABEL.FILLTER2"
          :placeholder="LABEL.FILLTER2"
          @update:model-value="($event) => change('sort', $event)"
        />
      </VCol>
    </VRow>
  </div>
</template>

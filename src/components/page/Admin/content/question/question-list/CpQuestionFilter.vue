<script setup lang="ts">
import { comboboxStore } from '@/stores/combobox'
import { courseListManagerStore } from '@/stores/admin/course/courseList'
import CpTopicSelect from '@/components/page/gereral/CpTopicSelect.vue'

const props = withDefaults(defineProps<Props>(), ({
  topicId: () => ([]),
  level: null,
  sort: null,
  statusId: null,
  ownerId: null,
  isGroup: null,
  questionType: null,
  dateFrom: null,
  dateTo: null,
}))
const emit = defineEmits<Emit>()
const CmDateTimePicker = defineAsyncComponent(() => import('@/components/common/CmDateTimePicker.vue'))
const CmSelectTree = defineAsyncComponent(() => import('@/components/common/CmSelectTree.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const SkUser = defineAsyncComponent(() => import('@/components/page/gereral/skeleton/SkUser.vue'))

/** ** Interface */
interface Emit {
  (e: 'update', value: any): void
  (e: 'update:topicId', value: any): void
  (e: 'update:level', value: any): void
  (e: 'update:sort', value: any): void
  (e: 'update:statusId', value: any): void
  (e: 'update:ownerId', value: any): void
  (e: 'update:isGroup', value: any): void
  (e: 'update:questionType', value: any): void
  (e: 'update:dateFrom', value: any): void
  (e: 'update:dateTo', value: any): void
  (e: 'update:pageSize', value: any): void
  (e: 'update:pageNumber', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/** ** Khởi tạo store */
const storeCombobox = comboboxStore()
const { comboboxLevel, statusQuestionCombobox, comboboxTypeQuestion } = storeToRefs(storeCombobox)
const { getComboboxLevel, comboboxGroupQuestion, comboboxSortQuestion, getComboboxStatusQuestion, getComboboxTypeQuestion } = storeCombobox

const storeCourseListManager = courseListManagerStore()
const { vSelectOwner } = storeToRefs(storeCourseListManager)
const { isIntersecting, getTeacherOwnerCourse } = storeCourseListManager

interface Props {
  topicId: any[]
  level?: any
  sort?: any
  isGroup?: any
  statusId?: any
  questionType?: any
  ownerId?: any
  dateFrom?: any
  dateTo?: any
}
const LABEL = Object.freeze({
  FILLTER1: t('choose-topic'),
  FILLTER2: t('levels'),
  FILLTER3: t('question-format'),
  FILLTER4: t('user-create'),
  FILLTER5: t('question-type'),
  FILLTER6: t('status-name'),
  FILLTER7: t('start-day'),
  FILLTER8: t('to-day'),
  FILLTER9: t('sort-by'),
})

const formFilter = reactive({
  topicId: null,
  level: null,
  sort: '-modifiedDate',
  isGroup: null,
  statusId: null,
  ownerId: null,
  dateFrom: null,
  dateTo: null,
})

// method

function change(key: any, value: any) {
  switch (key) {
    case 'topicId':
      emit('update:topicId', value)
      break
    case 'level':
      emit('update:level', value)
      break
    case 'sort':
      emit('update:sort', value)
      break
    case 'isGroup':
      emit('update:isGroup', value)
      break
    case 'questionType':
      emit('update:questionType', value)
      break
    case 'statusId':
      emit('update:statusId', value)
      break
    case 'ownerId':
      emit('update:ownerId', value)
      break
    case 'dateFrom':
      emit('update:dateFrom', value)
      break
    case 'dateTo':
      emit('update:dateTo', value)
      break
    default:
      break
  }

  emit('update:pageSize', value)
  emit('update:pageNumber', value)
}
onMounted(() => {
  if (!comboboxLevel.value.length)
    getComboboxLevel()
})
onUnmounted(() => {
  comboboxLevel.value = []
})
</script>

<template>
  <VRow class="mb-3">
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CpTopicSelect
        :model-value="topicId"
        multiple
        :type="4"
        :text="`${t('topic')}`"
        :is-show-add="false"
        :placeholder="t('topic')"
        @update:model-value="($event) => change('topicId', $event)"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        :model-value="level"
        :items="comboboxLevel"
        item-value="key"
        custom-key="value"
        :text="LABEL.FILLTER2"
        :placeholder="LABEL.FILLTER2"
        @update:model-value="($event) => change('level', $event)"
        @open="getComboboxLevel"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        :model-value="isGroup"
        :items="comboboxGroupQuestion"
        item-value="key"
        custom-key="value"
        :text="LABEL.FILLTER3"
        :placeholder="LABEL.FILLTER3"
        @update:model-value="($event) => change('isGroup', $event)"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        :model-value="ownerId"
        :text="LABEL.FILLTER4"
        :placeholder="LABEL.FILLTER4"
        :items="vSelectOwner.listCombobox"
        is-infinity-scroll
        :total-record="vSelectOwner.totalRecord"
        item-value="id"
        custom-key="name"
        :append-to-body="false"
        @isIntersecting="isIntersecting"
        @update:model-value="($event) => change('ownerId', $event)"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        :model-value="questionType"
        :items="comboboxTypeQuestion"
        item-value="key"
        custom-key="value"
        :text="LABEL.FILLTER5"
        :placeholder="LABEL.FILLTER5"
        @update:model-value="($event) => change('questionType', $event)"
        @open="getComboboxTypeQuestion"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        :model-value="statusId"
        :text="LABEL.FILLTER6"
        :placeholder="LABEL.FILLTER6"
        :items="statusQuestionCombobox"
        item-value="key"
        custom-key="value"
        :append-to-body="false"
        @update:model-value="($event) => change('statusId', $event)"
        @open="getComboboxStatusQuestion"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        :model-value="sort"
        :text="LABEL.FILLTER9"
        :placeholder="LABEL.FILLTER9"
        :items="comboboxSortQuestion"
        item-value="key"
        custom-key="value"
        :append-to-body="false"
        @update:model-value="($event) => change('sort', $event)"
      />
    </VCol>
    <VCol
      cols="12"
      md="2"
      sm="4"
    >
      <CmDateTimePicker
        :model-value="dateFrom"
        :text="LABEL.FILLTER7"
        placeholder="dd/mm/yyyy"
        @update:model-value="($event) => change('dateFrom', $event)"
      />
    </VCol>
    <VCol
      cols="12"
      md="2"
      sm="4"
    >
      <CmDateTimePicker
        :model-value="dateTo"
        :text="LABEL.FILLTER8"
        placeholder="dd/mm/yyyy"
        @update:model-value="($event) => change('dateTo', $event)"
      />
    </VCol>
  </VRow>

  <div />
</template>

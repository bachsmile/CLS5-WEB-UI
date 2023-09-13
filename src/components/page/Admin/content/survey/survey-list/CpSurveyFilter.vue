<script setup lang="ts">
import { comboboxStore } from '@/stores/combobox'
import { courseListManagerStore } from '@/stores/admin/course/courseList'
import CpTopicSelect from '@/components/page/gereral/CpTopicSelect.vue'

const props = withDefaults(defineProps<Props>(), ({
  topicId: () => ([]),
  formOfStudy: null,
  sort: null,
  statusId: null,
  ownerId: null,
  isDisplayHome: null,
  dateFrom: null,
  dateTo: null,
}))
const emit = defineEmits<Emit>()
const CmDateTimePicker = defineAsyncComponent(() => import('@/components/common/CmDateTimePicker.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const SkUser = defineAsyncComponent(() => import('@/components/page/gereral/skeleton/SkUser.vue'))

/** ** Interface */
interface Emit {
  (e: 'update', value: any): void
  (e: 'update:topicId', value: any): void
  (e: 'update:questionType', value: any): void
  (e: 'update:statusId', value: any): void
  (e: 'update:ownerId', value: any): void
  (e: 'update:dateFrom', value: any): void
  (e: 'update:dateTo', value: any): void
  (e: 'update:pageSize', value: any): void
  (e: 'update:pageNumber', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/** ** Khởi tạo store */
const storeCombobox = comboboxStore()
const { surveyTypeCombobox, statusQuestionCombobox } = storeToRefs(storeCombobox)
const { getComboboxStatusQuestion, getComboboxSurveyType } = storeCombobox

const storeCourseListManager = courseListManagerStore()
const { vSelectOwner } = storeToRefs(storeCourseListManager)
const { isIntersecting, getTeacherOwnerCourse } = storeCourseListManager

interface Props {
  topicId: any[]
  formOfStudy?: any
  statusId?: any
  ownerId?: any
  dateFrom?: any
  dateTo?: any
  questionType?: any
}

const LABEL = Object.freeze({
  FILLTER1: t('choose-topic'),
  FILLTER2: t('user-create'),
  FILLTER3: t('question-type'),
  FILLTER4: t('status'),
  FILLTER5: t('course-status'),
  FILLTER6: t('own-course'),
  FILLTER7: t('start-day'),
  FILLTER8: t('to-day'),
})

// method

function change(key: any, value: any) {
  switch (key) {
    case 'topicId':
      emit('update:topicId', value)
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
    case 'questionType':
      emit('update:questionType', value)
      break
    default:
      break
  }

  emit('update:pageNumber', 1)
}

getTeacherOwnerCourse()

const userCreateCombobox = ref([])
function getStatusCombobox() {
  if (!statusQuestionCombobox.value?.length)
    getComboboxStatusQuestion()
}
function getSurveyTypeCombobox() {
  if (!surveyTypeCombobox.value?.length)
    getComboboxSurveyType()
}
if (props.statusId)
  getStatusCombobox()
if (props.questionType)
  getSurveyTypeCombobox()
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
        :model-value="ownerId"
        :items="userCreateCombobox"
        item-value="key"
        custom-key="value"
        :text="LABEL.FILLTER2"
        :placeholder="LABEL.FILLTER2"
        @update:model-value="($event) => change('formOfStudy', $event)"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        :model-value="questionType"
        :items="surveyTypeCombobox"
        item-value="key"
        custom-key="text"
        :text="LABEL.FILLTER3"
        :placeholder="LABEL.FILLTER3"
        @update:model-value="($event) => change('questionType', $event)"
        @open="getSurveyTypeCombobox"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        :model-value="statusId"
        :items="statusQuestionCombobox"
        item-value="key"
        custom-key="text"
        :text="LABEL.FILLTER4"
        :placeholder="LABEL.FILLTER4"
        @update:model-value="($event) => change('status', $event)"
        @open="getStatusCombobox"
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

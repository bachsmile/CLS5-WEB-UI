<script setup lang="ts">
import { comboboxStore } from '@/stores/combobox'
import { courseListManagerStore } from '@/stores/admin/course/courseList'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import QuestionService from '@/api/question'
import type { Any } from '@/typescript/interface'
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
const CmSelectTree = defineAsyncComponent(() => import('@/components/common/CmSelectTree.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const SkUser = defineAsyncComponent(() => import('@/components/page/gereral/skeleton/SkUser.vue'))

/** ** Interface */
interface Emit {
  (e: 'update', value: any): void
  (e: 'update:topicId', value: any): void
  (e: 'update:formOfStudy', value: any): void
  (e: 'update:sort', value: any): void
  (e: 'update:statusId', value: any): void
  (e: 'update:ownerId', value: any): void
  (e: 'update:isDisplayHome', value: any): void
  (e: 'update:dateFrom', value: any): void
  (e: 'update:dateTo', value: any): void
  (e: 'update:pageSize', value: any): void
  (e: 'update:pageNumber', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/** ** Khởi tạo store */
const storeCombobox = comboboxStore()
const { topicCombobox, formOfStudyCombobox, compoboxSortCourse, isDisplayHomeCombobox, compoboxStatusCourse } = storeToRefs(storeCombobox)
const { getComboboxTopic, getComboboxFormStudy, getComboboxStatusCourse } = storeCombobox

const storeCourseListManager = courseListManagerStore()
const { vSelectOwner } = storeToRefs(storeCourseListManager)
const { isIntersecting, getTeacherOwnerCourse } = storeCourseListManager

interface Props {
  topicId: any[]
  formOfStudy?: any
  sort?: any
  isDisplayHome?: any
  statusId?: any
  ownerId?: any
  dateFrom?: any
  dateTo?: any
}
const LABEL = Object.freeze({
  FILLTER1: t('choose-topic'),
  FILLTER2: t('form-study'),
  FILLTER3: t('filter-course'),
  FILLTER4: t('is-display-home'),
  FILLTER5: t('course-status'),
  FILLTER6: t('own-course'),
  FILLTER7: t('start-day'),
  FILLTER8: t('to-day'),
})

const formFilter = reactive({
  topicId: null,
  formOfStudy: null,
  sort: '-modifiedDate',
  isDisplayHome: null,
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
    case 'formOfStudy':
      emit('update:formOfStudy', value)
      break
    case 'sort':
      emit('update:sort', value)
      break
    case 'isDisplayHome':
      emit('update:isDisplayHome', value)
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

const questionLevel = ref()
function getComboboxQuestionLevel() {
  MethodsUtil.requestApiCustom(QuestionService.GetComboboxQuestionLevel, TYPE_REQUEST.GET).then(({ data }: { data: Any[] }) => {
    questionLevel.value = data
  })
}

if (formOfStudyCombobox.value)
  getComboboxFormStudy()
if (compoboxStatusCourse.value)
  getComboboxStatusCourse()
getTeacherOwnerCourse()

// created
onUnmounted(() => {
  topicCombobox.value = []
  formOfStudyCombobox.value = []
  compoboxStatusCourse.value = []
})
const topics = ref([])
if (topicCombobox.value)
  getComboboxTopic(2)
</script>

<template>
  <VRow class="mb-3">
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CpTopicSelect
        v-model:model-value="topics"
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
        :model-value="formOfStudy"
        :items="formOfStudyCombobox"
        item-value="key"
        custom-key="value"
        :text="LABEL.FILLTER2"
        :placeholder="LABEL.FILLTER2"
        @update:model-value="($event) => change('formOfStudy', $event)"
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
        :items="compoboxSortCourse"
        item-value="key"
        custom-key="value"
        :text="LABEL.FILLTER3"
        :placeholder="LABEL.FILLTER3"
        @update:model-value="($event) => change('sort', $event)"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        :model-value="isDisplayHome"
        :items="isDisplayHomeCombobox"
        item-value="value"
        custom-key="key"
        :text="LABEL.FILLTER4"
        :placeholder="LABEL.FILLTER4"
        @update:model-value="($event) => change('isDisplayHome', $event)"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        :model-value="statusId"
        :items="compoboxStatusCourse"
        item-value="key"
        custom-key="value"
        :text="LABEL.FILLTER5"
        :placeholder="LABEL.FILLTER5"
        @update:model-value="($event) => change('statusId', $event)"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        :model-value="ownerId"
        :text="LABEL.FILLTER6"
        :placeholder="LABEL.FILLTER6"
        :items="vSelectOwner.listCombobox"
        is-infinity-scroll
        :total-record="vSelectOwner.totalRecord"
        item-value="id"
        custom-key="name"
        :append-to-body="false"
        @isIntersecting="isIntersecting"
        @update:model-value="($event) => change('ownerId', $event)"
      >
        <template #infinityItem>
          <SkUser
            :number="2"
          />
        </template>
      </CmSelect>
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

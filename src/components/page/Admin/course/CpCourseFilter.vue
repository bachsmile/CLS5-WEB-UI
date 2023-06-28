<script setup lang="ts">
import { comboboxStore } from '@/stores/combobox'
import { courseListManagerStore } from '@/stores/admin/course/courseList'

const props = withDefaults(defineProps<Props>(), ({
  dataFilter: null,
}))
const emit = defineEmits<Emit>()
const CmDateTimePicker = defineAsyncComponent(() => import('@/components/common/CmDateTimePicker.vue'))
const CmSelectTree = defineAsyncComponent(() => import('@/components/common/CmSelectTree.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const SkUser = defineAsyncComponent(() => import('@/components/page/gereral/skeleton/SkUser.vue'))

/** ** Interface */
interface Emit {
  (e: 'update', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/** ** Khởi tạo store */
const storeCombobox = comboboxStore()
const { topicCombobox, formOfStudyCombobox, compoboxSortCourse, isDisplayHome, compoboxStatusCourse } = storeToRefs(storeCombobox)
const { getComboboxTopic, getComboboxFormStudy, getComboboxStatusCourse } = storeCombobox

const storeCourseListManager = courseListManagerStore()
const { vSelectOwner } = storeToRefs(storeCourseListManager)
const { isIntersecting, getTeacherOwnerCourse } = storeCourseListManager

interface Props {
  dataFilter: any
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

let formFilter = reactive({
  topicIds: null,
  formOfStudy: null,
  sort: '-modifiedDate',
  isDisplayHome: null,
  statusId: null,
  ownerId: null,
  dateFrom: null,
  dateTo: null,
})

// method

function change() {
  emit('update', formFilter)
}

if (topicCombobox.value)
  getComboboxTopic(2)
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
watch(() => props.dataFilter, val => {
  formFilter = {
    ...formFilter,
    ...val,
  }
}, { deep: true, immediate: true })
</script>

<template>
  <VRow class="mb-3">
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelectTree
        v-model:model-value="formFilter.topicIds"
        multiple
        value-format="id"
        :text="LABEL.FILLTER1"
        :options="topicCombobox"
        :normalizer-custom-type="['id', 'name', 'children']"
        :placeholder="LABEL.FILLTER1"
        @update:model-value="change"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        v-model="formFilter.formOfStudy"
        :items="formOfStudyCombobox"
        item-value="key"
        custom-key="value"
        :text="LABEL.FILLTER2"
        :placeholder="LABEL.FILLTER2"
        @update:model-value="change"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        v-model="formFilter.sort"
        :items="compoboxSortCourse"
        item-value="key"
        custom-key="value"
        :text="LABEL.FILLTER3"
        :placeholder="LABEL.FILLTER3"
        @update:model-value="change"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        v-model="formFilter.isDisplayHome"
        :items="isDisplayHome"
        item-value="value"
        custom-key="key"
        :text="LABEL.FILLTER4"
        :placeholder="LABEL.FILLTER4"
        @update:model-value="change"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        v-model="formFilter.statusId"
        :items="compoboxStatusCourse"
        item-value="key"
        custom-key="value"
        :text="LABEL.FILLTER5"
        :placeholder="LABEL.FILLTER5"
        @update:model-value="change"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        v-model="formFilter.ownerId"
        :text="LABEL.FILLTER6"
        :placeholder="LABEL.FILLTER6"
        :items="vSelectOwner.listCombobox"
        is-infinity-scroll
        :total-record="vSelectOwner.totalRecord"
        item-value="id"
        custom-key="name"
        :append-to-body="false"
        @isIntersecting="isIntersecting"
        @update:model-value="change"
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
        :model-value="formFilter.dateFrom"
        :text="LABEL.FILLTER7"
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
        :model-value="formFilter.dateTo"
        :text="LABEL.FILLTER8"
        placeholder="dd/mm/yyyy"
        @update:model-value="change"
      />
    </VCol>
  </VRow>
</template>

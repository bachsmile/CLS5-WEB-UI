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
const { topicCombobox, formOfStudyCombobox, compoboxSortCourse, isDisplayHomeCombobox, compoboxStatusCourse } = storeToRefs(storeCombobox)
const { getComboboxTopic, getComboboxFormStudy, getComboboxStatusCourse } = storeCombobox

const storeCourseListManager = courseListManagerStore()
const { vSelectOwner } = storeToRefs(storeCourseListManager)
const { isIntersecting, getTeacherOwnerCourse } = storeCourseListManager

interface Props {
  dataFilter: any
}

const option = ref([
  {
    key: 'pending-approved',
    value: 5,
  },
  {
    key: 'approved',
    value: 3,
  },
  {
    key: 'rejected',
    value: 6,
  },
])
const LABEL = Object.freeze({
  FILLTER1: t('status'),
  FILLTER2: t('start-day'),
  FILLTER3: t('to-day'),
})

let formFilter = reactive({
  status: null,
  fromDate: null,
  toDate: null,
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
      <CmSelect
        v-model="formFilter.status"
        :items="option"
        item-value="value"
        custom-key="key"
        :text="LABEL.FILLTER1"
        :placeholder="LABEL.FILLTER1"
        @update:model-value="change"
      />
    </VCol>
    <VCol
      cols="12"
      md="2"
      sm="4"
    >
      <CmDateTimePicker
        :model-value="formFilter.fromDate"
        :text="LABEL.FILLTER2"
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
        :model-value="formFilter.toDate"
        :text="LABEL.FILLTER3"
        placeholder="dd/mm/yyyy"
        @update:model-value="change"
      />
    </VCol>
  </VRow>
</template>

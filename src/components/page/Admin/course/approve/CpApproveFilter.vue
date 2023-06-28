<script setup lang="ts">
import { comboboxStore } from '@/stores/combobox'

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
const { authorIdCombobox } = storeToRefs(storeCombobox)
const { getAuthorIdCombobox } = storeCombobox

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

// method

if (authorIdCombobox.value)
  getAuthorIdCombobox()

// created
onUnmounted(() => {
  authorIdCombobox.value = []
})

////
let formFilter = reactive({
  authorId: undefined,
  fromDate: null,
  toDate: null,
})

function change() {
  emit('update', formFilter)
}
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
        v-model="formFilter.authorId"
        :items="authorIdCombobox"
        item-value="id"
        custom-key="fullName"
        :text="LABEL.FILLTER2"
        :placeholder="LABEL.FILLTER2"
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
        :model-value="formFilter.toDate"
        :text="LABEL.FILLTER8"
        placeholder="dd/mm/yyyy"
        @update:model-value="change"
      />
    </VCol>
  </VRow>
</template>

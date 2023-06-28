<script setup lang="ts">
import { comboboxStore } from '@/stores/combobox'

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
const { getAuthorIdCombobox, getComboboxTypeContent } = storeCombobox

const LABEL = Object.freeze({
  FILLTER1: t('author-name'),
  FILLTER2: t('content-type'),
})
const comboboxContent = ref([])

// method

if (authorIdCombobox.value)
  getAuthorIdCombobox()

// created
onMounted(() => {
  getComboboxTypeContent().then((value: any) => {
    comboboxContent.value = value.data
  })
})
onUnmounted(() => {
  authorIdCombobox.value = []
})

////
const formFilter = reactive({
  authorId: undefined,
  contentArchiveTypeId: undefined,
})

function change() {
  emit('update', formFilter)
}
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
        :text="LABEL.FILLTER1"
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
        v-model="formFilter.contentArchiveTypeId"
        :items="comboboxContent"
        item-value="key"
        custom-key="value"
        :text="LABEL.FILLTER2"
        :placeholder="LABEL.FILLTER2"
        @update:model-value="change"
      />
    </VCol>
  </VRow>
</template>

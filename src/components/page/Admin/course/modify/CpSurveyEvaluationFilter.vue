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
const { comboboxAuthor } = storeToRefs(storeCombobox)
const { getComboboxAuthor } = storeCombobox

interface Props {
  dataFilter: any
}

const LABEL = Object.freeze({
  FILLTER1: t('creator'),
})

let formFilter = reactive({
  authorId: null,
})

// method

function change() {
  emit('update', formFilter)
}

if (comboboxAuthor.value)
  getComboboxAuthor()

// created
onUnmounted(() => {
  comboboxAuthor.value = []
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
        v-model="formFilter.authorId"
        :items="comboboxAuthor"
        item-value="id"
        custom-key="fullName"
        :text="LABEL.FILLTER1"
        :placeholder="LABEL.FILLTER1"
        @update:model-value="change"
      />
    </VCol>
  </VRow>
</template>

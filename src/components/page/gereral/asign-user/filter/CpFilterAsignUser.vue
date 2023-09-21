<script setup lang="ts">
import { comboboxStore } from '@/stores/combobox'
import CpOrganizationSelect from '@/components/page/gereral/CpOrganizationSelect.vue'
import CmSelect from '@/components/common/CmSelect.vue'

const props = withDefaults(defineProps<Props>(), ({
  orStructure: () => ([]),
  groupUser: () => ([]),
  categoryTitleId: () => ([]),
  titles: () => ([]),
  sm: 4,
}))
const emit = defineEmits<Emit>()

/** ** Interface */
interface Emit {
  (e: 'update', value: any): void
  (e: 'update:orStructure', value: any): void
  (e: 'update:groupUser', value: any): void
  (e: 'update:categoryTitleId', value: any): void
  (e: 'update:titles', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/** ** Khởi tạo store */
const storeCombobox = comboboxStore()
const { groupUserCombobox, categoryTitleCombobox, listDistrictCombobox } = storeToRefs(storeCombobox)
const { fetchGroupUserCombobox, fetchCategoryTitleCombobox, getComboboxListDistrict } = storeCombobox

interface Props {
  orStructure?: any[]
  groupUser?: any[]
  categoryTitleId?: any[]
  titles?: any[]
  sm?: number
}
const LABEL = Object.freeze({
  FILLTER1: t('orgStruct'),
  FILLTER2: t('group-management'),
  FILLTER3: t('list-title'),
  FILLTER4: t('title-position'),
})

const formFilter = reactive({
  orStructure: [],
  groupUser: [],
  categoryTitleId: [],
  titles: [],
})

// method

function change(key: any, value: any) {
  switch (key) {
    case 'orStructure':
      emit('update:orStructure', value)
      break
    case 'groupUser':
      emit('update:groupUser', value)
      break
    case 'categoryTitleId':
      emit('update:categoryTitleId', value)
      break
    case 'titles':
      emit('update:titles', value)
      break
    default:
      break
  }
}
</script>

<template>
  <VRow class="mb-3">
    <VCol
      cols="12"
      :sm="sm"
    >
      <CpOrganizationSelect
        v-model="formFilter.orStructure"
        :is-render="false"
        multiple
        :text="LABEL.FILLTER1"
        :placeholder="LABEL.FILLTER1"
        @update:model-value="($event) => change('orStructure', $event)"
      />
    </VCol>
    <VCol
      cols="12"
      :sm="sm"
    >
      <CmSelect
        v-model="formFilter.groupUser"
        :items="groupUserCombobox"
        :text="LABEL.FILLTER2"
        :placeholder="LABEL.FILLTER2"
        item-value="id"
        multiple
        custom-key="name"
        @update:model-value="($event) => change('groupUser', $event)"
        @open="fetchGroupUserCombobox"
      />
    </VCol>
    <VCol
      cols="12"
      :sm="sm"
    >
      <CmSelect
        v-model="formFilter.categoryTitleId"
        multiple
        :items="categoryTitleCombobox"
        custom-key="value"
        item-value="key"
        :text="LABEL.FILLTER3"
        :placeholder="LABEL.FILLTER3"
        @update:model-value="($event) => change('categoryTitleId', $event)"
        @open="fetchCategoryTitleCombobox"
      />
    </VCol>

    <VCol
      cols="12"
      :sm="sm"
    >
      <CmSelect
        v-model="formFilter.titles"
        :items="listDistrictCombobox"
        multiple
        item-value="key"
        custom-key="value"
        :text="LABEL.FILLTER4"
        :placeholder="LABEL.FILLTER4"
        @update:model-value="($event) => change('titles', $event)"
        @open="getComboboxListDistrict"
      />
    </VCol>
  </VRow>

  <div />
</template>

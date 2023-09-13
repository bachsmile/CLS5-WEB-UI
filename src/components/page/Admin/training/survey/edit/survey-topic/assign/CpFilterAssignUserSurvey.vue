<script lang="ts" setup>
import CpOrganizationSelect from '@/components/page/gereral/CpOrganizationSelect.vue'
import CmSelect from '@/components/common/CmSelect.vue'
import { comboboxStore } from '@/stores/combobox'

const props = withDefaults(defineProps<Props>(), {

})

const emit = defineEmits<Emit>()

const { t } = window.i18n()

const store = comboboxStore()
const { organizationsCombobox, categoryTitleCombobox, groupUserCombobox, listDistrictCombobox } = storeToRefs(store)

const { fetchTOrgStructCombobox, fetchCategoryTitleCombobox, fetchGroupUserCombobox, getComboboxListDistrict } = store
interface Props {
  categoryTitleId: number[]
  groupUser: number[]
  orStructure: number[]
  titles: any[]
}

interface Emit {
  (e: 'update:pageNumber', data: number): void
  (e: 'update:pageSize', data: number): void
  (e: 'update:categoryTitleId', data: any[]): void
  (e: 'update:titles', data: any[]): void
  (e: 'update:orStructure', data: any[]): void
  (e: 'update:groupUser', data: any[]): void
}
if (window._.isEmpty(organizationsCombobox.value))
  fetchTOrgStructCombobox()
if (window._.isEmpty(categoryTitleCombobox.value))
  fetchCategoryTitleCombobox()
if (window._.isEmpty(groupUserCombobox.value))
  fetchGroupUserCombobox()
if (window._.isEmpty(listDistrictCombobox.value))
  getComboboxListDistrict()

function updatePage() {
  emit('update:pageSize', 10)
  emit('update:pageNumber', 1)
}
function updateCategoryTitleId(val: any[]) {
  emit('update:categoryTitleId', val)
  updatePage()
}
function updateTitles(val: any[]) {
  emit('update:titles', val)
  updatePage()
}
function updateOrStructure(val: any[]) {
  emit('update:orStructure', val)
  updatePage()
}
function updateGroupUser(val: any[]) {
  emit('update:groupUser', val)
  updatePage()
}

const organizationalStructureId = ref<any>(null)
watch(() => props.orStructure, val => {
  organizationalStructureId.value = val
}, { immediate: true })
const listTitle = ref<any[] | null>(null)
watch(() => props.titles, val => {
  listTitle.value = val
}, { immediate: true })
const groupId = ref<any>(null)
watch(() => props.groupUser, val => {
  groupId.value = val
}, { immediate: true })
const categories = ref<number[] | null>(null)
watch(() => props.categoryTitleId, val => {
  categories.value = val
}, { immediate: true })
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      lg="4"
    >
      <CpOrganizationSelect
        v-model="organizationalStructureId"
        multiple
        :text="t('organizational-structure-management')"
        :placeholder="t('organizational-structure-management')"
        @update:model-value="updateOrStructure"
      />
    </VCol>

    <VCol
      cols="12"
      lg="4"
    >
      <CmSelect
        v-model="groupId"
        multiple
        :items="groupUserCombobox"
        custom-key="name"
        item-value="id"
        :text="t('user-group')"
        :placeholder="t('user-group')"
        @update:model-value="updateGroupUser"
      />
    </VCol>

    <VCol
      cols="12"
      lg="4"
    >
      <CmSelect
        v-model="categories"
        multiple
        :items="categoryTitleCombobox"
        custom-key="value"
        item-value="key"
        :text="t('list-title')"
        :placeholder="t('list-title')"
        @update:model-value="updateCategoryTitleId"
      />
    </VCol>
    <VCol
      cols="12"
      lg="4"
    >
      <CmSelect
        v-model="listTitle"
        multiple
        :items="listDistrictCombobox"
        :text="t('title-position')"
        :placeholder="t('title-position')"
        @update:model-value="updateTitles"
      />
    </VCol>
  </VRow>
</template>

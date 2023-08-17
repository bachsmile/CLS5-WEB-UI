<script lang="ts" setup>
import CpOrganizationSelect from '@/components/page/gereral/CpOrganizationSelect.vue'
import CmSelect from '@/components/common/CmSelect.vue'
import { comboboxStore } from '@/stores/combobox'
import type { Params } from '@/typescript/interface/params'

const props = withDefaults(defineProps<Props>(), {
  queryParams: null,
})

const emit = defineEmits<Emit>()

const { t } = window.i18n()

const store = comboboxStore()
const { organizationsCombobox, categoryTitleCombobox, groupUserCombobox, listDistrictCombobox } = storeToRefs(store)

const { fetchTOrgStructCombobox, fetchCategoryTitleCombobox, fetchGroupUserCombobox, getComboboxListDistrict } = store
interface Props {
  queryParams: QueryParams | null
}
interface QueryParams extends Params {
  UserIds: number[]
  categoryTitleId: number[]
  examId: number
  groupUser: number[]
  orStructure: number[]
  searchKey: string
  testId: number
  titles: any[]
  typeId: number
}
interface Emit {
  (e: 'update:queryParams', data: QueryParams): void
}
const params = ref<QueryParams>({
  UserIds: [],
  categoryTitleId: [],
  examId: 0,
  groupUser: [],
  orStructure: [],
  searchKey: '',
  testId: 0,
  titles: [],
  typeId: 0,
  pageNumber: 1,
  pageSize: 10,
})
watch(() => props.queryParams, (val: QueryParams) => {
  params.value = val
})

if (window._.isEmpty(organizationsCombobox.value))
  fetchTOrgStructCombobox()
if (window._.isEmpty(categoryTitleCombobox.value))
  fetchCategoryTitleCombobox()
if (window._.isEmpty(groupUserCombobox.value))
  fetchGroupUserCombobox()
if (window._.isEmpty(listDistrictCombobox.value))
  getComboboxListDistrict()

function updateData() {
  emit('update:queryParams', params.value)
}
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      lg="4"
    >
      <CpOrganizationSelect
        v-model="params.orStructure"
        multiple
        :text="t('organizational-structure-management')"
        :placeholder="t('organizational-structure-management')"
        @update:model-value="updateData"
      />
    </VCol>
    <VCol
      cols="12"
      lg="4"
    >
      <CmSelect
        v-model="params.groupUser"
        multiple
        :text="t('user-group')"
        :placeholder="t('user-group')"
        @update:model-value="updateData"
      />
    </VCol>
    <VCol
      cols="12"
      lg="4"
    >
      <CmSelect
        v-model="params.categoryTitleId"
        multiple
        :items="categoryTitleCombobox"
        custom-key="value"
        item-value="key"
        :text="t('list-title')"
        :placeholder="t('list-title')"
        @update:model-value="updateData"
      />
    </VCol>
    <VCol
      cols="12"
      lg="4"
    >
      <CmSelect
        v-model="params.titles"
        multiple
        :items="listDistrictCombobox"
        :text="t('title-position')"
        :placeholder="t('title-position')"
        @update:model-value="updateData"
      />
    </VCol>
  </VRow>
</template>

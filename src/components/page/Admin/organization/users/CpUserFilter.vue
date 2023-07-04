<script setup lang="ts">
import CmSelect from '@/components/common/CmSelect.vue'
import CpOrganizationSelect from '@/components/page/gereral/CpOrganizationSelect.vue'
import { comboboxStore } from '@/stores/combobox'

const emit = defineEmits<Emit>()
const CmDateTimePicker = defineAsyncComponent(() => import('@/components/common/CmDateTimePicker.vue'))

/** ** Interface */
interface Emit {
  (e: 'update', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/** ** Khởi tạo store */
const store = comboboxStore()
const { statusesCombobox, organizationsCombobox, userTypeCombobox, groupUserCombobox, addFromCombobox } = storeToRefs(store)

const { fetchStatusUsersCombobox, fetchTypeUsersCombobox, fetchTOrgStructCombobox, fetchGroupUserCombobox } = store

const LABEL = Object.freeze({
  FILLTER1: t('status-action'),
  FILLTER2: t('orgStruct'),
  FILLTER3: t('role-user'),
  FILLTER4: t('from-date-to-date'),
  FILLTER6: t('add-user-from'),
  FILLTER7: t('group-management'),
  FILLTER8: t('add-user-from'),
})

const formFilter = reactive({
  statusList: null,
  orStructure: null,
  userTypeList: null,
  groupUser: null,
  timeFrom: new Date('2022/06/22'),
  timeTo: new Date('2023/06/22'),
  modeAdd: null,
})

// method

function change(val: any) {
  console.log(formFilter)

  emit('update', formFilter)
}

// created

if (window._.isEmpty(statusesCombobox.value))
  fetchStatusUsersCombobox()
if (window._.isEmpty(userTypeCombobox.value))
  fetchTypeUsersCombobox()
if (window._.isEmpty(organizationsCombobox.value))
  fetchTOrgStructCombobox()
if (window._.isEmpty(groupUserCombobox.value))
  fetchGroupUserCombobox()

console.log(formFilter)
</script>

<template>
  <VRow class="mb-3">
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        v-model="formFilter.statusList"
        :items="statusesCombobox"
        multiple
        item-value="key"
        custom-key="value"
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
      <CpOrganizationSelect
        v-model="formFilter.orStructure"
        multiple
        :text="LABEL.FILLTER2"
        :placeholder="LABEL.FILLTER2"
        @update:modelValue="change"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        v-model="formFilter.groupUser"
        :items="groupUserCombobox"
        :text="LABEL.FILLTER7"
        item-value="id"
        multiple
        custom-key="name"
        :placeholder="LABEL.FILLTER7"
        @update:model-value="change"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        v-model="formFilter.userTypeList"
        :items="userTypeCombobox"
        :text="LABEL.FILLTER3"
        item-value="id"
        multiple
        custom-key="userTypeName"
        :placeholder="LABEL.FILLTER3"
        @update:model-value="change"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmDateTimePicker
        v-model:from-date="formFilter.timeFrom"
        v-model:to-date="formFilter.timeTo"
        :text="LABEL.FILLTER4"
        range
        multi-calendars
        placeholder="dd/mm/yyyy - dd/mm/yyyy"
        @update:model-value="change"
      />
    </VCol>
    <!--
      <VCol
      cols="12"
      md="2"
      sm="4"
      >
      <CmDateTimePicker
      :model-value="formFilter.timeTo"
      :text="LABEL.FILLTER5"
      placeholder="dd/mm/yyyy"
      @update:model-value="change"
      />
      </VCol>
    -->
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        v-model="formFilter.modeAdd"
        :items="addFromCombobox"
        :text="LABEL.FILLTER8"
        :placeholder="LABEL.FILLTER8"
        @update:model-value="change"
      />
    </VCol>
  </VRow>
</template>

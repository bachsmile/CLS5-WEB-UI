<script setup lang="ts">
import CmSelect from '@/components/common/CmSelect.vue'
import CpOrganizationSelect from '@/components/page/gereral/CpOrganizationSelect.vue'
import { comboboxStore } from '@/stores/combobox'

/** ** Interface */
interface Emit {
  (e: 'update', value: any): void
}
const emit = defineEmits<Emit>()
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/** ** Khởi tạo store */
const store = comboboxStore()
const { statuses, organizations, userType, groupUser } = storeToRefs(store)

const { fetchStatusUsersCombobox, fetchTypeUsersCombobox, fetchTOrgStructCombobox, fetchGroupUserCombobox } = store

const LABEL = Object.freeze({
  FILLTER1: 'Tình trạng hoạt động',
  FILLTER2: 'Cơ cấu tổ chức',
  FILLTER3: 'Vai trò người dùng',
  FILLTER4: 'Từ ngày đến ngày',
  FILLTER5: 'Được thêm từ',
  FILLTER6: t('group-management'),
})

const formFilter = reactive({
  statusList: null,
  orStructure: null,
  userTypeList: null,
  groupUser: null,
})

// method

const change = () => {
  emit('update', formFilter)
}

// created

if (window._.isEmpty(statuses.value))
  fetchStatusUsersCombobox()
if (window._.isEmpty(userType.value))
  fetchTypeUsersCombobox()
if (window._.isEmpty(organizations.value))
  fetchTOrgStructCombobox()
if (window._.isEmpty(groupUser.value))
  fetchGroupUserCombobox()
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
        :items="statuses"
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
        :items="groupUser"
        :text="LABEL.FILLTER6"
        item-value="id"
        multiple
        custom-key="name"
        :placeholder="LABEL.FILLTER6"
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
        :items="userType"
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
      md="3"
      sm="4"
    >
      <CmSelect
        :text="LABEL.FILLTER4"
        :placeholder="LABEL.FILLTER4"
      />
    </VCol>
  </VRow>
</template>

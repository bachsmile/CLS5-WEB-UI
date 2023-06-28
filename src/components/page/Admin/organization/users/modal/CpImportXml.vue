<script setup lang="ts">
import { comboboxStore } from '@/stores/combobox'

const props = withDefaults(defineProps<Props>(), ({
}))
const emit = defineEmits<Emit>()

const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))

interface Props {
  isDialogVisible: boolean
  users: any
}
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', data: any): void
}

/** store */
const storeCombobox = comboboxStore()
const { userTypeCombobox } = storeToRefs(storeCombobox)
const { fetchTypeUsersCombobox } = storeCombobox

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const LABEL = Object.freeze({
  TITLE: t('user-list'),
  FILLTER1: t('role-user'),
})
const userTypesId = ref()
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('code'), value: 'Code', width: 250 },
  { text: t('surname-name'), value: 'FullName', width: 250 },
  { text: t('firstName'), value: 'FirstName', width: 250 },
  { text: t('lastName'), value: 'LastName', width: 250 },
  { text: t('email'), value: 'Email', width: 250 },
  { text: t('gender'), value: 'Gender', width: 250 },
  { text: t('phoneNumber'), value: 'PhoneNumber', width: 250 },
  { text: t('status'), value: 'Status', width: 250 },
  { text: t('orgName'), value: 'OrgName', width: 250 },
  { text: t('titleName'), value: 'TitleName', width: 250 },
  { text: t('role'), value: 'userTypeName', width: 100 },
])
const dataCompoment = reactive({
  newData: ref<Array<any>>([]),
  updateData: [],
  invalidData: [],

  // origin: dữ liệu ban đầu, check: kiểm tra dữ liệu
  mode: 'origin',
  userTypes: [],
  newDataQuery: {
    pageNumber: 1,
    pageSize: 20,
  },
  updateDataQuery: {
    pageNumber: 1,
    pageSize: 20,
  },
  invalidDataQuery: {
    pageNumber: 1,
    pageSize: 20,
  },
  checkUsers: [],
  isHandling: false,
})

/** computed */
const newDataPagination = computed(() => {
  const begin = (dataCompoment.newDataQuery.pageNumber - 1) * dataCompoment.newDataQuery.pageSize
  return dataCompoment.newData.slice(
    begin,
    begin + dataCompoment.newDataQuery.pageSize,
  )
})
const inValidcolumns = computed(() => {
  const select = { text: '', value: 'checkbox', width: 50 }
  const columns = JSON.parse(JSON.stringify(headers))
  columns.splice(0, 0, select)
  return columns
})
const invalidDataPagination = computed(() => {
  const begin = (dataCompoment.invalidDataQuery.pageNumber - 1) * dataCompoment.invalidDataQuery.pageSize
  return dataCompoment.invalidData.slice(
    begin,
    begin + dataCompoment.invalidDataQuery.pageSize,
  )
})
const updateDataPagination = computed(() => {
  const begin = (dataCompoment.updateDataQuery.pageNumber - 1) * dataCompoment.updateDataQuery.pageSize
  return dataCompoment.updateData.slice(
    begin,
    begin + dataCompoment.updateDataQuery.pageSize,
  )
})

/** method */
function getNameFromEmail(email: any) {
  if (email) {
    const strs = email.split('@')
    if (strs.length > 0)
      return strs[0]
  }
  return ''
}
async function onCancel() {
  emit('update:isDialogVisible', false)
}
async function onConfirm() {
  //
}
async function handleTypeChange(value: any) {
  dataCompoment.newData.forEach((element: any) => {
    element.userTypeId = value
  })
}

function userTypeChange(value: any, index: any) {
  if (dataCompoment.newData[index])
    dataCompoment.newData[index].userTypeId = value
}
watch(() => props.users, newValue => {
  dataCompoment.newData = newValue
})
watch(() => props.isDialogVisible, newValue => {
  if (newValue) {
    dataCompoment.mode = 'origin'
    if (window._.isEmpty(userTypeCombobox.value))
      fetchTypeUsersCombobox()
  }
})
</script>

<template>
  <div>
    <CmDialogs
      :is-dialog-visible="props.isDialogVisible"
      :title="LABEL.TITLE"
      close-on-back
      @cancel="onCancel"
      @confirm="onConfirm"
    >
      <VRow
        v-if="dataCompoment.mode === 'origin'"
        class="flex-row-reverse d-flex"
      >
        <VCol
          cols="12"
          md="6"
          sm="6"
        >
          <CmSelect
            v-model="userTypesId"
            :items="userTypeCombobox"
            item-value="key"
            custom-key="value"
            :text="LABEL.FILLTER1"
            :placeholder="LABEL.FILLTER1"
            @update:model-value="handleTypeChange"
          />
        </VCol>
      </VRow>
      <div class="cp-import-file-table">
        <!--
          <CmTable
          :headers="headers"
          :items="newDataPagination"
          :is-editing="isEditing"
          :min-height="300"
          is-import-file
          :custom-key-error="customKeyError"
          @changeCellvalue="changeCellvalue"
          />
        -->
      </div>
    </CmDialogs>
  </div>
</template>

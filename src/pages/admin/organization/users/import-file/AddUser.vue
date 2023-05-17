<script setup lang="ts">
import type { Action, Config } from '@/typescript/interface/import'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import ApiUser from '@/api/user/index'
import { comboboxStore } from '@/stores/combobox'

const CpImportFile = defineAsyncComponent(() => import('@/components/page/gereral/CpImportFile.vue'))
const { t } = window.i18n()
const titleImport = {
  titleList: t('user-list'),
  titlePage: t('add-user-from-file'),
  titleButtonAdd: t('addUser'),
  titlePageUpload: t('addUser'),
}

/**
 *
 * store
 */

const storeCombobox = comboboxStore()
const { userTypeCombobox, statusesCombobox, organizationsCombobox, groupUserCombobox } = storeToRefs(storeCombobox)
const { fetchTypeUsersCombobox, fetchStatusUsersCombobox, fetchGroupUserCombobox } = storeCombobox

// Cập nhật năng lực
const dataColumnExcel = (rowData: Array<any>) => {
  // eslint-disable-next-line prefer-const
  let [userCode, userName, password, firstName, lastName, phoneNumber, passport, userType, email, status, birthDay, gender, organizationStructure, title, groupUser] = rowData
  return { userCode, userName, password, firstName, lastName, phoneNumber, passport, userType, email, status, birthDay, gender, organizationStructure, title, groupUser }
}
const genderCombobox = ref([
  { key: 'male', value: true },
  { key: 'female', value: false },
  { key: 'unknown', value: null },
])
if (!userTypeCombobox.value.length)
  fetchTypeUsersCombobox()
if (!statusesCombobox.value.length)
  fetchStatusUsersCombobox()
if (!groupUserCombobox.value.length)
  fetchGroupUserCombobox()
const getListTitle = (orgId: any) => {
  if (!orgId)
    return null
  const orgItem: any = organizationsCombobox.value.find((item: any) => item.id === orgId)
  return orgItem?.titleEachOrgs || []
}
const actions = ref<Action[]>([
  {
    title: t('add-from-file'),
    key: 1,
  },
])

// config
const config = reactive<Config>(
  {
    routerBack: 'admin-organization-users-manager',
    table: ({
      header: [
        { text: t('employee-code'), value: 'userCode', width: 200 },
        { text: t('user-name'), value: 'userName', width: 200 },
        { text: t('password'), value: 'password', width: 200 },
        { text: t('first-name'), value: 'firstName', width: 200 },
        { text: t('last-name'), value: 'lastName', width: 200 },
        { text: t('phone-number'), value: 'phoneNumber', width: 200 },
        { text: t('passport'), value: 'passport', width: 200 },
        {
          text: t('user-type'),
          value: 'userType',
          type: 'combobox', // chỉnh sửa bằng combobox
          width: 200,
          combobox: {
            data: computed(() => userTypeCombobox.value),
            multiple: false,
            key: 'userTypeName',
            value: 'userTypeName',
          },
        },
        { text: t('email'), value: 'email', width: 200 },
        {
          text: t('status'),
          value: 'status',
          type: 'combobox', // chỉnh sửa bằng combobox
          width: 200,
          combobox: {
            data: computed(() => statusesCombobox.value),
            multiple: false,
            key: 'value',
            value: 'value',
          },
        },
        {
          text: t('birthday'),
          value: 'birthDay',
          width: 200,
          type: 'dateTime', // chỉnh sửa bằng combobox
          config: {
            dateFormat: 'd/m/Y',
          },
        },
        {
          text: t('gender'),
          value: 'gender',
          type: 'combobox', // chỉnh sửa bằng combobox
          width: 200,
          combobox: {
            data: computed(() => genderCombobox.value),
            multiple: false,
            key: 'key',
            value: 'key',
          },
        },
        {
          text: t('organizational'),
          value: 'organizationStructure',
          valueId: 'organizationStructureId',
          type: 'organization',
          typeOrg: 1,
          width: 200,
        },
        {
          text: t('title-position'),
          value: 'title',
          type: 'combobox', // chỉnh sửa bằng combobox
          combobox: {
            data: getListTitle, // data combobox sẽ phụ thuộc vào một callback khi nhận một giá trị params khác
            multiple: false,
            key: 'titleName',
            value: 'titleName',
            params: 'organizationalStructureId', // khi params này trong row table thay đổi sẽ thay thực hiện hàm combobox.data để getcobobox mới
            type: 'function', // cờ truyền dữ liệu get data combobox là một function
          },
          width: 200,
        },
        {
          text: t('user-group'),
          value: 'groupUser',
          type: 'combobox', // chỉnh sửa bằng combobox
          combobox: {
            data: computed(() => groupUserCombobox.value),
            multiple: false,
            key: 'name',
            value: 'name',
          },
          width: 200,
        },
      ],
    }),
    dowloadSample: {
      urlFileDefault: ApiUser.downloadSampleFileAddUser,
      method: TYPE_REQUEST.POST,
      nameFile: 'user.xlsm',
    },
    importFile: {
      urlFileDefault: ApiUser.AddUserFromFile,
      method: TYPE_REQUEST.POST,
      dataColumnExcel,
    },
  },
)
</script>

<template>
  <div>
    <CpImportFile
      :config="config"
      :actions="actions"
      custom-key-error="messErr"
      v-bind="titleImport"
    />
  </div>
</template>

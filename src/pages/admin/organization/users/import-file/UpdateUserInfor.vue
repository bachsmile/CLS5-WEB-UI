<script setup lang="ts">
import type { Action, Config } from '@/typescript/interface/import'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import ApiUser from '@/api/user/index'
import { useImportFileStore } from '@/stores/ImportFile'

const CpImportFile = defineAsyncComponent(() => import('@/components/page/gereral/CpImportFile.vue'))
const { t } = window.i18n()
const route = useRoute()
const titleImport = {
  titleList: t('user-list'),
  titlePage: t('add-user-from-file'),
  titleButtonAdd: t('edit-user-from-file'),
  titlePageUpload: t('edit-user-from-file'),
}

/**
 *
 * store
 */
const store = useImportFileStore()
const { type } = storeToRefs(store)

// Cập nhật năng lực
const dataColumnExcel = (rowData: Array<any>) => {
  // eslint-disable-next-line prefer-const
  let [userInformation, infoUpdate] = rowData
  return { userInformation, infoUpdate }
}
const actions = ref<Action[]>([
  {
    title: t('update-from-email'),
    key: 1,
  },
  {
    title: t('update-from-code'),
    key: 2,
  },
  {
    title: t('update-from-user-name'),
    key: 3,
  },
])
const filterConfig = {
  list: [
    {
      key: t('Email'),
      value: 1,
    },
    {
      key: t('employee-code'),
      value: 2,
    },
    {
      key: t('sign-name'),
      value: 3,
    },
    {
      key: t('phone-number'),
      value: 4,
    },
    {
      key: t('citizen-identification'),
      value: 5,
    },
    {
      key: t('role'),
      value: 6,
    },
    {
      key: t('status-name'),
      value: 7,
    },
    {
      key: t('kpi-learn'),
      value: 8,
    },
    {
      key: t('kpi-teach'),
      value: 9,
    },
  ],
  modelValue: 2,
}
const typeUpdate = ref(filterConfig.modelValue)

const getTableHeader = computed(() => {
  if (type.value === 1)
    return t('Email')
  if (type.value === 2)
    return t('employee-code')

  return t('sign-name')
})
const columnNewInfo = computed(() => {
  const item = filterConfig.list.find((col: any) => col.value === typeUpdate.value)
  console.log(typeUpdate.value)

  return `${item?.key} ${t('New')}`
})

// config
const config = reactive<Config>(
  {
    customId: 'id',
    routerBack: 'admin-organization-users-manager',
    table: ({
      header: [
        { text: getTableHeader, value: 'userInformation' },
        { text: columnNewInfo, value: 'infoUpdate' },
      ],
    }),
    dowloadSample: {
      urlFileDefault: `${ApiUser.DownloadFileSampleUser}/${filterConfig?.modelValue}`,
      method: TYPE_REQUEST.GET,
      nameFile: 'template-change-info.xlsx',
    },
    importFile: {
      urlFileDefault: `${ApiUser.UpdateFileUserInfor}/${filterConfig?.modelValue}`,
      method: TYPE_REQUEST.PUT,
      dataColumnExcel,
      paramsImport: {
        typeInfo: filterConfig?.modelValue || null,
      },
    },
  },
)

const filterType = (typeOption: any) => {
  if (config.dowloadSample)
    config.dowloadSample.urlFileDefault = `${ApiUser.DownloadFileSampleUser}/${typeOption}`
  if (config.importFile && config.importFile.paramsImport) {
    config.importFile.paramsImport = {
      ...config.importFile.paramsImport,
      typeInfo: typeOption,
    }
    config.importFile.urlFileDefault = `${ApiUser.UpdateFileUserInfor}/${typeOption}`
  }
  typeUpdate.value = typeOption
}
</script>

<template>
  <div>
    <CpImportFile
      :config="config"
      :actions="actions"
      v-bind="titleImport"
      is-filter
      :filter-config="filterConfig"
      @filter="filterType"
    />
  </div>
</template>

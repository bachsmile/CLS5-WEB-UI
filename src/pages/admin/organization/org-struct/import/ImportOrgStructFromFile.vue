<script setup lang="ts">
import type { Action, Config } from '@/typescript/interface/import'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import ApiUser from '@/api/user/index'

const CpImportFile = defineAsyncComponent(() => import('@/components/page/gereral/CpImportFile.vue'))

const { t } = window.i18n()

/** data */
const titleImport = {
  titleList: t('org-struct'),
  titlePageUpload: t('add-org'),
  titleButtonAdd: t('add-org'),
}

// data col excel
const dataColumnExcel = (rowData: Array<any>) => {
  // eslint-disable-next-line prefer-const
  let [code, name, parentName, description] = rowData
  return { code, name, parentName, description }
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
        { text: t('org-code'), value: 'code' },
        { text: t('name-structure'), value: 'name' },
        { text: t('parent-organization'), value: 'parentName' },
        { text: t('description'), value: 'description' },
      ],
    }),
    dowloadSample: {
      urlFileDefault: ApiUser.DownloadSampleFileAddOrg,
      method: TYPE_REQUEST.POST,
      nameFile: 'organizationalstructure.xlsx',
    },
    importFile: {
      urlFileDefault: ApiUser.AddOrgFromFile,
      method: TYPE_REQUEST.POST,
      dataColumnExcel,
      paramsImport: {
        customListExcel: 'listData',
        customListLocal: 'listValid',
        customIsSave: 'isValidate',
      },
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


<script setup lang="ts">
import type { Action, Config } from '@/typescript/interface/import'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import ApiUser from '@/api/user/index'
import { comboboxStore } from '@/stores/combobox'

const CpImportFile = defineAsyncComponent(() => import('@/components/page/gereral/CpImportFile.vue'))
const { t } = window.i18n()
const titleImport = {
  titleList: t('user-list'),
  titlePage: t('update-tile-from-file'),
  titleButtonAdd: t('edit-user-from-file'),
  titlePageUpload: t('edit-user-from-file'),
}

/**
 *
 * store
 */

const storeCombobox = comboboxStore()
const { organizationsCombobox } = storeToRefs(storeCombobox)

// Cập nhật năng lực
const dataColumnExcel = (rowData: Array<any>) => {
  // eslint-disable-next-line prefer-const
  let [userInformation, organizationalStructure, title] = rowData
  return { userInformation, organizationalStructure, title }
}
const getListTitle = (orgId: any) => {
  if (!orgId)
    return null
  const orgItem: any = organizationsCombobox.value.find((item: any) => item.id === orgId)
  return orgItem?.titleEachOrgs || []
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

// config
const config = reactive<Config>(
  {
    customId: 'id',
    routerBack: 'admin-organization-users-manager',
    table: ({
      header: [
        { text: t('employee-code'), value: 'userInformation', width: 300 },
        {
          text: t('organizational'),
          value: 'organizationalStructure',
          valueId: 'organizationalStructureId',
          type: 'organization',
          width: 300,
          typeOrg: 1,
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
        },
      ],
    }),
    dowloadSample: {
      urlFileDefault: ApiUser.downloadSampleFileUpdateTitle,
      method: TYPE_REQUEST.GET,
      nameFile: 'sample-file-title.xlsx',
    },
    importFile: {
      urlFileDefault: ApiUser.updateTitleFromFile,
      method: TYPE_REQUEST.PUT,
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
      v-bind="titleImport"
    />
  </div>
</template>

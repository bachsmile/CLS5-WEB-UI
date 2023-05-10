<script setup lang="ts">
import CpImportFile from '@/components/page/gereral/CpImportFile.vue'
import type { Action, Config } from '@/typescript/interface/import'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import ApiGroupUser from '@/api/group-user/index'

// Cập nhật năng lực
const dataColumnExcel = (rowData: Array<any>) => {
  // eslint-disable-next-line prefer-const
  let [code, name, description] = rowData
  return { name, code, description }
}

const combobox = reactive({
  comboboxLevel: [],
  comboboxGroupProficiency: [],
})

// config
const config = reactive<Config>(
  {
    customId: 'id',
    routerBack: 'admin-organization-user-groups-list',
    table: ({
      header: [
        { text: 'Mã', value: 'code' },
        { text: 'Tên Nhóm', value: 'name' },
        { text: 'Mô Tả', value: 'description' },
      ],
    }),
    dowloadSample: {
      urlFileDefault: ApiGroupUser.DownloadFileSampleGroup,
      method: TYPE_REQUEST.POST,
      nameFile: 'UserGroup.xlsx',
    },
    importFile: {
      urlFileDefault: ApiGroupUser.ImportFileGroup,
      method: TYPE_REQUEST.POST,
      dataColumnExcel,
      paramsImport: {
        isValidate: true,
      },
    },
  },
)
const actions = ref<Action[]>([
  {
    title: 'Thêm từ tệp tin',
  },
])
const titleImport = {
  titleList: 'Danh sách nhóm người dùng',
  titlePage: 'Thêm nhóm người dùng từ tập tin',
  titleButtonAdd: 'Thêm nhóm người dùng',
  titlePageUpload: 'Thêm nhóm người dùng từ tập tin',
}
</script>

<template>
  <div>
    <CpImportFile
      :config="config"
      custom-key-error="messErr"
      :actions="actions"
      v-bind="titleImport"
    />
  </div>
</template>


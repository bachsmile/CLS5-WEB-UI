<script setup lang="ts">
import CpImportFile from '@/components/page/gereral/CpImportFile.vue'
import type { Action, Config } from '@/typescript/interface/import'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import ApiGroupUser from '@/api/group-user/index'

// Cập nhật năng lực
const dataColumnExcel = (rowData: Array<any>) => {
  // eslint-disable-next-line prefer-const
  let [infor, groupName] = rowData
  return { infor, groupName }
}

// config
const config = reactive<Config>(
  {
    customId: 'id',
    routerBack: 'admin-organization-user-groups-list',
    table: ({
      header: [
        { text: 'Mã', value: 'infor' },
        { text: 'Tên Nhóm', value: 'groupName' },
      ],
    }),
    dowloadSample: {
      urlFileDefault: ApiGroupUser.DownloadFileSampleAddUser,
      method: TYPE_REQUEST.POST,
      nameFile: 'AddUserToGroup.xlsx',
    },
    importFile: {
      urlFileDefault: ApiGroupUser.ImportAddUserToGroup,
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
    title: 'Cập nhật từ mail',
    key: 1,
  },
  {
    title: 'Cập nhật từ mã',
    key: 2,
  },
  {
    title: 'Cập nhật từ tài khoản',
    key: 3,
  },
])
const titleImport = {
  titleList: 'Danh sách người dùng',
  titlePage: 'Thêm người dùng từ tập tin',
  titleButtonAdd: 'Thêm người dùng',
  titlePageUpload: 'Thêm người dùng từ tập tin',
}
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


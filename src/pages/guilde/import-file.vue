<script setup lang="ts">
import ApiUser from '@/api/user/index'
import ComboboxService from '@/api/combobox/index'
import CpImportFile from '@/components/page/gereral/CpImportFile.vue'
import type { Config } from '@/typescript/interface/import'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { comboboxStore } from '@/stores/combobox'

const storeCombobox = comboboxStore()
const { organizationsCombobox } = storeToRefs(storeCombobox)

// Cập nhật mã người dùng
// const dataColumnExcel = (rowData: Array<any>) => {
//   const [infor, newEmail] = rowData

//   return { infor, newEmail }
// }
// Cập nhật kpi
// const dataColumnExcel = (rowData: Array<any>) => {
//   const [infor, kpiLearn, kpiTeach] = rowData

//   return { infor, kpiLearn, kpiTeach }
// }
// Cập nhật năng lực
const dataColumnExcel = (rowData: Array<any>) => {
  // eslint-disable-next-line prefer-const
  let [name, groupProficiency, levelProficiencies, description] = rowData

  levelProficiencies = levelProficiencies?.split(',')
  levelProficiencies = levelProficiencies.map((level: any) => level.trim())

  return { name, groupProficiency, levelProficiencies, description }
}

const combobox = reactive({
  comboboxLevel: [],
  comboboxGroupProficiency: [],
})

// method

const getComboboxGroupProficiency = async () => {
  const res = await MethodsUtil.requestApiCustom(ComboboxService.GroupProficiency, TYPE_REQUEST.GET).then((value: any) => value)

  if (!window._.isEmpty(res?.data))
    combobox.comboboxGroupProficiency = res.data
}

const getComboboxProficiencyLevel = async () => {
  const params = {
    keyword: '',
    pageNumber: 1,
    pageSize: 10000,
  }

  const res = await MethodsUtil.requestApiCustom(ComboboxService.ProficiencyLevel, TYPE_REQUEST.POST, params).then((value: any) => value)

  if (!window._.isEmpty(res?.data?.pageLists))
    combobox.comboboxLevel = res.data.pageLists
}

getComboboxGroupProficiency()
getComboboxProficiencyLevel()

const { t } = window.i18n()

// config
const config = reactive<Config>(

  // Cập nhật mã người dùng
  // {
  //   customId: 'id',
  //   dowloadSample: {
  //     urlFileDefault: ApiUser.GetTemplateExcelUpdateEmailUser,

  //     // urlFileDefault: ApiUser.GenerateExcelTemplateCreateUsers,
  //     paramsDowload: {
  //       typeUpdate: 2,
  //       bach: 12,
  //     },
  //     method: 'GET',
  //     nameFile: 'codeBach.xlsx',
  //     dataColumnExcel,
  //   },
  //   importFile: {
  //     urlFileDefault: ApiUser.UpdateInforUserExcel,
  //     method: 'PUT',
  //     paramsImport: {
  //       typeUpdate: 2,
  //     },
  //   },
  // },
  // Cập nhật kpi
  // {
  //   customId: 'id',
  //   table: {
  //     header: [
  //       { text: 'Thông Tin Người Dùng', value: 'infor' },
  //       { text: 'KPI học', value: 'kpiLearn' },
  //       { text: 'KPI dạy', value: 'kpiTeach' },
  //     ],
  //   },
  //   dowloadSample: {
  //     urlFileDefault: ApiUser.GetTemplateExcelUpdateKpiUser,
  //     method: 'GET',
  //     nameFile: 'KPI.xlsx',
  //     dataColumnExcel,
  //   },
  //   importFile: {
  //     urlFileDefault: ApiUser.UpdateKpiUserExcel,
  //     method: 'PUT',
  //     paramsImport: {
  //       typeUpdate: 2,
  //     },
  //   },
  // },
  // Cập nhật năng lực
  {
    customId: 'id',
    routerBack: 'user',
    table: ({
      header: [
        { text: 'Tên Năng Lực', value: 'name' },
        {
          text: 'Nhóm Năng Lực',
          value: 'groupProficiency',
          type: 'combobox',
          combobox: {
            data: computed(() => combobox.comboboxGroupProficiency),
            multiple: false,
            key: 'value',
            value: 'value',
          },
        },
        {
          text: 'Cấp Độ',
          value: 'levelProficiencies',
          type: 'combobox',
          combobox: {
            data: computed(() => combobox.comboboxLevel),
            multiple: true,
            key: 'name',
            value: 'name',
          },
        },
        { text: 'Mô Tả', value: 'description' },
      ],
    }),
    dowloadSample: {
      urlFileDefault: ApiUser.GetTemplateExcelUpdateProficiencyUser,
      method: 'POST',
      nameFile: 'Proficiency.xlsm',
    },
    importFile: {
      urlFileDefault: ApiUser.UpdateProficiencyUserExcel,
      method: 'POST',
      dataColumnExcel,
    },
  },
)
const getListTitle = (orgId: any) => {
  if (!orgId)
    return null
  const orgItem: any = organizationsCombobox.value.find((item: any) => item.id === orgId)
  console.log(orgItem?.titleEachOrgs)
  return orgItem?.titleEachOrgs || []
}
const config2 = reactive<Config>( // tham khảo file UpdateUserTitle.vue
  {
    customId: 'id',
    routerBack: 'admin-organization-users-manager',
    table: ({
      header: [
        { text: t('employee-code'), value: 'userInformation', width: 300 },
        {
          text: t('organizational'),
          value: 'organizationalStructure',
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

// HOOK
</script>

<template>
  <div>
    <CpImportFile
      :config="config"
    />
  </div>
</template>


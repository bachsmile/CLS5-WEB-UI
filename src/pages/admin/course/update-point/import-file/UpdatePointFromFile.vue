<script setup lang="ts">
import CpImportFile from '@/components/page/gereral/CpImportFile.vue'
import type { Action, Config } from '@/typescript/interface/import'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { useImportFileStore } from '@/stores/ImportFile'

const store = useImportFileStore()
const { type } = storeToRefs(store)
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()

const titleImport = {
  titleList: t('org-struct'),
  titlePageUpload: t('add-org'),
  titleButtonAdd: t('add-org'),
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
const getTableHeader = computed(() => {
  if (type.value === 1)
    return t('Email')
  if (type.value === 2)
    return t('employee-code')

  return t('sign-name')
})

// config
const config = reactive<Config>(
  {
    customId: 'id',
    routerBack: 'admin-organization-users-manager',
    table: ({
      header: [
        { text: getTableHeader, value: 'userInformation' },
        { text: t('name-structure'), value: 'name' },
        { text: t('parent-organization'), value: 'parentName' },
        { text: t('description'), value: 'description' },
      ],
    }),
    dowloadSample: {
      urlFileDefault: CourseService.GetSampleFileUpdatePoint,
      method: TYPE_REQUEST.GET,
      nameFile: 'template-update-point.xlsx',
    },

    importFile: {
      urlFileDefault: CourseService.PostUpdatePointOff,
      method: TYPE_REQUEST.POST,
      dataColumnExcel,
      paramsImport: {
        contentId: Number(route.params.contentId),
        typeId: type.value,
      },
    },

  },
)

function dataColumnExcel(rowData: Array<any>) {
  // eslint-disable-next-line prefer-const
  let [userInformation, infoUpdate] = rowData
  return { userInformation, infoUpdate }
}
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

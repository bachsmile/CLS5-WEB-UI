<script lang="ts" setup>
import CpEditSchool from '@/components/page/Admin/training/education/CpEditSchool.vue'
import UserService from '@/api/user'
import CmTab from '@/components/common/CmTab.vue'
import CpManaging from '@/components/page/gereral/CpManaging.vue'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CpMdEditEducation from '@/components/page/Admin/training/education/CpMdEditEducation.vue'

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const ComponentSchool = computed(() => {
  if (route.name === 'manager-education-add' || route.name === 'manager-education-edit')
    return CpEditSchool
  return CpManaging
})
const listtab = [
  {
    key: 'school',
    title: 'school',
    component: ComponentSchool,
    dataTab: {
      titlePage: t('List-school'),
      header: [
        { text: '', value: 'checkbox' },
        { text: t('cost-name'), value: 'name', width: 300 },
        { text: t('address'), value: 'address' },
        { text: t('phone'), value: 'phone' },
        { text: t('email'), value: 'email' },
        { text: '', value: 'actions', width: 150 },
      ],
      apiList: {
        api: UserService.GetListSchool,
        method: TYPE_REQUEST.GET,
      },
      actionsTable: [
        {
          id: 1,
          name: 'QuestionService.ActionEdit',
        },
        {
          id: 2,
          name: 'QuestionService.ActionDelete',
        },
      ],
      routerEdit: 'manager-education',
      apiDelete: {
        api: UserService.PostDeleteSchool,
        method: TYPE_REQUEST.POST,
      },
      apiExportExcel: {
        api: UserService.PostExporExcelSchool,
        method: TYPE_REQUEST.POST,
        fileName: 'school.xlsx',
      },
    },
  },
  {
    key: 'degree',
    title: 'degree',
    component: CpManaging,
    dataTab: {
      titlePage: t('list-degree'),
      header: [
        { text: '', value: 'checkbox' },
        { text: t('cost-name'), value: 'name', width: 300 },
        { text: t('description'), value: 'description' },
        { text: '', value: 'actions', width: 150 },
      ],
      apiList: {
        api: UserService.GetListDegree,
        method: TYPE_REQUEST.GET,
      },
      actionsTable: [
        {
          id: 1,
          name: 'QuestionService.ActionEdit',
        },
        {
          id: 2,
          name: 'QuestionService.ActionDelete',
        },
      ],
      componentEdit: CpMdEditEducation,
      apiAdd: {
        api: UserService.PostCreateDegree,
        method: TYPE_REQUEST.POST,
      },
      apiEdit: {
        api: UserService.PutUpdateDegree,
        method: TYPE_REQUEST.PUT,
      },
      apiGetDetail: {
        api: UserService.GetDetailDegree,
        method: TYPE_REQUEST.GET,
      },
      apiDelete: {
        api: UserService.PostDeleteDegree,
        method: TYPE_REQUEST.POST,
      },
      apiExportExcel: {
        api: UserService.PostExporExcelDegree,
        method: TYPE_REQUEST.POST,
        fileName: 'degree.xlsx',
      },
    },
  },
  {
    key: 'academecrank',
    title: 'Academecrank',
    component: CpManaging,
    dataTab: {
      titlePage: t('list-academecrank'),
      header: [
        { text: '', value: 'checkbox' },
        { text: t('cost-name'), value: 'name', width: 300 },
        { text: t('description'), value: 'description' },
        { text: '', value: 'actions', width: 150 },
      ],

      actionsTable: [
        {
          id: 1,
          name: 'QuestionService.ActionEdit',
        },
        {
          id: 2,
          name: 'QuestionService.ActionDelete',
        },
      ],
      componentEdit: CpMdEditEducation,
      apiList: {
        api: UserService.GetListAcademicrank,
        method: TYPE_REQUEST.GET,
      },
      apiAdd: {
        api: UserService.PostCreateAcademicrank,
        method: TYPE_REQUEST.POST,
      },
      apiEdit: {
        api: UserService.PostUpdateAcademicrank,
        method: TYPE_REQUEST.POST,
      },
      apiGetDetail: {
        api: UserService.GetDetailAcademicrank,
        method: TYPE_REQUEST.GET,
      },
      apiDelete: {
        api: UserService.PostDeleteAcademicrank,
        method: TYPE_REQUEST.POST,
      },
      apiExportExcel: {
        api: UserService.PostExporExcelAcademicrank,
        method: TYPE_REQUEST.POST,
        fileName: 'academicrank.xlsx',
      },
    },
  },
  {
    key: 'academic-degree',
    title: 'academic-degree',
    component: CpManaging,
    dataTab: {
      titlePage: t('list-academedegree'),
      header: [
        { text: '', value: 'checkbox' },
        { text: t('cost-name'), value: 'name', width: 300 },
        { text: t('description'), value: 'description' },
        { text: '', value: 'actions', width: 150 },
      ],

      actionsTable: [
        {
          id: 1,
          name: 'QuestionService.ActionEdit',
        },
        {
          id: 2,
          name: 'QuestionService.ActionDelete',
        },
      ],
      componentEdit: CpMdEditEducation,
      apiList: {
        api: UserService.GetListAcademicdegree,
        method: TYPE_REQUEST.GET,
      },
      apiAdd: {
        api: UserService.PostCreateAcademicdegree,
        method: TYPE_REQUEST.POST,
      },
      apiEdit: {
        api: UserService.PostUpdateAcademicdegree,
        method: TYPE_REQUEST.POST,
      },
      apiGetDetail: {
        api: UserService.GetDetailAcademicdegree,
        method: TYPE_REQUEST.GET,
      },
      apiDelete: {
        api: UserService.PostDeleteAcademicdegree,
        method: TYPE_REQUEST.POST,
      },
      apiExportExcel: {
        api: UserService.PostExporExcelAcademidegree,
        method: TYPE_REQUEST.POST,
        fileName: 'academicdegree.xlsx',
      },
    },
  },
]
</script>

<template>
  <CmTab
    :list-tab="listtab"
    label="tab"
  />
</template>

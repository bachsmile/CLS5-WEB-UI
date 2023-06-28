<script lang="ts" setup>
import SharedService from '@/api/shared'
import CmTab from '@/components/common/CmTab.vue'
import CpMdEditTypeCost from '@/components/page/Admin/training/cost/modal/CpMdEditTypeCost.vue'
import CpManaging from '@/components/page/gereral/CpManaging.vue'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CpMdEditCourseCost from '@/components/page/Admin/training/cost/modal/CpMdEditCourseCost.vue'

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const listtab = [
  {
    key: 'cost-type',
    title: 'cost-type',
    component: CpManaging,
    dataTab: {
      titlePage: t('cost-type'),
      header: [
        { text: '', value: 'checkbox' },
        { text: t('cost-name'), value: 'name', width: 300 },
        { text: t('description'), value: 'description' },
        { text: '', value: 'actions', width: 150 },
      ],
      apiList: {
        api: SharedService.GetListCostType,
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
      componentEdit: CpMdEditTypeCost,
      apiAdd: {
        api: SharedService.PostCreateTypeCost,
        method: TYPE_REQUEST.POST,
      },
      apiEdit: {
        api: SharedService.PostUpdateTypeCost,
        method: TYPE_REQUEST.POST,
      },
      apiGetDetail: {
        api: SharedService.GetDetailCostType,
        method: TYPE_REQUEST.GET,
      },
      apiDelete: {
        api: SharedService.PostDeleteTypeCost,
        method: TYPE_REQUEST.POST,
      },
    },
  },
  {
    key: 'cost-course',
    title: 'cost-course',
    component: CpManaging,
    dataTab: {
      titlePage: t('cost-course'),
      header: [
        { text: '', value: 'checkbox' },
        { text: t('cost-name'), value: 'costName' },
        { text: t('type-name-cost'), value: 'costTypeName' },
        { text: t('user-create'), value: 'userName' },
        { text: t('Course_Name'), value: 'courseName' },
        { text: t('money'), value: 'unitPrice' },
        { text: t('date-create'), value: 'createdDate', isDate: true, type: 'custom' },
        { text: t('description'), value: 'description', width: 300 },
        { text: '', value: 'actions', width: 150 },
      ],
      apiList: {
        api: SharedService.GetListCost,
        method: TYPE_REQUEST.GET,
      },
      actionsTable: [
        {
          id: 8,
          name: 'QuestionService.ActionViewReport',
        },
        {
          id: 1,
          name: 'QuestionService.ActionEdit',
        },
        {
          id: 2,
          name: 'QuestionService.ActionDelete',
        },
      ],
      componentEdit: CpMdEditCourseCost,
      apiAdd: {
        api: SharedService.PostCreateCost,
        method: TYPE_REQUEST.POST,
      },
      apiEdit: {
        api: SharedService.PostUpdateCost,
        method: TYPE_REQUEST.POST,
      },
      apiGetDetail: {
        api: SharedService.GetDetailCost,
        method: TYPE_REQUEST.GET,
      },
      apiDelete: {
        api: SharedService.PostDeleteCost,
        method: TYPE_REQUEST.POST,
      },
    },
  },
  {
    key: 'cost-exam',
    title: 'cost-exam',
    component: CpManaging,
    dataTab: {
      titlePage: t('cost-exam'),
      header: [
        { text: '', value: 'checkbox' },
        { text: t('cost-name'), value: 'costName' },
        { text: t('type-name-cost'), value: 'costTypeName' },
        { text: t('user-create'), value: 'userName' },
        { text: t('name-exam'), value: 'examName' },
        { text: t('money'), value: 'unitPrice' },
        { text: t('date-create'), value: 'createdDate', isDate: true, type: 'custom' },
        { text: t('description'), value: 'description', width: 300 },
        { text: '', value: 'actions', width: 150 },
      ],

      actionsTable: [
        {
          id: 8,
          name: 'QuestionService.ActionViewReport',
        },
        {
          id: 1,
          name: 'QuestionService.ActionEdit',
        },
        {
          id: 2,
          name: 'QuestionService.ActionDelete',
        },
      ],
      componentEdit: CpMdEditCourseCost,
      apiList: {
        api: SharedService.GetListCostExam,
        method: TYPE_REQUEST.GET,
      },
      apiAdd: {
        api: SharedService.PostCreateCostExam,
        method: TYPE_REQUEST.POST,
      },
      apiEdit: {
        api: SharedService.PostUpdateCostExam,
        method: TYPE_REQUEST.POST,
      },
      apiGetDetail: {
        api: SharedService.GetDetailCostExam,
        method: TYPE_REQUEST.GET,
      },
      apiDelete: {
        api: SharedService.PostDeleteCostExam,
        method: TYPE_REQUEST.POST,
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

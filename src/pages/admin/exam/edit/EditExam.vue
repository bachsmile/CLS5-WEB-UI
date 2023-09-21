<script lang="ts" setup>
import CmTab from '@/components/common/CmTab.vue'
import type { Tab } from '@/typescript/interface'
import CpInfoExam from '@/components/page/Admin/exam/edit/CpInfoExam.vue'
import CpThematicList from '@/components/page/Admin/exam/edit/CpThematicList.vue'
import SharedService from '@/api/shared'
import CpManaging from '@/components/page/gereral/CpManaging.vue'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CpMdEditCourseCost from '@/components/page/Admin/training/cost/modal/CpMdEditCourseCost.vue'

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const route = useRoute()
const router = useRouter()
const listTab: Tab[] = [
  {
    key: 'info',
    title: 'info',
    component: CpInfoExam,
  },
  {
    key: 'list-test',
    title: 'list-test',
    isDisabled: !route.params.id,
    component: CpThematicList,
  },
  {
    key: 'cost-management',
    title: 'cost-management',
    component: CpManaging,
    isDisabled: !route.params.id,
    dataTab: {
      titlePage: t('cost-management'),
      header: [
        { text: '', value: 'checkbox' },
        { text: t('cost-name'), value: 'costName' },
        { text: t('type-name-cost'), value: 'costTypeName' },
        { text: t('name-exam'), value: 'examName' },
        { text: t('money'), value: 'unitPrice' },
        { text: t('date-create'), value: 'createdDate', isDate: true, type: 'custom' },
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
      componentEdit: CpMdEditCourseCost,
      apiList: {
        api: SharedService.GetListCostExam,
        method: TYPE_REQUEST.GET,
        payload: {
          examId: Number(route.params.id),
        },
      },
      apiAdd: {
        api: SharedService.PostCreateCostExam,
        method: TYPE_REQUEST.POST,
        params: {
          examId: Number(route.params.id),
        },
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
      isShowExportExcel: false,
    },
  },
]
function activeTab(tab: any) {
  nextTick(() => {
    router.replace({ query: { tab } })
  })
}
</script>

<template>
  <CmTab
    :list-tab="listTab"
    label="tab"
    @activeTab="activeTab"
  />
</template>

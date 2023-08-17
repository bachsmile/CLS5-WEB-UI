<script lang="ts" setup>
import CpMdEditAssginUserSurvey from '../../modal/CpMdEditAssginUserSurvey.vue'
import CpFilterAssignUserSurvey from './CpFilterAssignUserSurvey.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CpActionHeaderPage from '@/components/page/gereral/CpActionHeaderPage.vue'
import CmCollapse from '@/components/common/CmCollapse.vue'
import CmTable from '@/components/common/CmTable.vue'
import type { Params } from '@/typescript/interface/params'
import MethodsUtil from '@/utils/MethodsUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Any } from '@/typescript/interface'
import CpCustomInfo from '@/components/page/gereral/CpCustomInfo.vue'
import DateUtil from '@/utils/DateUtil'
import CmAccodion from '@/components/common/CmAccodion.vue'

const isShowFilter = ref(true)
const { t } = window.i18n()
const route = useRoute()
interface QueryParams extends Params {
  UserIds: number[]
  categoryTitleId: number[]
  examId: number
  groupUser: number[]
  orStructure: number[]
  searchKey: string
  testId: number
  titles: any[]
  typeId: number
}
const queryParams = reactive<QueryParams>({
  UserIds: [],
  categoryTitleId: [],
  examId: Number(route.params.id),
  groupUser: [],
  orStructure: [],
  searchKey: '',
  testId: Number(route.params.topicId),
  titles: [],
  typeId: 6,
  pageNumber: 1,
  pageSize: 10,
})

const headers = [
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-candidates'), value: 'name' },
  { text: t('email'), value: 'email' },
  { text: t('date-register'), value: 'registeredDate', type: 'custom' },
  { text: t('organization'), value: 'organization', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
]
const items = ref<Any[]>([])
const totalRecord = ref(0)
function getListCandidates() {
  const orgModels = {
    value: 1,
    label: t('orgStruct'),
    icon: 'tabler-briefcase',
    colorClass: 'color-error',
    content: [],
  }
  const titleModels = {
    value: 1,
    label: 'Chức danh',
    icon: 'prime-check-circle',
    colorClass: 'color-success',
    content: [],
  }
  const groupModels = {
    value: 1,
    label: 'Nhóm người dùng',
    icon: 'lucide:users',
    colorClass: 'color-warning',
    content: [],
  }

  MethodsUtil.requestApiCustom(QuestionService.PostGetListInfobyTest, TYPE_REQUEST.POST, queryParams).then((result: Any) => {
    result.data.pageLists.forEach((element: Any) => {
      if (element.orgModels) {
        const titleData = window._.clone(element.orgModels)
        element.orgModels = {
          ...orgModels,
          content: element.orgModels,
        }
        element.titleModels = {
          ...titleModels,
          content: titleData,
        }
      }
      if (element.groupModels) {
        element.groupModels = {
          ...groupModels,
          content: element.groupModels,
        }
      }
    })
    queryParams.UserIds = result.data.pageLists((i: Any) => i.id)
    items.value = result.data.pageLists
    totalRecord.value = result.data.totalRecord
  })
}
getListCandidates()

const isShowModalAdd = ref(false)

function showModalAddUser() {
  isShowModalAdd.value = true
}
</script>

<template>
  <div>
    <CpActionHeaderPage
      :title="t('list-candidates')"
      is-custom-add-btn
      :title-custom-add="t('add-candidates')"
      @click="showModalAddUser"
    />
  </div>
  <CmCollapse :is-show="isShowFilter">
    <CpFilterAssignUserSurvey
      v-model:query-params="queryParams"
      @update:query-params="getListCandidates"
    />
  </CmCollapse>
  <div>
    <CpHeaderAction
      v-model:show-filter="isShowFilter"
      v-model:keyword="queryParams.searchKey"
      v-model:page-number="queryParams.pageNumber"
      v-model:page-size="queryParams.pageSize"
      @update:keyword="getListCandidates"
    />
  </div>
  <div>
    <CmTable
      v-model:page-number="queryParams.pageNumber"
      v-model:page-size="queryParams.pageSize"
      :headers="headers"
      :items="items"
    >
      <template #rowItem="{ col, context }">
        <div v-if="col === 'name'">
          <CpCustomInfo :context="context" />
        </div>
        <div v-if="col === 'registeredDate'">
          {{ DateUtil.formatDateToDDMM(context.registeredDate) }}
        </div>
        <div v-if="col === 'organization'">
          <CmAccodion
            v-if="context.orgModels?.content?.length"
            :data="[context.orgModels]"
            custom-key="name"
            is-open
          />
          <CmAccodion
            v-if="context.groupModels?.content?.length"
            :data="[context.groupModels]"
            custom-key="name"
            is-open
          />

          <CmAccodion
            v-if="context.titleModels?.content?.length"
            :data="[context.titleModels]"
            custom-key="titleName"
            is-open
          />
        </div>
      </template>
    </CmTable>
  </div>
  <CpMdEditAssginUserSurvey v-model:is-show="isShowModalAdd" />
</template>

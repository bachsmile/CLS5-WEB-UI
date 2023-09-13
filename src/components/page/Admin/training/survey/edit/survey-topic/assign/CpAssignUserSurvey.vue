<script lang="ts" setup>
import CpMdEditAssginUserSurvey from '../../../modal/CpMdEditAssginUserSurvey.vue'
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
import toast from '@/plugins/toast'
import { tableStore } from '@/stores/table'
import CpConfirmDialog from '@/components/page/gereral/CpConfirmDialog.vue'

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
      element.actions = [
        MethodsUtil.checkActionType({ id: 2 }),
      ]
    })
    queryParams.UserIds = result.data.pageLists.map((i: Any) => i.id)
    items.value = result.data.pageLists
    totalRecord.value = result.data.totalRecord
  })
}
getListCandidates()
const storeTable = tableStore()
const { callBackAction } = storeToRefs(storeTable)

callBackAction.value = actionItem

const isShowModalAdd = ref(false)

function showModalAddUser() {
  isShowModalAdd.value = true
}

function addUser(val: Any) {
  MethodsUtil.requestApiCustom(QuestionService.PostAddUserToSurvey, TYPE_REQUEST.POST, val).then((result: Any) => {
    isShowModalAdd.value = false
    toast('SUCCESS', t(result.message))
    getListCandidates()
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err?.response?.data?.errors, t))
  })
}

const isShowModalConfirmDelete = ref(false)
const selected = ref<any[]>([])
function confirmDelete() {
  const payload = {
    userModel: selected.value,
    examId: route.params.id,
    testId: route.params.topicId,
    type: 1,
  }
  MethodsUtil.requestApiCustom(QuestionService.PostDeleteUserFromSurvey, TYPE_REQUEST.POST, payload).then((result: Any) => {
    isShowModalConfirmDelete.value = false
    toast('SUCCESS', t(result.message))
    selected.value = []
    getListCandidates()
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err?.response?.data?.errors, t))
  })
}

function actionItem([{ id }, content]: [Any, Any]) {
  selected.value = [content.id]
  isShowModalConfirmDelete.value = true
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
      v-model:page-size="queryParams.pageSize"
      v-model:page-number="queryParams.pageNumber"
      v-model:category-title-id="queryParams.categoryTitleId"
      v-model:titles="queryParams.titles"
      v-model:group-user="queryParams.groupUser"
      v-model:or-structure="queryParams.orStructure"
      @update:page-number="getListCandidates"
    />
  </CmCollapse>
  <div>
    <CpHeaderAction
      v-model:show-filter="isShowFilter"
      v-model:keyword="queryParams.searchKey"
      v-model:page-number="queryParams.pageNumber"
      v-model:page-size="queryParams.pageSize"
      is-delete
      :disabled-delete="selected?.length === 0"
      @update:keyword="getListCandidates"
      @delete-multiple="() => { isShowModalConfirmDelete = true }"
    />
  </div>
  <div>
    <CmTable
      v-model:selected="selected"
      v-model:page-number="queryParams.pageNumber"
      v-model:page-size="queryParams.pageSize"
      :total-record="totalRecord"
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
  <CpMdEditAssginUserSurvey
    v-model:is-show="isShowModalAdd"
    :title="t('add-candidates')"
    @ok="addUser"
  />
  <CpConfirmDialog
    v-model:is-dialog-visible="isShowModalConfirmDelete"
    :confirmation-msg="t('confirm-delete-user-from-survey')"
    :type="2"
    @confirm="confirmDelete"
  />
</template>

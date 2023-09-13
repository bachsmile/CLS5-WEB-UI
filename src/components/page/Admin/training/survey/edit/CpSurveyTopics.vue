<script lang="ts" setup>
import type { Item } from 'vue3-easy-data-table'
import CpEditSurveyTopic from './CpEditSurveyTopic.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CpActionHeaderPage from '@/components/page/gereral/CpActionHeaderPage.vue'
import CmTableVue from '@/components/common/CmTable.vue'
import type { Any } from '@/typescript/interface'
import MethodsUtil from '@/utils/MethodsUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Params } from '@/typescript/interface/params'
import DateUtil from '@/utils/DateUtil'
import { tableStore } from '@/stores/table'
import toast from '@/plugins/toast'
import CpConfirmDialog from '@/components/page/gereral/CpConfirmDialog.vue'
import CpCustomInforCourse from '@/components/page/gereral/CpCustomInforCourse.vue'

const { t } = window.i18n()

const router = useRouter()
const headers = [
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-survey-topics'), value: 'name', type: 'custom' },
  { text: t('topic'), value: 'topicName' },
  { text: t('start-time'), value: 'startTime', type: 'custom' },
  { text: t('end-time'), value: 'endTime', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
]
const items = ref<Item[]>([])
const totalRecord = ref(0)
interface QueryParams extends Params {
  id: number | null
  searchData: string
}
const route = useRoute()
const queryParams = reactive<QueryParams>({
  id: Number(route.params.id),
  searchData: '',
  pageNumber: 1,
  pageSize: 10,
})
const storeTable = tableStore()
const { callBackAction } = storeToRefs(storeTable)
function getDataSurveyTopics() {
  MethodsUtil.requestApiCustom(QuestionService.GetListSurveyTopics, TYPE_REQUEST.GET, queryParams).then((result: Any) => {
    result.data.pageLists.forEach((element: Item) => {
      element.actions = [
        MethodsUtil.checkActionType({ id: 1 }),
        MethodsUtil.checkActionType({ id: 2 }),
      ]
    })
    items.value = result.data.pageLists
    totalRecord.value = result.data.totalRecord
  })
}

callBackAction.value = actionItem
getDataSurveyTopics()
const selected = ref<Any[]>([])
const isShowModalDelete = ref(false)
async function confirmDeleteSurveyTopic() {
  const payload = {
    surveyExamId: route.params.id,
    listId: selected.value,
  }
  MethodsUtil.requestApiCustom(QuestionService.DeleteSurveyTopic, TYPE_REQUEST.DELETE, payload).then((result: Any) => {
    toast('SUCCESS', t(result.message))
    getDataSurveyTopics()
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
  })
}
async function actionItem([{ id, name }, content]: [Any, Any]) {
  switch (id) {
    case 1:
      router.push({ name: 'edit-survey-edit-topic', query: { ...route.query, tab: 'info' }, params: { id: route.params.id, topicId: content.id } })
      break
    case 2:
      selected.value = [content.id]
      isShowModalDelete.value = true
      break
    default:
      break
  }
}

const isShowAdd = computed(() => {
  return !!(['edit-survey-edit-topic', 'edit-survey-add-topic'].includes(route.name as string))
})
function showAdd() {
  router.push({ name: 'edit-survey-add-topic', query: { ...route.query, tab: 'info' } })
}
</script>

<template>
  <div v-if="!isShowAdd">
    <CpActionHeaderPage
      :title-custom-add="t('add-survey-thematic')"
      :title="t('list-survey-topics')"
      is-custom-add-btn
      @click="showAdd"
    />
    <div
      class="my-3"
    >
      <CpHeaderAction
        is-delete
        :is-fillter="false"
        :disabled-delete="selected.length === 0"
      />
    </div>

    <CmTableVue
      :headers="headers"
      :items="items"
    >
      <template #rowItem="{ col, context }">
        <div v-if="col === 'name'">
          <CpCustomInforCourse
            :context="context"
            label-title="name"
            is-sub-title
            label-sub-title="statusId"
          />
        </div>
        <div v-if="col === 'startTime'">
          {{ DateUtil.formatDateToDDMM(context.startTime) }}
        </div>
        <div v-if="col === 'endTime'">
          {{ DateUtil.formatDateToDDMM(context.endTime) }}
        </div>
      </template>
    </CmTableVue>
    <CpConfirmDialog
      v-model:is-dialog-visible="isShowModalDelete"
      :confirmation-msg="t('Are-you-delete-survey-topic')"
      :type="2"
      @confirm="confirmDeleteSurveyTopic"
    />
  </div>
  <CpEditSurveyTopic
    v-else
    @fetchList="getDataSurveyTopics"
  />
</template>

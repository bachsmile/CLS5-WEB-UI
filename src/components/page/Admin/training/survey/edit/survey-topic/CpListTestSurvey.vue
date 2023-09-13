<script lang="ts" setup>
import type { Item } from 'vue3-easy-data-table'
import CpEditTestTopicSurvey from './create-test/CpEditTestTopicSurvey.vue'
import CpApproveSurveyTest from './approve-survey-test/CpApproveSurveyTest.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CpActionHeaderPage from '@/components/page/gereral/CpActionHeaderPage.vue'
import CmTable from '@/components/common/CmTable.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Any } from '@/typescript/interface'
import CpCustomInforCourse from '@/components/page/gereral/CpCustomInforCourse.vue'
import { tableStore } from '@/stores/table'
import CpConfirmDialog from '@/components/page/gereral/CpConfirmDialog.vue'
import toast from '@/plugins/toast'
import { statusSurveyTest } from '@/constant/data/status.json'

const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<Emit>()
const { t } = window.i18n()
const storeTable = tableStore()
interface Emit {
  (e: 'update:isShowFooterEdit', status: boolean): void
}
const { callBackAction } = storeToRefs(storeTable)
interface Props {
  isHandWork: boolean
}
const headers = [
  { text: '', value: 'checkbox', width: 50 },
  { text: t('test-survey'), value: 'name', type: 'custom' },
  { text: t('user-create'), value: 'author' },
  { text: t('number-question'), value: 'numberQuestion' },
  { text: '', value: 'actions', width: 150 },
]
const route = useRoute()
const items = ref<Item[]>([])
function getListTestSurvey() {
  const payload = {
    testId: Number(route.params.topicId),
    sort: '-createDate',
  }
  MethodsUtil.requestApiCustom(QuestionService.GetListTestSurvey, TYPE_REQUEST.GET, payload).then((result: Any) => {
    items.value = result?.data
  })
}
getListTestSurvey()
onMounted(() => {
  callBackAction.value = actionItem
})

const selected = ref<number[]>([])
const isShowModalDelete = ref(false)

function confirmDelete() {
  const payload = {
    testId: route.params.topicId,
    listId: selected.value,
  }
  MethodsUtil.requestApiCustom(QuestionService.DeleteSurveyTest, TYPE_REQUEST.DELETE, payload).then((result: Any) => {
    selected.value = []
    getListTestSurvey()
    toast('SUCCESS', t(result.message))
  }).catch((err: Any) => {
    toast('SUCCESS', window.getErrorsMessage(err?.response?.data?.errors), t)
  })
}
const isShowAdd = ref(false)
const isShowApprove = ref(false)
function handleAction(val: string) {
  emit('update:isShowFooterEdit', false)
  switch (val) {
    case 'handlerAddButton':
      isShowAdd.value = true
      break
    case 'handlerCustomButton':
      isShowApprove.value = true
      break

    default:
      break
  }
}
const dataDetail = ref<Any>()
function getDetailTestSurvey(id: number) {
  MethodsUtil.requestApiCustom(QuestionService.GetDetailTestSurvey, TYPE_REQUEST.GET, { id }).then((result: Any) => {
    dataDetail.value = result.data
  })
}
const listQuestion = ref<Any[]>([])
function getListQuestionById(id: number) {
  const payload = {
    surveyTestCodeId: id,
    pageSize: 1000,
    pageNumber: 1,
  }
  MethodsUtil.requestApiCustom(QuestionService.GetListQuestionSurveyById, TYPE_REQUEST.GET, payload).then((result: Any) => {
    listQuestion.value = result?.data?.pageLists
  })
}
function approveSurveyTest() {
  const payload = {
    listModel: [] as Any[],
    testId: route.params.topicId,
  }
  selected.value.forEach((item: number) => {
    const e = {
      id: item,
      description: '',
    }
    payload.listModel.push(e)
  })
  MethodsUtil.requestApiCustom(QuestionService.PostAgreeSurveyTest, TYPE_REQUEST.POST, payload).then((result: Any) => {
    toast('SUCCESS', t(result.message))
    selected.value = []
    getListTestSurvey()
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
  })
}
function recallRequestSurveyTest() {
  const payload = {
    listModel: [] as Any[],
    testId: route.params.topicId,
  }
  selected.value.forEach((item: number) => {
    const e = {
      id: item,
      description: '',
    }
    payload.listModel.push(e)
  })
  MethodsUtil.requestApiCustom(QuestionService.PostRecallRequestSurveyTest, TYPE_REQUEST.POST, payload).then((result: Any) => {
    toast('SUCCESS', t(result.message))
    selected.value = []
    getListTestSurvey()
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
  })
}

async function actionItem([{ id }, content]: [Any, Any]) {
  switch (id) {
    case 1:
      isShowAdd.value = true
      emit('update:isShowFooterEdit', false)
      getDetailTestSurvey(content.id)
      getListQuestionById(content.id)
      break
    case 2:
      selected.value = [content.id]
      isShowModalDelete.value = true
      break
    case 9:
      selected.value = [content.id]
      approveSurveyTest()
      break
    case 6:
      selected.value = [content.id]
      recallRequestSurveyTest()
      break
    default:
      break
  }
}
</script>

<template>
  <div v-if="isShowAdd">
    <CpEditTestTopicSurvey
      v-model:is-show="isShowAdd"
      :is-hand-work="props.isHandWork"
      :data-detail="dataDetail"
      :list-question="listQuestion"
      @fetchData="getListTestSurvey"
      @update:is-show="() => {
        callBackAction = actionItem
      }"
    />
  </div>
  <div v-else-if="isShowApprove">
    <CpApproveSurveyTest />
  </div>
  <div v-else>
    <div>
      <CpActionHeaderPage
        is-custom-add-btn
        :title="t('list-test-survey')"
        :title-custom-add="t('add-test-survey')"
        is-custom-btn
        :title-custom="t('approve-test')"
        @click="handleAction"
      />
    </div>

    <div class="mt-3">
      <CpHeaderAction
        :is-fillter="false"
        is-delete
        :disabled-delete="selected.length === 0"
        @delete-multiple="() => { isShowModalDelete = true }"
      />
    </div>
    <div class="mt-2">
      <CmTable
        v-model:selected="selected"
        :headers="headers"
        :items="items"
        disiable-pagination
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'name'">
            <CpCustomInforCourse
              :context="context"
              :status="statusSurveyTest"
              label-title="name"
              is-sub-title
              label-sub-title="statusId"
            />
          </div>
        </template>
      </CmTable>
    </div>
    <CpConfirmDialog
      v-model:is-dialog-visible="isShowModalDelete"
      :confirmation-msg="t('confirm-delete-test-code')"
      :type="2"
      @confirm="confirmDelete"
    />
  </div>
</template>

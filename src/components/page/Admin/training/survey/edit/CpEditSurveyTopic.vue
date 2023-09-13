<script lang="ts" setup>
import CpInfoSurveyTopic from './survey-topic/CpInfoSurveyTopic.vue'
import CpAssignGeneral from './survey-topic/CpAssignGeneral.vue'
import CpListTestSurvey from './survey-topic/CpListTestSurvey.vue'
import QuestionService from '@/api/question'
import CpActionFooterEdit from '@/components/page/gereral/CpActionFooterEdit.vue'
import CpTabsOrder from '@/components/page/gereral/CpTabsOrder.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Any } from '@/typescript/interface'
import toast from '@/plugins/toast'
import router from '@/router'

const emit = defineEmits<Emit>()

const { t } = window.i18n()

const listTab = [
  {
    key: 'info',
    title: 'info',
    icon: 'clarity:exclamation-circle-line',
  },
  {
    key: 'candidate',
    title: 'candidate',
    icon: 'ci:user-check',
  },
  {
    key: 'test-survey',
    title: 'test-survey',
    icon: 'material-symbols:edit-square-outline',
  },
]
const tab = ref('')
interface DataInput {
  fromDate: any
  isHandWork: boolean
  name: string
  surveyExamId: number
  todate: any
  topicId: number | null
  id?: number
}
interface Emit {
  (e: 'update:isShowAdd', data: boolean): void
  (e: 'fetchList'): void
}
const route = useRoute()
const dataInput = ref<DataInput>({
  name: '',
  fromDate: null,
  surveyExamId: Number(route.params.id),
  todate: null,
  topicId: null,
  isHandWork: true,
})

// lấy dữ liệu detail
async function getDetailSurveyTopic() {
  MethodsUtil.requestApiCustom(QuestionService.GetDetailSurveyTopic, TYPE_REQUEST.GET, { id: route.params.topicId }).then((result: Any) => {
    dataInput.value = result.data
  }).catch(() => {
    toast('ERROR', t('error'))
  })
}
if (route.params.topicId)
  getDetailSurveyTopic()

// Thêm chuyên đề khảo sát
const myForm = ref()
async function createSurvey(isUpdate: boolean, unload: any) {
  await myForm.value.isSubmit().then((success: any) => {
    if (success.valid) {
      MethodsUtil.requestApiCustom(QuestionService.PostCreateSurveyTopic, TYPE_REQUEST.POST, dataInput.value).then((result: Any) => {
        toast('SUCCESS', t(result.message) || t('survey-add-success'))
        if (isUpdate)
          router.push({ name: 'edit-survey-edit-topic', query: { ...route.query }, params: { id: route.params.id, topicId: result.data.testId } })
        else
          cancel()
        emit('fetchList')
      }).catch((err: Any) => {
        toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
      })
    }
  })
  unload()
}

// sửa chuyên đề khảo sát
async function editSurvey(unload: any) {
  await myForm.value.isSubmit().then((success: any) => {
    if (success.valid) {
      MethodsUtil.requestApiCustom(QuestionService.PostUpdateSurveyTopic, TYPE_REQUEST.POST, dataInput.value).then((result: Any) => {
        toast('SUCCESS', t(result.message) || t('survey-edit-success'))

        emit('fetchList')
        cancel()
      }).catch((err: Any) => {
        toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
      })
    }
  })
  unload()
}
function confirm(isUpdate: boolean, unload: any) {
  if (route.params.topicId)
    editSurvey(unload)
  else
    createSurvey(isUpdate, unload)
}

// quay lại trang chuyên đề
function cancel() {
  const query = window._.cloneDeep(route.query)
  delete query.tab
  router.push({ name: 'edit-survey', query: { ...query }, params: { id: route.params.id } })
}
function transferTab() {
  const query = window._.cloneDeep(route.query)
  delete query.assignTab
  delete query.type
  router.push({ query: { ...query, tab: tab.value } })
}
if (route.query.tab || tab.value === '')
  tab.value = route.query.tab as string

onMounted(() => {
  if (route.query.testTab) {
    const query = window._.cloneDeep(route.query)
    delete query.testTab
    router.push({ query })
  }
})
const isShowFooterEdit = ref(true)
</script>

<template>
  <div class="my-6">
    <span class="text-medium-lg">{{ t('add-survey-topics') }}</span>
  </div>

  <div class="d-flex flex-wrap">
    <CpTabsOrder
      v-model="tab"
      :list-tab="listTab"
      @update:model-value="transferTab"
    />
  </div>
  <VDivider class="my-6" />
  <div>
    <CpInfoSurveyTopic
      v-if="route.query.tab === 'info'"
      ref="myForm"
      v-model:data="dataInput"
    />
  </div>
  <div>
    <CpAssignGeneral
      v-if="route.query.tab === 'candidate'"
    />
  </div>
  <div>
    <CpListTestSurvey
      v-if="route.query.tab === 'test-survey'"
      v-model:isShowFooterEdit="isShowFooterEdit"
      :is-hand-work="dataInput.isHandWork"
    />
  </div>

  <div class="mt-3">
    <CpActionFooterEdit
      v-if="isShowFooterEdit"
      :is-save="tab === 'info'"
      :is-save-and-update="!route.params.topicId"
      :title-save="t('save')"
      :title-save-and-update="t('save-and-update')"
      @on-cancel="cancel"
      @on-save="(idx: number, unload: any) => confirm(false, unload)"
      @on-save-update="(idx: number, unload: any) => confirm(true, unload)"
    />
  </div>
</template>

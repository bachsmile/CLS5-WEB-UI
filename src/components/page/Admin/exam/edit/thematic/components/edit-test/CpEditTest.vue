<script lang="ts" setup>
import CpTestConfig from './CpTestConfig.vue'
import CpEditAutoTest from './CpEditAutoTest.vue'
import CpQuestionListV5 from '@/components/page/gereral/CpQuestionListV5.vue'
import type { Any } from '@/typescript/interface'
import CpActionFooterEdit from '@/components/page/gereral/CpActionFooterEdit.vue'
import CpModificationQuestion from '@/components/page/gereral/page/CpModificationQuestion.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CmTextField from '@/components/common/CmTextField.vue'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import CmTab from '@/components/common/CmTab.vue'
import toast from '@/plugins/toast'

interface Props {
  dataDetail: Any | null
}
const props = withDefaults(defineProps<Props>(), {
  dataDetail: null,
})
const emit = defineEmits<Emit>()
const listQuestion = ref<Any[]>([])
watch(listQuestion.value, val => {
  console.log(val)
}, { deep: true })
interface TestConfig {
  isShuffle: boolean
  pageSize: number
  randomQuestion: number
  countDown: number
  persistentStatus: boolean
  time: number
  displayTrue: boolean
  displayCorrect: boolean
  displayFalse: boolean
  preserveTime: boolean
  authRequest: number
  authRequestTimes: string
  autoLogger: number
  retakeTime: number
  resultType: number
  displayPoint: boolean
  displayGrade: boolean
  fullScreen: boolean
  switchingPage: boolean
  maxViolation: number
  reviewType: number
  reviewAfterFinish: boolean
}

const testConfig = ref<TestConfig>({
  isShuffle: false,
  pageSize: 0,
  randomQuestion: 0,
  countDown: 0,
  persistentStatus: false,
  time: 0,
  displayTrue: false,
  displayCorrect: false,
  displayFalse: false,
  preserveTime: false,
  authRequest: 0,
  authRequestTimes: '',
  autoLogger: 0,
  retakeTime: 0,
  resultType: 0,
  displayPoint: false,
  displayGrade: false,
  fullScreen: false,
  switchingPage: false,
  maxViolation: 0,
  reviewType: 1,
  reviewAfterFinish: false,
})
const { t } = window.i18n()
const isShowAddQuestion = ref(false)
interface Emit {
  (e: 'update:isShowAdd', val: string): void
}
function showAdd() {
  isShowAddQuestion.value = true
}
const dataQuestion = ref<Any | null>({
  id: null,
  content: '',
  isGroup: false,
  urlFile: null,
  isAutoApprove: true,
  levelId: null,
  typeId: 1,
  topicId: null,
  answers: [],
  questions: [],
})
const isEdit = ref(false)
const idxEdit = ref(-1)

function handleEditQuestion(val: Any) {
  isEdit.value = true
  idxEdit.value = val.originIndex
  dataQuestion.value = val
  isShowAddQuestion.value = true
}
function cancel() {
  isEdit.value = false
  dataQuestion.value = {
    id: null,
    content: '',
    isGroup: false,
    urlFile: null,
    isAutoApprove: MethodsUtil.checkPermission(null, 'QuestionManaging', 128) || true,
    levelId: null,
    typeId: 1,
    topicId: null,
    answers: [],
    questions: [],
  }
  isShowAddQuestion.value = false
}
const route = useRoute()
const infoQuestion = ref<Any>({
  name: '',
  thematicId: Number(route.params.thematicId),
  isApprove: MethodsUtil.checkPermission(null, 'QuestionManaging', 128) || true,
})
const listTab = [
  {
    key: 'question',
    title: 'questions',
    isRendered: true,
  },

  {
    key: 'configuration',
    title: 'custom',
    isRendered: true,
  },
]
function saveExam(unload: any) {
  if (route.query.testCodeId)
    editTestExam(unload)

  else
    addTestExam(unload)
}
const isEditQuestion = ref(false)
function updateQuestion(val: Any) {
  val.unitPoint = 1
  if (!isEdit.value)
    listQuestion.value.push(val)
  else
    listQuestion.value[idxEdit.value] = val
  cancel()
  if (route.query.testCodeId)
    isEditQuestion.value = true
}
async function addTestExam(unload: any) {
  const payload = {
    questions: listQuestion.value,
    ...infoQuestion.value,
    settings: testConfig.value,
  }
  await MethodsUtil.requestApiCustomV5(QuestionService.testCodes, TYPE_REQUEST.POST, payload).then((result: Any) => {
    toast('SUCCESS', t('add-test-success'))
  }).catch((err: Any) => {
    toast('ERROR', err?.response?.data)
  })
  unload()
}

onMounted(() => {
  watch(() => props.dataDetail, val => {
    if (val && !window._.isEmpty(val)) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { questions, settings, ...infoQuestion } = val
      listQuestion.value = questions
      infoQuestion.value = infoQuestion
      testConfig.value = settings
    }
  }, { immediate: true })
})

async function editTestExam(unload: any) {
  const payload = {
    ...testConfig.value,
    ...infoQuestion.value,
  }
  const resSetting = MethodsUtil.requestApiCustomV5(QuestionService.testCodeSetting, TYPE_REQUEST.PUT, payload)
  let resQs
  if (isEditQuestion.value) {
    const data = {
      questions: listQuestion.value,
      id: infoQuestion.value.id,
      isApprove: infoQuestion.value.isApprove,
    }
    resQs = MethodsUtil.requestApiCustomV5(QuestionService.testCodeQuestion, TYPE_REQUEST.PUT, data)
  }
  Promise.all([resSetting, resQs])
    .then((result: Any) => {
      toast('SUCCESS', t('edit-test-success'))
    }).catch((err: Any) => {
      toast('ERROR', err?.response?.data)
    })
  unload()
}
</script>

<template>
  <VRow>
    <VCol
      cols="4"
    >
      <CmTextField
        v-model:model-value="infoQuestion.name"
        :text="`${t('test-survey-title')}*`"
      />
    </VCol>
    <VCol
      class="d-flex align-end"
    >
      <CmCheckBox
        v-model:model-value="infoQuestion.isApprove"
      >
        {{ t('auto-approve') }}
      </CmCheckBox>
    </VCol>
  </VRow>
  <CmTab
    :list-tab="listTab"
    type="underline"
    label="test"
  />
  <div
    v-if="route.query.test === 'question'"
  >
    <div v-if="!isShowAddQuestion">
      <CpQuestionListV5
        v-if="false"
        v-model:items="listQuestion"
        :is-v5="true"
        @click-add-question="showAdd"
        @edit-item="handleEditQuestion"
        @update:items="() => { isEditQuestion = true }"
      />
      <CpEditAutoTest v-else />
    </div>
    <div v-else>
      <CpModificationQuestion
        :is-edit="isEdit"
        :data="dataQuestion"
        @update:data="updateQuestion"
        @cancel="cancel"
      />
    </div>
  </div>
  <div v-show="route.query.test === 'configuration'">
    <CpTestConfig
      v-model:isShuffle="testConfig.isShuffle"
      v-model:pageSize="testConfig.pageSize"
      v-model:randomQuestion="testConfig.randomQuestion"
      v-model:countDown="testConfig.countDown"
      v-model:persistentStatus="testConfig.persistentStatus"
      v-model:time="testConfig.time"
      v-model:displayTrue="testConfig.displayTrue"
      v-model:displayCorrect="testConfig.displayCorrect"
      v-model:displayFalse="testConfig.displayFalse"
      v-model:preserveTime="testConfig.preserveTime"
      v-model:authRequest="testConfig.authRequest"
      v-model:authRequestTimes="testConfig.authRequestTimes"
      v-model:autoLogger="testConfig.autoLogger"
      v-model:retakeTime="testConfig.retakeTime"
      v-model:resultType="testConfig.resultType"
      v-model:displayPoint="testConfig.displayPoint"
      v-model:displayGrade="testConfig.displayGrade"
      v-model:fullScreen="testConfig.fullScreen"
      v-model:switchingPage="testConfig.switchingPage"
      v-model:maxViolation="testConfig.maxViolation"
      v-model:reviewType="testConfig.reviewType"
      v-model:reviewAfterFinish="testConfig.reviewAfterFinish"
      :total-question="listQuestion.length"
      :is-view-detail-model="false"
    />
  </div>
  <div class="mt-8">
    <CpActionFooterEdit
      is-save
      @on-save="(idx:number, unload: void) => { saveExam(unload) }"
      @on-cancel="emit('update:isShowAdd', 'list')"
    />
  </div>
</template>

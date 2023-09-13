<script lang="ts" setup>
import CpMdAddQuestionSurvey from '../../../modal/CpMdAddQuestionSurvey.vue'
import CpEditConfigurationAutoTest from './CpEditConfigurationAutoTest.vue'
import CpEditTestHandWork from './CpEditTestHandWork.vue'
import CpSettingTestSurvey from './CpSettingTestSurvey.vue'
import type { Any, Tab } from '@/typescript/interface'
import CmTab from '@/components/common/CmTab.vue'
import CpActionFooterEdit from '@/components/page/gereral/CpActionFooterEdit.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import CpActionHeaderPage from '@/components/page/gereral/CpActionHeaderPage.vue'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import toast from '@/plugins/toast'
import { validatorStore } from '@/stores/validatator'

const props = withDefaults(defineProps<Props>(), {

})
const emit = defineEmits<Emit>()
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const schema = yup.object({
  name: schemaOption.requiredString(),
})
const route = useRoute()
const { t } = window.i18n()
const router = useRouter()
interface Props {
  isHandWork?: boolean
  dataDetail?: any
  listQuestion: Any[]
}

interface Emit {
  (e: 'update:isShow', val: boolean): void
  (e: 'fetchData'): void
}
const listTab: Tab[] = [
  {
    key: 'question',
    title: 'surveys',
  },
  {
    key: 'settings',
    title: 'settings',
  },
]

function cancel() {
  const query = window._.cloneDeep(route.query)
  delete query.testTab
  router.push({ query })
  emit('fetchData')
  emit('update:isShow', false)
}

const isShowModalAdd = ref(false)
function handleAction(val: string) {
  switch (val) {
    case 'handlerAddButton':
      isShowModalAdd.value = true
      break

    default:
      break
  }
}
const items = ref<Any[]>([])
function getActionMove(idx: number, total: number) {
  const arrayActions: any[] = [
    MethodsUtil.checkActionType({ id: 4 }),
    MethodsUtil.checkActionType({ id: 2 }),
  ]
  if (idx !== 1)
    arrayActions.push(MethodsUtil.checkActionType({ id: 20 }))
  if (idx !== total)
    arrayActions.push(MethodsUtil.checkActionType({ id: 21 }))
  return arrayActions
}
const cancelId = computed(() => {
  return items.value.map(i => i.questionId)
})

interface DataInput {
  isActivated?: boolean
  isArchive?: boolean
  isCorrectAnswer?: boolean
  isDisplayResult?: boolean
  isRandomQuestion?: boolean
  isShuffleQuestion?: boolean
  description?: null | string
  displayFirstTestCodeTime?: number
  isApprove?: boolean
  isHandWork?: boolean
  isPreserveTime?: boolean
  listQuestions?: Any[]
  name?: string
  testCodeId?: number
  testId?: number
  timeOfWork?: number
  topicId?: number
  totalQuestionDisplayInPage?: number
}
const dataInput = ref<DataInput>({
  description: null,
  name: '',
  testId: Number(route.params.topicId),
  displayFirstTestCodeTime: 0,
  totalQuestionDisplayInPage: 0,
  listQuestions: [],
  isApprove: !!MethodsUtil.checkPermission(null, 'SurveyManaging', 128),
})

function getQuestions(val: number[]) {
  MethodsUtil.requestApiCustom(QuestionService.PostGetListTestById, TYPE_REQUEST.POST, { listId: val }).then((result: Any) => {
    result.data.forEach((element: Any, idx: number) => {
      element.actions = [
        ...getActionMove(idx + 1, result.data.length),
      ]
    })
    items.value = [...items.value, ...result.data]
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
  })
}

const myForm = ref()
const isIntersecting = ref(false)
const isEdit = ref(false)
function onIntersect(val: any) {
  isIntersecting.value = val
}

const validatorSettings = ref()
function handleSaveSurvey(unload: any) {
  validatorSettings.value.myForm.validate().then((result: Any) => {
    if (result.valid) {
      const listQuestion: Any[] = []
      if (isEdit.value) {
        editTestSurvey(unload)
        items.value.forEach((e: Any) => {
          const temp = {
            questionId: e.questionId,
            id: e.id,
            position: e.position,
          }
          listQuestion.push(temp)
        })
        dataInput.value.listQuestions = listQuestion
      }
      else {
        items.value.forEach((e: Any) => {
          const temp = {
            questionId: e.id,
            id: 0,
            position: e.position,
          }
          listQuestion.push(temp)
        })
        dataInput.value.listQuestions = listQuestion
        addTestSurvey(unload)
      }
    }
    else {
      toast('ERROR', t('check-configuration-survey-test'))
      unload()
    }
  })
}
async function addTestSurvey(unload: any) {
  await myForm.value.validate().then(async (success: any) => {
    if (success.valid) {
      MethodsUtil.requestApiCustom(QuestionService.PostCreateTestSurvey, TYPE_REQUEST.POST, dataInput.value).then((result: Any) => {
        toast('SUCCESS', t(result.message))
        cancel()
      }).catch((err: Any) => {
        toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
      })
    }
    else {
      if (!isIntersecting.value)
        toast('ERROR', t('please-input-title'))
    }
  })
  unload()
}
async function editTestSurvey(unload: any) {
  await myForm.value.validate().then(async (success: any) => {
    if (success.valid) {
      MethodsUtil.requestApiCustom(QuestionService.PostUpdateTestSurvey, TYPE_REQUEST.POST, dataInput.value).then((result: Any) => {
        toast('SUCCESS', t(result.message))
        cancel()
      }).catch((err: Any) => {
        toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
      })
    }
    else {
      if (!isIntersecting.value)
        toast('ERROR', t('check-info'))
    }
  })
  unload()
}

watch(() => props.dataDetail, val => {
  dataInput.value = {
    ...dataInput.value,
    ...val,
  }
  isEdit.value = true
})
watch(() => props.listQuestion, val => {
  items.value = [
    ...items.value,
    ...val,
  ]
}, { immediate: true })
</script>

<template>
  <div>
    <CpActionHeaderPage
      :title="t('survey-content')"
      is-custom-add-btn
      is-custom-btn
      :title-custom-add="t('apply-bank-survey')"
      :title-custom="t('preview')"
      @click="handleAction"
    />
  </div>
  <Form
    ref="myForm"
    :validation-schema="schema"
    @submit.prevent="submitForm"
  >
    <VRow>
      <VCol
        v-intersect="onIntersect"
        lg="4"
        cols="12"
      >
        <Field
          v-slot="{ field, errors }"
          v-model="dataInput.name"
          name="name"
          type="text"
        >
          <CmTextField
            :model-value="dataInput.name"
            :field="field"
            :errors="errors"
            :text="`${t('test-survey-title')}*`"
            :placeholder="t('test-survey-title')"
          />
        </Field>
      </VCol>
      <VCol v-if="!!MethodsUtil.checkPermission(null, 'SurveyManaging', 128)">
        <div class="d-flex align-end h-100">
          <CmCheckBox v-model="dataInput.isApprove">
            {{ t('auto-approve') }}
          </CmCheckBox>
        </div>
      </VCol>
    </VRow>
  </Form>

  <CmTab
    class="mt-2"
    :list-tab="listTab"
    label="testTab"
  />
  <div
    class="mt-6"
  >
    <CpEditTestHandWork
      v-if="isHandWork && route.query.testTab === 'question'"
      v-model:list-question="items"
    />
    <CpEditConfigurationAutoTest
      v-if="!isHandWork && route.query.testTab === 'question'"
    />
    <CpSettingTestSurvey
      v-show="route.query.testTab === 'settings'"
      ref="validatorSettings"
      v-model:displayFirstTime="dataInput.displayFirstTestCodeTime"
      v-model:totalQuestionDisplayInPage="dataInput.totalQuestionDisplayInPage"
      :max-total-question="items.length || 0"
    />
  </div>
  <div class="mt-5">
    <CpActionFooterEdit
      is-save
      @on-save="(idx: number, unload: any) => handleSaveSurvey(unload)"
      @on-cancel="cancel"
    />
  </div>
  <CpMdAddQuestionSurvey
    v-if="isHandWork && route.query.testTab === 'question'"
    v-model:is-show="isShowModalAdd"
    :title="t('surveys')"
    :cancel-ids="cancelId"
    @ok="getQuestions"
  />
</template>

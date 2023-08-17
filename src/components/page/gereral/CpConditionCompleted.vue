<!-- eslint-disable indent -->
<script setup lang="ts">
import CpQuestionListCondition from './CpQuestionListCondition.vue'
import CpConfiguration from './CpConfiguration.vue'
import { validatorStore } from '@/stores/validatator'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import { load } from '@/stores/loadComponent.js'
import { configStore } from '@/stores/index'
import toast from '@/plugins/toast'

import CmTab from '@/components/common/CmTab.vue'

import CmCheckBox from '@/components/common/CmCheckBox.vue'
import CpActionFooterEdit from '@/components/page/gereral/CpActionFooterEdit.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import type { Any } from '@/typescript/interface'

const props = withDefaults(defineProps<Props>(), {
  conditionCompleteData: () => ({
    archiveId: null,
    courseContentId: null,
    courseId: null,
    isAfterTime: false,
    isAnswerTheQuestion: false,
    isComplete: false,
    noticeTimeAttendance: 0,
    numberOfAttendance: 0,
    pointRatio: 0,
    time: 0,
    timeFinish: 0,
    timeTypeId: 0,
  }),
  testConfigModel: () => ({
    courseContentId: null,
    isCompleteEnoughPoints: false,
    isCorrectAnswer: false,
    isDisplayFalseAnswer: false,
    isDisplayPoint: false,
    isDisplayResult: false,
    isMaintainStatus: false,
    isPreserveTime: false,
    isRequiredRetest: false,
    isReviewTheTest: false,
    isShuffleQuestion: false,
    minuteOfWork: 0,
    numberOfRetake: 0,
    pointRatio: 0,
    randomQuestion: 0,
    requiredPointRatio: 80,
    retakeResultType: 0,
    reviewId: undefined,
    timeFinish: 0,
    totalQuestionDisplayInPage: 0,
    writeLogMinute: 0,
    minuteWork: 0,
  }),
  timeComplete: 0,
  secondWork: 0,
  timeData: () => ({
    minuteTime: 0,
    secondTime: 0,
    noActiveMinute: 0,
    noActiveSecond: 0,
    noticeMinute: 0 as any,
    noticeSecond: 0 as any,
  }),
})

// Khởi tạo biến đa ngôn ngữ
const emit = defineEmits<Emit>()

const testConfig = ref<TestConfig>({
  courseContentId: null,
  isCompleteEnoughPoints: false,
  isCorrectAnswer: false,
  isDisplayFalseAnswer: false,
  isDisplayPoint: false,
  isDisplayResult: false,
  isMaintainStatus: false,
  isPreserveTime: false,
  isRequiredRetest: false,
  isReviewTheTest: false,
  isShuffleQuestion: false,
  minuteOfWork: 0,
  numberOfRetake: 0,
  pointRatio: 0,
  randomQuestion: 0,
  requiredPointRatio: 80,
  retakeResultType: 0,
  reviewId: undefined,
  timeFinish: 0,
  totalQuestionDisplayInPage: 0,
  writeLogMinute: 0,
  minuteWork: 0,
  id: null,
})
watch(() => props.testConfigModel, val => {
  testConfig.value = val
})

const { t } = window.i18n()
const router = useRouter()
const route = useRoute()

/** store */
const store = load()
const { unLoadComponent } = store
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm } = storeValidate
const { submitForm } = useForm()

const configControl = configStore()
const { settingDefaults } = storeToRefs(configControl)

/** state */

/** state */
const LABEL = Object.freeze({
  TITLE1: t('setting-time'),
  LABEL1: t('click-complete'),
  LABEL2: t('befor-time'),
  LABEL3: t('attendance-time'),
  LABEL4: t('anwser-question'),
})

const myFormAddConditionComplete = ref()
const conditionComplete = ref<ConditionComplete>({
  archiveId: null,
  courseContentId: null,
  courseId: null,
  isAfterTime: false,
  isAnswerTheQuestion: false,
  isComplete: false,
  noticeTimeAttendance: 0,
  numberOfAttendance: 0,
  pointRatio: 0,
  time: 0,
  timeFinish: 0,
  timeTypeId: 0,
})
const schema = computed(() => ({
  ...(conditionComplete.value.isAfterTime
    ? {
        minuteTime: schemaOption.defaultNumberNoReqPosNoNull,
        secondTime: schemaOption.defaultNumberTime,
        noActiveMinute: schemaOption.defaultNumberNoReqPosNoNull,
        noActiveSecond: schemaOption.defaultNumberTime,
      }
    : {}),
}))

interface Time {
  minuteTime: number
  secondTime: number
  noActiveMinute: number
  noActiveSecond: number
  noticeMinute: any
  noticeSecond: any
}
interface ConditionComplete {
  archiveId: any
  courseContentId: any
  courseId: any
  isAfterTime: boolean
  isAnswerTheQuestion: boolean
  isComplete: boolean
  noticeTimeAttendance: number
  numberOfAttendance: number
  pointRatio: number
  time: number
  timeFinish: number
  timeTypeId: number
  [e: string]: any
}
interface Props {
  timeComplete?: any
  conditionCompleteData?: ConditionComplete
  timeData?: Time
  isHaveConfig?: boolean
  isViewDetail?: boolean
  minuteWork?: number
  testConfigModel?: TestConfig
  secondWork?: any
  routeBack?: string
  paramsRoute?: any
}

interface TestConfig {
  id?: number | null
  courseContentId: any
  isCompleteEnoughPoints: boolean
  isCorrectAnswer: boolean
  isDisplayFalseAnswer: boolean
  isDisplayPoint: boolean
  isDisplayResult: boolean
  isMaintainStatus: boolean
  isPreserveTime: boolean
  isRequiredRetest: boolean
  isReviewTheTest: boolean
  isShuffleQuestion: boolean
  minuteOfWork: number
  numberOfRetake: number
  pointRatio: number
  randomQuestion: number
  requiredPointRatio: number
  retakeResultType: number
  reviewId: undefined
  timeFinish: number
  totalQuestionDisplayInPage: number
  writeLogMinute: number
  minuteWork: number
}
interface Emit {
  (e: 'update:conditionCompleteData', data: any): void
  (e: 'update:timeData', data: any): void
  (e: 'update:isAllowRetake', data: any): void
  (e: 'update:isHaveConfig', data: any): void
  (e: 'update:isViewDetail', data: any): void
  (e: 'update:minuteWork', data: any): void
  (e: 'update:testConfigModel', data: any): void
  (e: 'update:timeComplete', data: any): void
}
const time = ref<Time>({
  minuteTime: 0,
  secondTime: 0,
  noActiveMinute: 0,
  noActiveSecond: 0,
  noticeMinute: 0 as any,
  noticeSecond: 0 as any,
})

const listQuestions = ref<Any[]>([])
async function getDefaultSetting() {
  const defaultRatioPoints = settingDefaults.value.find(item => item.typeId === 4)
  emit('update:testConfigModel', {
    ...testConfig.value,
    isCompleteEnoughPoints: !!defaultRatioPoints?.value,
  })
}
function loadDataEdit() {
  time.value = {
    minuteTime: Math.floor(conditionComplete.value.timeFinish / 60),
    secondTime: (conditionComplete.value.timeFinish % 60),
    noActiveMinute: Math.floor(conditionComplete.value.noticeTimeAttendance / 60),
    noActiveSecond: (conditionComplete.value.noticeTimeAttendance % 60),
    noticeMinute: Math.floor(conditionComplete.value.numberOfAttendance / 60),
    noticeSecond: (conditionComplete.value.numberOfAttendance % 60),
  }
  emit('update:timeData', time.value)
  changeTimeComplete()
}
function changeTimeComplete() {
  emit('update:timeComplete', conditionComplete.value.isAfterTime ? Number(time.value.minuteTime) * 60 + Number(time.value.secondTime) : 0)
}

// get config
async function fetchConfig() {
  const params = { id: Number(route.params.contentId) }
  await MethodsUtil.requestApiCustom(CourseService.GetConfiguration, TYPE_REQUEST.GET, params).then((value: any) => {
    if (value.data !== null) {
      emit('update:isHaveConfig', true)
      emit('update:testConfigModel', value.data)
    }
  })
}
function showNotiError(errorObject: any) {
  window._.forEach(errorObject, (value, key) => {
    toast('ERROR', t('Thông tin tùy chỉnh không hợp lệ'))
  })
}
const myFormSettingConditions = ref()

const isNumberPerPage = ref(false)
const isShowRandom = ref(false)
const isTimeOfWork = ref(false)
const isAutoLog = ref(false)
const isAllowRetake = ref(false)

// lưu  dữ liệu
async function saveDataCondition(idx: any) {
  await myFormAddConditionComplete.value.validate().then(async (success: any) => {
    if (success.valid) {
      if (conditionComplete.value.isComplete === false && conditionComplete.value.isAfterTime === false && conditionComplete.value.isAnswerTheQuestion === false) {
        toast('WARNING', t('condition-complete-invalid'))
        return
      }

      if (conditionComplete.value.isAfterTime === true && time.value.minuteTime !== null && time.value.secondTime !== null) {
        conditionComplete.value.timeFinish = Number(time.value.minuteTime) * 60 + Number(time.value.secondTime)

        emit('update:conditionCompleteData',
          conditionComplete.value,
        )
        if (time.value.noActiveMinute !== null && time.value.noActiveSecond !== null) {
          conditionComplete.value.noticeTimeAttendance = Number(time.value.noActiveMinute) * 60 + Number(time.value.noActiveSecond)
          emit('update:conditionCompleteData', conditionComplete.value)
        }

        else {
          conditionComplete.value.noticeTimeAttendance = 0
          emit('update:conditionCompleteData', conditionComplete.value)
        }
        if ((time.value.noticeMinute !== null) && time.value.noticeSecond !== null) {
          conditionComplete.value.numberOfAttendance = Number(time.value.noticeMinute) * 60 + Number(time.value.noticeSecond)
          emit('update:conditionCompleteData', conditionComplete.value)
        }
        else {
          conditionComplete.value.numberOfAttendance = 0
          emit('update:conditionCompleteData', conditionComplete.value)
        }

        if (conditionComplete.value.timeFinish <= conditionComplete.value.noticeTimeAttendance) {
          toast('WARNING', t('notice-time-less-than-success-time'))
          return
        }
      }
      else {
        conditionComplete.value = {
          ...conditionComplete.value,
          timeFinish: 0,
          noticeTimeAttendance: 0,
          numberOfAttendance: 0,
        }
        emit('update:conditionCompleteData', conditionComplete.value)
      }
      if (conditionComplete.value.isAnswerTheQuestion) {
        // thiết lập các giá trih về mặc định khi ko chọn
        if (isNumberPerPage.value !== true) {
          testConfig.value.totalQuestionDisplayInPage = 0
          emit('update:testConfigModel', testConfig.value)
        }
        if (isShowRandom.value !== true) {
          testConfig.value.randomQuestion = 0
          emit('update:testConfigModel', testConfig.value)
        }
        if (isTimeOfWork.value !== true) {
          testConfig.value.minuteWork = 0
          emit('update:testConfigModel', testConfig.value)
        }
        if (isAutoLog.value !== true) {
          testConfig.value.writeLogMinute = 0
          emit('update:testConfigModel', testConfig.value)
        }
        if (isAllowRetake.value !== true) {
          testConfig.value = {
            ...testConfig.value,
            numberOfRetake: 0,
            retakeResultType: 0,
          }
          emit('update:testConfigModel', testConfig.value)
        }

        const validateSet = await myFormSettingConditions.value.myFormConditions.validate().then(async (successSetting: any) => {
          if (successSetting.valid) {
            if (!isTimeOfWork.value) {
              testConfig.value = {
                ...testConfig.value,
                minuteOfWork: 0,
              }
              emit('update:testConfigModel', testConfig.value)
            }
            if (isAutoLog.value === true && testConfig.value.writeLogMinute && testConfig.value.writeLogMinute < 1)
              return false
            unLoadComponent(idx)
            return true
          }
          else {
            unLoadComponent(idx)
            showNotiError(successSetting.errors)
            return false
          }
        })
        if (!validateSet)
          return
      }
      MethodsUtil.requestApiCustom(CourseService.PostSaveRequireFinish, TYPE_REQUEST.POST, conditionComplete.value).then(async (response: any) => {
        if (response?.code === 200) {
          toast('SUCCESS', t(response.message))
          unLoadComponent(idx)

          // cập nhật config
          changeTimeComplete()
          if (conditionComplete.value.isAnswerTheQuestion === true) {
            testConfig.value = {
              ...testConfig.value,
              courseContentId: Number(route.params.contentId),
            }
            emit('update:testConfigModel', testConfig.value)

            // thêm config
            if (props.isHaveConfig === true) {
              await MethodsUtil.requestApiCustom(CourseService.PostuUpdateTestConfig, TYPE_REQUEST.POST, testConfig.value)
            }
            else {
              const res = await MethodsUtil.requestApiCustom(CourseService.PostuCreateTestConfig, TYPE_REQUEST.POST, testConfig.value)
              if (res.code === 200) {
                testConfig.value = {
                  ...testConfig.value,
                  id: res.data,
                }
                emit('update:testConfigModel', testConfig.value)
                emit('update:isHaveConfig', true)
              }
            }

            // lưu danh sách câu hỏi
            const model = {
              courseContentId: Number(route.params.contentId),
              listData: listQuestions.value || [],
            }

            // Nếu là câu hỏi vừa được tạo thì set id = 0
            model.listData?.forEach((element: any) => {
              if (typeof element.id === 'string')
                element.id = 0

              element.questionId = element.id === 0 ? 0 : element.questionId
              element.listQuestions.forEach((item: any) => {
                item.questionId = item.id === 0 ? 0 : item.questionId
              })
            })
            response = await MethodsUtil.requestApiCustom(CourseService.PostuUpdateQuestionTest, TYPE_REQUEST.POST, model)
            unLoadComponent(idx)
          }
        }
      })
        .catch((error: Any) => {
          toast('ERROR', t(error.response.data.message))
        })
    }
  })
  unLoadComponent(idx)
}

// GetListQuestionDetailContentTest

const queryParams = ref({
  pageSize: 1000,
  pageNumber: 1,
  courseContentId: route.params.contentId,
})

function getListQuestionCodition() {
  MethodsUtil.requestApiCustom(CourseService.GetListQuestionContentTest, TYPE_REQUEST.GET, queryParams.value).then((res: Any) => {
    if (res?.data?.pageLists.length) {
      const listId = MethodsUtil.getPropertyByArray(res?.data?.pageLists, 'id')
      MethodsUtil.requestApiCustom(CourseService.GetListQuestionDetailContentTest, TYPE_REQUEST.GET, { listId }).then((response: Any) => {
        response?.data.forEach((element: any) => {
          // câu hỏi chùm
          element.id = (element.id && element.id !== null) ? element.id : 0
          if (element.isQuestionGroup === true) {
            if (!element.questionGroupContent)
              element.questionGroupContent = element.content

            if (!element.questionGroupContentBasic)
              element.questionGroupContentBasic = element.contentBasic
          }

          element.listQuestions.forEach((question: any) => {
            question.id = (question.id && question.id !== null) ? question.id : 0
          })
        })
        listQuestions.value = response?.data
      })
    }
  })
}

onMounted(() => {
  getListQuestionCodition()
})

function changeType(val: any, type: string) {
  conditionComplete.value[type] = val
  emit('update:conditionCompleteData', conditionComplete.value)
  if (val && type === 'isComplete') {
    conditionComplete.value = {
      ...conditionComplete.value,
      isAfterTime: false,
      isAnswerTheQuestion: false,
    }
    emit('update:conditionCompleteData', conditionComplete.value)
  }
  if (val && ['isAfterTime', 'isAnswerTheQuestion'].includes(type)) {
    conditionComplete.value = {
      ...conditionComplete.value,
      isComplete: false,
    }
    emit('update:conditionCompleteData', conditionComplete.value)
  }
}
onMounted(async () => {
  if (!conditionComplete.value.isAnswerTheQuestion)
    await getDefaultSetting()
  loadDataEdit()
  if (route.params.contentId)
    await fetchConfig()
})

watch(() => props.conditionCompleteData, (val: any) => {
  conditionComplete.value = { ...val }
  loadDataEdit()
}, { immediate: true })

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
function handleCancle() {
  router.push({ name: props.routeBack, ...props.paramsRoute })
}
</script>

<template>
  <div class="mt-6">
    <Form
      ref="myFormAddConditionComplete"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <VRow>
        <VCol
          cols="12"
          sm="5"
          lg="4"
        >
          <div class="text-semibold-md color-text-900 mb-4 ">
            {{ t('setting-conditions') }}
          </div>
          <div>
            <CmCheckBox
              v-model:model-value="conditionComplete.isComplete"
              :label="LABEL.LABEL1"
              @update:model-value="changeType($event, 'isComplete')"
            />
          </div>
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
        >
          <div class="text-semibold-md color-text-900 mb-4 ">
            {{ t('setting-conditions') }}
          </div>
          <div class="d-flex align-center">
            <div class="d-flex align-center">
              <CmCheckBox
                v-model:model-value="conditionComplete.isAfterTime"
                :disabled="isViewDetail"
                @update:model-value="changeType($event, 'isAfterTime')"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ LABEL.LABEL2 }}</div>
            </div>
            <div v-show="conditionComplete.isAfterTime">
              <div class="d-flex">
                <Field
                  v-slot="{ field, errors }"
                  v-model:model-value="time.minuteTime"
                  name="minuteTime"
                  type="number"
                >
                  <div class="mr-3">
                    <div class="d-flex align-center">
                      <div class="mr-3 conditon-input">
                        <CmTextField
                          :field="field"
                          type="number"
                          :model-value="time.minuteTime"
                          :disabled="isViewDetail"
                          :min="0"
                          :max="59"
                        />
                      </div>
                      <span class="text-regular-md">{{ t('minutes').toLowerCase() }}</span>
                    </div>
                    <div
                      v-if="errors.length"
                      class="styleError text-errors"
                    >
                      {{ t(MethodsUtil.showErrorsYub(errors)) }}
                    </div>
                  </div>
                </Field>
                <Field
                  v-slot="{ field, errors }"
                  v-model:model-value="time.secondTime"
                  name="secondTime"
                  type="number"
                >
                  <div class="mr-3">
                    <div class="d-flex align-center">
                      <div class="mr-3 conditon-input">
                        <CmTextField
                          :field="field"
                          :disabled="isViewDetail"
                          :model-value="time.secondTime"
                          type="number"
                          :min="0"
                          :max="59"
                        />
                      </div>
                      <span class="text-regular-md">{{ t('seconds').toLowerCase() }}</span>
                    </div>
                    <div
                      v-if="errors.length"
                      class="styleError text-errors"
                    >
                      {{ t(MethodsUtil.showErrorsYub(errors)) }}
                    </div>
                  </div>
                </Field>
              </div>
            </div>
          </div>
          <div
            v-show="conditionComplete.isAfterTime"
          >
            <div
              class="d-flex align-center"
            >
              <div class="d-flex align-center mr-4 ml-8">
                <div>{{ LABEL.LABEL3 }}</div>
              </div>
              <div>
                <div class="d-flex">
                  <Field
                    v-slot="{ field, errors }"
                    v-model:model-value="time.noActiveMinute"
                    name="noActiveMinute"
                    type="number"
                  >
                    <div class="mr-3">
                      <div class="d-flex align-center">
                        <div class="mr-3 conditon-input">
                          <CmTextField
                            :field="field"
                            type="number"
                            :model-value="time.noActiveMinute"
                            :disabled="isViewDetail"
                            :min="0"
                            :max="59"
                          />
                        </div>
                        <span class="text-regular-md">{{ t('minutes').toLowerCase() }}</span>
                      </div>
                      <div
                        v-if="errors.length"
                        class="styleError text-errors"
                      >
                        {{ t(MethodsUtil.showErrorsYub(errors)) }}
                      </div>
                    </div>
                  </Field>
                  <Field
                    v-slot="{ field, errors }"
                    v-model:model-value="time.noActiveSecond"
                    name="noActiveSecond"
                    type="number"
                  >
                    <div class="mr-3">
                      <div class="d-flex align-center">
                        <div class="mr-3 conditon-input">
                          <CmTextField
                            :field="field"
                            :disabled="isViewDetail"
                            :model-value="time.noActiveSecond"
                            type="number"
                            :min="0"
                            :max="59"
                          />
                        </div>
                        <span class="text-regular-md">{{ t('seconds').toLowerCase() }}</span>
                      </div>
                      <div
                        v-if="errors.length"
                        class="styleError text-errors"
                      >
                        {{ t(MethodsUtil.showErrorsYub(errors)) }}
                      </div>
                    </div>
                  </Field>
                </div>
              </div>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
        >
          <div class="d-flex align-center mb-4">
            <div class="d-flex align-center mr-4">
              <CmCheckBox
                v-model:model-value="conditionComplete.isAnswerTheQuestion"
                :label="LABEL.LABEL4"
                :disabled="isViewDetail"
                @update:model-value="changeType($event, 'isAnswerTheQuestion')"
              />
            </div>
          </div>
        </vcol>
      </VRow>
      <div v-show="conditionComplete.isAnswerTheQuestion">
        <div class="text-medium-lg">
          {{ t('list-content-req') }}
        </div>
        <div>
          <CmTab
            :is-render="true"
            :list-tab="listTab"
            type="underline"
            label="tabCondition"
          />
          <CpQuestionListCondition
            v-show="route.query.tabCondition === 'question'"
            v-model:items="listQuestions"
          />

          <CpConfiguration
            v-show="route.query.tabCondition === 'configuration'"
            ref="myFormSettingConditions"
            v-model:isNumberPerPageModel="isNumberPerPage"
            v-model:isShowRandomModel="isShowRandom"
            v-model:isTimeOfWorkModel="isTimeOfWork"
            v-model:isAutoLogModel="isAutoLog"
            v-model:isAllowRetakeModel="isAllowRetake"
            v-model:test-config-model="testConfig"
            :is-view-detail-model="false"
            :total-question="12"
          />
        </div>
      </div>
      <div>
        <CpActionFooterEdit
          class="mt-6"
          is-cancel
          is-save
          :title-cancel="t('cancel-title')"
          :title-save="t('save')"
          @on-save="saveDataCondition"
          @on-cancel="handleCancle"
        />
      </div>
    </Form>
  </div>
</template>

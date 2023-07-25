<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import { configStore } from '@/stores/index'
import CmTextField from '@/components/common/CmTextField.vue'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import CmRadio from '@/components/common/CmRadio.vue'
import MethodsUtil from '@/utils/MethodsUtil'

const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<Emit>()
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const configControl = configStore()
const { settingDefaults } = storeToRefs(configControl)

/** LIB */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const LABEL = Object.freeze({
  LABEL1: t('anwser-question'),
  LABEL2: t('ratio-req'),
  LABEL3: t('ratio-complete-point'),
})

interface Props {
  testConfigModel: TestConfig
  totalQuestion: number
  isNumberPerPageModel: boolean
  isShowRandomModel: boolean
  isTimeOfWorkModel: boolean
  isAutoLogModel: boolean
  isAllowRetakeModel: boolean
  isViewDetailModel: boolean
}

interface TestConfig {
  pointRatio: number
  courseContentId: number | null
  isShuffleQuestion: boolean
  requiredPointRatio: number
  totalQuestionDisplayInPage: number
  randomQuestion: number
  minuteOfWork: number
  writeLogMinute: number
  numberOfRetake: number
  retakeResultType: number
  reviewId: any
  isRequiredRetest: boolean
  isDisplayPoint: boolean
  isDisplayResult: boolean
  isCorrectAnswer: boolean
  timeFinish: number
  isPreserveTime: boolean
  isReviewTheTest: boolean
  isMaintainStatus: boolean
  isCompleteEnoughPoints: boolean
  isDisplayFalseAnswer: boolean
  [e: string]: any
}

const testConfig = ref<TestConfig>({
  pointRatio: 0,
  courseContentId: null,
  isShuffleQuestion: false,
  requiredPointRatio: 80,
  totalQuestionDisplayInPage: 0,
  randomQuestion: 0,
  minuteOfWork: 0,
  writeLogMinute: 0,
  numberOfRetake: 0,
  retakeResultType: 0,
  reviewId: null,
  isRequiredRetest: false,
  isDisplayPoint: false,
  isDisplayResult: false,
  isCorrectAnswer: false,
  timeFinish: 0,
  isPreserveTime: false,
  isReviewTheTest: false,
  isMaintainStatus: false,
  isCompleteEnoughPoints: false,
  isDisplayFalseAnswer: false,
})
interface Emit {
  (e: 'update:testConfigModel', data: any): void
  (e: 'update:isNumberPerPageModel', data: any): void
  (e: 'update:isShowRandomModel', data: any): void
  (e: 'update:isTimeOfWorkModel', data: any): void
  (e: 'update:isAutoLogModel', data: any): void
  (e: 'update:isAllowRetakeModel', data: any): void
}
watch(() => props.testConfigModel, val => {
  testConfig.value = {
    ...val,
  }
  loadDataEdit()
}, { immediate: true })

const isNumberPerPage = ref(false)
const isShowRandom = ref(false)
const isTimeOfWork = ref(false)
const isAutoLog = ref(false)
const isViewDetail = ref(false)
const isAllowRetake = ref(false)
const minuteWork = ref<any>(null)
const myFormConditions = ref()
const secondWork = ref<any>(null)

watchEffect(() => {
  isNumberPerPage.value = props.isNumberPerPageModel
  isShowRandom.value = props.isShowRandomModel
  isTimeOfWork.value = props.isTimeOfWorkModel
  isAutoLog.value = props.isAutoLogModel
  isAllowRetake.value = props.isAllowRetakeModel
  isViewDetail.value = props.isViewDetailModel
})
const count = ref(2)
const schema = computed(() => ({
  pointRatio: schemaOption.defaultNumber100YubNoRequire,
  ...(isNumberPerPage.value ? ({ totalQuestionDisplayInPage: schemaOption.defaultNumberNoReqPosNoNull }) : {}),
  ...(isShowRandom.value ? ({ randomQuestion: schemaOption.defaultNumberNoReqPosNoNulls(props.totalQuestion) }) : {}),
  ...(isTimeOfWork.value ? ({ minuteWork: schemaOption.defaultNumberNoReqPosNoNull }) : {}),
  ...(isTimeOfWork.value ? ({ secondWork: schemaOption.defaultNumberTime }) : {}),
  ...(isAutoLog.value ? ({ writeLogMinute: schemaOption.defaultNumberNoReqPosNoNull }) : {}),
  ...(isAllowRetake.value ? ({ numberOfRetake: schemaOption.defaultNumberNoReqPosNoNullNot0 }) : {}),
}))

async function getDefaultSetting() {
  const defaultRatioPoints = settingDefaults.value.find(item => item.typeId === 4)
  testConfig.value.isCompleteEnoughPoints = !!defaultRatioPoints?.value
  emit('update:testConfigModel', testConfig.value)
}

// load dữ liệu cập nhật
function loadDataEdit() {
  if (testConfig.value.minuteOfWork) {
    minuteWork.value = Math.floor(testConfig.value.minuteOfWork / 60) || 0
    secondWork.value = (testConfig.value.minuteOfWork % 60) || 0
    isTimeOfWork.value = true
  }
  if (testConfig.value.totalQuestionDisplayInPage > 0) {
    isNumberPerPage.value = true
    emit('update:isNumberPerPageModel', isNumberPerPage.value)
  }

  if (testConfig.value.randomQuestion > 0) {
    isShowRandom.value = true
    emit('update:isShowRandomModel', isShowRandom.value)
  }
  if (testConfig.value.writeLogMinute > 0) {
    isAutoLog.value = true
    emit('update:isAutoLogModel', isAutoLog.value)
  }
  if (testConfig.value.numberOfRetake > 0) {
    isAllowRetake.value = true
    emit('update:isAllowRetakeModel', isAllowRetake.value)
  }
}

// thời gian làm bài thay đổi
function timeOfWorkChange() {
  testConfig.value.minuteOfWork = Number(minuteWork.value) * 60 + secondWork.value

  if (isTimeOfWork.value && minuteWork.value !== null && secondWork.value !== null) {
    if (!(Number(minuteWork.value) * 60 + Number(secondWork.value) > 0))
      testConfig.value.isPreserveTime = false
  }
  else {
    testConfig.value.isPreserveTime = false
  }
  emit('update:testConfigModel', testConfig.value)
}

// cho phép làm lại thay đổi
function allowRetakeChange(val: boolean) {
  emit('update:isAllowRetakeModel', val)
  if (testConfig.value.retakeResultType === 0) {
    testConfig.value.retakeResultType = 1
    emit('update:testConfigModel', testConfig.value)
  }
}
function changeCompleteEnoughPoints(valuePoint: any) {
  testConfig.value.isCompleteEnoughPoints = valuePoint
  if (valuePoint === null)
    testConfig.value.isCompleteEnoughPoints = true
  else
    testConfig.value.isCompleteEnoughPoints = valuePoint
  emit('update:testConfigModel', testConfig.value)
}
function changeReviewMode(val: any, type: any) {
  testConfig.value[type] = val
  if (type === 'isDisplayFalseAnswer' && val) {
    testConfig.value.isCorrectAnswer = false
    testConfig.value.isDisplayResult = false
  }
  if (val && ['isCorrectAnswer', 'isDisplayResult'].includes(type))
    testConfig.value.isDisplayFalseAnswer = false

  emit('update:testConfigModel', testConfig.value)
}

function updateValue(val: any, text: string) {
  testConfig.value[text] = val
  emit('update:testConfigModel', testConfig.value)
}

loadDataEdit()
if (!route.params.contentId)
  getDefaultSetting()

defineExpose({
  myFormConditions,
})
</script>

<template>
  <div class="mt-6">
    <Form
      ref="myFormConditions"
      :validation-schema="schema"
    >
      <VRow>
        <VCol
          cols="12"
        >
          <div class="d-flex align-center mb-4">
            <div
              class="d-flex align-center mr-4 text-medium-md"
            >
              <div>{{ LABEL.LABEL2 }}</div>
            </div>
            <div>
              <div class="d-flex align-center">
                <Field
                  v-slot="{ field, errors }"
                  :disabled="isViewDetail"
                  :model-value="testConfig.pointRatio"
                  type="number"
                  name="pointRatio"
                >
                  <div class="mr-6">
                    <div class="d-flex align-center">
                      <div class="mr-1 conditon-input">
                        <CmTextField
                          v-model="testConfig.pointRatio"
                          :field="field"
                          type="number"
                          :disabled="isViewDetail"
                          style="width: 80px;"
                          :min="0"
                          :max="100"
                          @update:model-value="updateValue($event, 'pointRatio')"
                        />
                      </div>
                      <span class="text-regular-md">%</span>
                    </div>
                    <div class="styleError text-errors">
                      {{ t(MethodsUtil.showErrorsYub(errors)) }}
                    </div>
                  </div>
                </Field>
                <div class="mr-3 conditon-input">
                  <CmCheckBox
                    v-model="testConfig.isCompleteEnoughPoints"
                    :disabled="isViewDetail"
                    :label="LABEL.LABEL3"
                    @change="changeCompleteEnoughPoints"
                  />
                </div>
              </div>
            </div>
          </div>
        </VCol>
      </VRow>

      <VRow>
        <VCol class="d-flex align-center mr-4 text-semibold-md">
          <div>{{ t('setting-custom') }}</div>
        </VCol>
      </VRow>

      <VRow>
        <VCol>
          <CmCheckBox
            :model-value="testConfig.isShuffleQuestion"
            :disabled="isViewDetail"
            @update:model-value="updateValue($event, 'isShuffleQuestion')"
          >
            <span class="ml-2">{{ t('shuffer-question') }}</span>
          </CmCheckBox>
        </VCol>
      </VRow>

      <VRow>
        <VCol
          class="d-flex align-center"
        >
          <div>
            <CmCheckBox
              v-model:model-value="isNumberPerPage"
              :disabled="isViewDetail"
              @update:model-value=" emit('update:isNumberPerPageModel', $event)"
            >
              <div class="ml-2 mr-4 text-medium-md">
                {{ t('number-pages') }}
              </div>
            </CmCheckBox>
          </div>

          <div
            v-if="isNumberPerPage"
            class="d-flex align-center h-100"
          >
            <div class="mr-3">
              <Field
                v-slot="{ field, errors }"
                :disabled="isViewDetail"
                :model-value="testConfig.totalQuestionDisplayInPage"
                name="totalQuestionDisplayInPage"
                type="number"
              >
                <div class="d-flex align-center h-100">
                  <div class="mr-3 conditon-input">
                    <CmTextField
                      v-model="testConfig.totalQuestionDisplayInPage"
                      :field="field"
                      type="number"
                      style="width: 90px;"
                      :disabled="isViewDetail"
                      :is-errors="!!errors.length"
                      :min="0"
                      @update:model-value="updateValue($event, 'totalQuestionDisplayInPage')"
                    />
                  </div>
                  <span class="text-regular-md">{{ t('question') }}</span>
                </div>
                <div
                  v-if="errors.length"
                  class="styleError text-errors"
                >
                  {{ t(MethodsUtil.showErrorsYub(errors)) }}
                </div>
              </Field>
            </div>
          </div>
        </VCol>
      </VRow>

      <VRow>
        <VCol class="d-flex align-center">
          <CmCheckBox
            v-model:model-value="isShowRandom"
            :disabled="isViewDetail"
            @update:model-value=" emit('update:isShowRandomModel', $event)"
          >
            <div class="d-flex align-center">
              <div class="ml-2 mr-4 text-medium-md">
                {{ t('random') }}
              </div>
            </div>
          </CmCheckBox>

          <div
            v-if="isShowRandom"
            class="d-flex align-center"
          >
            <div class="mr-3">
              <Field
                v-slot="{ field, errors }"
                :model-value="testConfig.randomQuestion"
                :disabled="isViewDetail"
                name="randomQuestion"
                type="number"
              >
                <div class="mr-6">
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        v-model="testConfig.randomQuestion"
                        :field="field"
                        type="number"
                        :disabled="isViewDetail"
                        :min="0"
                        @update:model-value="updateValue($event, 'randomQuestion')"
                      />
                    </div>
                    <span class="text-regular-md">{{ t('over') }} {{ 2 }} {{ t('question').toLowerCase() }}</span>
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
        </VCol>
      </VRow>

      <VRow>
        <VCol class="d-flex align-center">
          <CmCheckBox
            v-model:model-value="isTimeOfWork"
            :disabled="isViewDetail"
            @update:model-value=" emit('update:isTimeOfWorkModel', $event)"
          >
            <div class="ml-2 mr-4 text-medium-md">
              {{ t('time-doing') }}
            </div>
          </CmCheckBox>
          <div
            v-if="isTimeOfWork"
            class="d-flex align-center"
          >
            <div class="mr-3">
              <Field
                v-slot="{ field, errors }"
                :disabled="isViewDetail"
                :model-value="minuteWork"
                name="minuteWork"
                type="number"
              >
                <div class="mr-3">
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        v-model="minuteWork"
                        :field="field"
                        type="number"
                        :disabled="isViewDetail"
                        :min="0"
                        :max="59"
                        @change="timeOfWorkChange"
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
            </div>
            <div class="mr-3">
              <Field
                v-slot="{ field, errors }"
                :model-value="secondWork"
                :disabled="isViewDetail"
                name="secondWork"
                type="number"
              >
                <div class="mr-6">
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        v-model="secondWork"
                        :field="field"
                        type="number"
                        :disabled="isViewDetail"
                        :min="0"
                        :max="59"
                        @change="timeOfWorkChange"
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
        </VCol>
      </VRow>
      <VRow>
        <VCol class="d-flex algin-center">
          <CmCheckBox
            v-model:model-value="isAutoLog"
            :disabled="isViewDetail"
            @update:model-value=" emit('update:isAutoLogModel', $event)"
          >
            <div class="ml-2 mr-4 text-medium-md">
              {{ t('auto-log') }}
            </div>
          </CmCheckBox>
          <div
            v-if="isAutoLog"
            class="d-flex align-center"
          >
            <div class="mr-3">
              <Field
                v-slot="{ field, errors }"
                :model-value="testConfig.writeLogMinute"
                :disabled="isViewDetail"
                name="writeLogMinute"
                type="number"
              >
                <div class="mr-3">
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        :model-value="testConfig.writeLogMinute"
                        :field="field"
                        type="number"
                        style="width:7rem"
                        :disabled="isViewDetail"
                        :min="0"
                        @update:model-value="updateValue($event, 'writeLogMinute')"
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
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <div class="d-flex align-center">
            <CmCheckBox
              v-model:model-value="isAllowRetake"
              :disabled="isViewDetail"
              @change="allowRetakeChange"
            >
              <div class="d-flex align-center">
                <div class="ml-2 mr-4 text-medium-md">
                  {{ t('rework-is-allowed') }}
                </div>
              </div>
            </CmCheckBox>
            <div
              v-if="isAllowRetake"
              class="d-flex align-center"
            >
              <div class="mr-3">
                <Field
                  v-slot="{ field, errors }"
                  :model-value="testConfig.numberOfRetake"
                  :disabled="isViewDetail"
                  name="numberOfRetake"
                  type="number"
                >
                  <div class="mr-3">
                    <div class="d-flex align-center">
                      <div class="mr-3 conditon-input">
                        <CmTextField
                          v-model="testConfig.numberOfRetake"
                          :field="field"
                          type="number"
                          :disabled="isViewDetail"
                          :min="0"
                          :max="59"
                          @update:model-value="updateValue($event, 'numberOfRetake')"
                        />
                      </div>
                      <span class="text-regular-md">{{ t('turns').toLowerCase() }}</span>
                    </div>
                    <div class="styleError text-errors">
                      {{ t(MethodsUtil.showErrorsYub(errors)) }}
                    </div>
                  </div>
                </Field>
              </div>
            </div>
          </div>

          <div
            v-if="isAllowRetake"
            class="ml-9 mt-3 d-flex align-center"
          >
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="testConfig.retakeResultType"
                :disabled="isViewDetail"
                name="retakeResultType"
                :type="1"
                :value="1"
                @update:model-value="updateValue($event, 'retakeResultType')"
              />
            </div>
            <div class="d-flex align-center mr-4 text-medium-md">
              <div>{{ t('get-high-results') }}</div>
            </div>
          </div>
          <div
            v-if="isAllowRetake"
            class="ml-9 mt-3 d-flex align-center"
          >
            <div class="d-flex align-center mr-4">
              <CmRadio
                :model-value="testConfig.retakeResultType"
                :disabled="isViewDetail"
                name="retakeResultType"
                :type="1"
                :value="2"
                @update:model-value="updateValue($event, 'retakeResultType')"
              />
            </div>
            <div class="d-flex align-center mr-4 text-medium-md">
              <div>{{ t('get-the-final-result') }}</div>
            </div>
          </div>
          <div
            v-if="isAllowRetake"
            class="ml-9 mt-2 d-flex align-center"
          >
            <CmCheckBox
              :model-value="testConfig.isRequiredRetest"
              :disabled="isViewDetail"
              @update:model-value="updateValue($event, 'isRequiredRetest')"
            >
              <div class="ml-2 text-medium-md">
                {{ t('required-retake') }}
              </div>
            </CmCheckBox>
          </div>
        </VCol>
      </VRow>

      <VRow>
        <VCol>
          <CmCheckBox
            :model-value="testConfig.isDisplayPoint"
            :disabled="isViewDetail"
            @update:model-value="updateValue($event, 'isDisplayPoint')"
          >
            <div class="ml-2 mr-4 text-medium-md">
              {{ t('show-point') }}
            </div>
          </CmCheckBox>
        </VCol>
      </VRow>

      <VRow
        class="d-flex align-center mr-4"
      >
        <VCol>
          <div class="text-semibold-md text-medium-md">
            {{ t('setting-review-test') }}
          </div>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <div class=" d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                :model-value="testConfig.reviewId"
                name="time"
                :type="1"
                :value="1"
                @update:model-value="updateValue($event, 'reviewId')"
              />
            </div>
            <div class="d-flex align-center mr-4 text-medium-md">
              <div>{{ t('no-review') }}</div>
            </div>
          </div>
          <div class="mt-3 d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                :model-value="testConfig.reviewId"
                name="time"
                :type="1"
                :value="2"
                @update:model-value="updateValue($event, 'reviewId')"
              />
            </div>
            <div class="d-flex align-center mr-4 text-medium-md">
              <div>{{ t('review-without-point') }}</div>
            </div>
          </div>
          <div class="mt-3 d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                :model-value="testConfig.reviewId"
                name="time"
                :type="1"
                :value="3"
                @update:model-value="updateValue($event, 'reviewId')"
              />
            </div>
            <div class="d-flex align-center mr-4 text-medium-md">
              <div>{{ t('review-deitail-point') }}</div>
            </div>
          </div>
          <div
            v-if="testConfig.reviewId === 3"
            class="ml-9 mt-2 d-flex align-center"
          >
            <CmCheckBox
              v-model:model-value="testConfig.isCorrectAnswer"
              :disabled="isViewDetail"
              @change="changeReviewMode($event, 'isCorrectAnswer')"
            >
              <div class="ml-2 text-medium-md">
                {{ t('show-correct-option') }}
              </div>
            </CmCheckBox>
          </div>
          <div
            v-if="testConfig.reviewId === 3"
            class="ml-9 mt-2 d-flex align-center"
          >
            <CmCheckBox
              v-model:model-value="testConfig.isDisplayResult"
              :disabled="isViewDetail"
              @change="changeReviewMode($event, 'isDisplayResult')"
            >
              <div class="ml-2 text-medium-md">
                {{ t('show-true-false') }}
              </div>
            </CmCheckBox>
          </div>
          <div
            v-if="testConfig.reviewId === 3"
            class="ml-9 mt-2 d-flex align-center"
          >
            <CmCheckBox
              v-model:model-value="testConfig.isDisplayFalseAnswer"
              :disabled="isViewDetail"
              @change="changeReviewMode($event, 'isDisplayFalseAnswer')"
            >
              <div class="ml-2 text-medium-md">
                {{ t('show-false') }}
              </div>
            </CmCheckBox>
          </div>
        </VCol>
      </VRow>
    </Form>
  </div>
</template>

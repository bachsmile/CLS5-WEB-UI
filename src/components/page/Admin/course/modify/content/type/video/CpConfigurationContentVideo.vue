<script setup lang="ts">
import { contentTypeManagerStore } from '@/stores/admin/course/type/contentVideoTypeModify'
import { validatorStore } from '@/stores/validatator'
import { configStore } from '@/stores/index'

const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const CmCheckBox = defineAsyncComponent(() => import('@/components/common/CmCheckBox.vue'))
const CmRadio = defineAsyncComponent(() => import('@/components/common/CmRadio.vue'))

const storeContentVideoTypeModifyManager = contentTypeManagerStore()
const {
  isViewDetail, testConfig,
  isNumberPerPage, isShowRandom, isTimeOfWork, isAutoLog, isAllowRetake, minuteWork, secondWork,

} = storeToRefs(storeContentVideoTypeModifyManager)
const {
  myFormSettingConditions,
} = storeToRefs(storeContentVideoTypeModifyManager)
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

const schema = computed(() => ({
  pointRatio: schemaOption.defaultNumber100YubNoRequire,
  ...(isNumberPerPage.value ? ({ totalQuestionDisplayInPage: schemaOption.defaultNumberNoReqPosNoNull }) : {}),
  ...(isShowRandom.value ? ({ randomQuestion: schemaOption.defaultNumberNoReqPosNoNull }) : {}),
  ...(isTimeOfWork.value ? ({ minuteWork: schemaOption.defaultNumberNoReqPosNoNull }) : {}),
  ...(isTimeOfWork.value ? ({ secondWork: schemaOption.defaultNumberTime }) : {}),
  ...(isAutoLog.value ? ({ writeLogMinute: schemaOption.defaultNumberNoReqPosNoNull }) : {}),
  ...(isAllowRetake.value ? ({ numberOfRetake: schemaOption.defaultNumberNoReqPosNoNullNot0 }) : {}),
}))

async function getDefaultSetting() {
  const defaultRatioPoints = settingDefaults.value.find(item => item.typeId === 4)
  testConfig.value.isCompleteEnoughPoints = !!defaultRatioPoints?.value
}

// load dữ liệu cập nhật
function loadDataEdit() {
  if (testConfig.value.minuteOfWork) {
    minuteWork.value = Math.floor(testConfig.value.minuteOfWork / 60)
    secondWork.value = (testConfig.value.minuteOfWork % 60)
    isTimeOfWork.value = true
  }
  if (testConfig.value.totalQuestionDisplayInPage > 0)
    isNumberPerPage.value = true
  if (testConfig.value.randomQuestion > 0)
    isShowRandom.value = true
  if (testConfig.value.writeLogMinute > 0)
    isAutoLog.value = true
  if (testConfig.value.numberOfRetake > 0)
    isAllowRetake.value = true
}

// thời gian làm bài thay đổi
function timeOfWorkChange() {
  if (isTimeOfWork.value && minuteWork.value !== null && secondWork.value !== null) {
    if (!(Number(minuteWork.value) * 60 + Number(secondWork.value) > 0))
      testConfig.value.isPreserveTime = false
  }
  else { testConfig.value.isPreserveTime = false }
}

// cho phép làm lại thay đổi
function allowRetakeChange() {
  if (testConfig.value.retakeResultType === 0)
    testConfig.value.retakeResultType = 1
}
function changeCompleteEnoughPoints(valuePoint: any) {
  testConfig.value.isCompleteEnoughPoints = valuePoint

  if (valuePoint === null)
    testConfig.value.isCompleteEnoughPoints = true

  else
    testConfig.value.isCompleteEnoughPoints = valuePoint
}
function changeReviewMode(val: any, type: any) {
  testConfig.value[type] = val
  if (type === 'isDisplayFalseAnswer' && val) {
    testConfig.value.isCorrectAnswer = false
    testConfig.value.isDisplayResult = false
  }
  if (val && ['isCorrectAnswer', 'isDisplayResult'].includes(type))
    testConfig.value.isDisplayFalseAnswer = false
}

loadDataEdit()
if (!route.params.contentId)
  getDefaultSetting()
</script>

<template>
  <div class="mt-6">
    <Form
      ref="myFormSettingConditions"
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
              <div class="d-flex">
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
                          :min="0"
                          :max="100"
                          @update:model-value="(value) => testConfig.pointRatio = Number(value)"
                        />
                      </div>
                      <span class="text-regular-md">%</span>
                    </div>
                    <div class="styleError text-errors">
                      {{ errors[0] }}
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
            v-model:model-value="testConfig.isShuffleQuestion"
            :disabled="isViewDetail"
          >
            <span class="ml-2">{{ t('shuffer-question') }}</span>
          </CmCheckBox>
        </VCol>
      </VRow>

      <VRow>
        <VCol>
          <CmCheckBox
            v-model:model-value="isNumberPerPage"
            :disabled="isViewDetail"
          >
            <div class="d-flex align-center">
              <div class="ml-2 mr-4 text-medium-md">
                {{ t('number-pages') }}
              </div>
              <div
                v-if="isNumberPerPage"
                class="d-flex align-center"
              >
                <div class="mr-3">
                  <Field
                    v-slot="{ field, errors }"
                    :disabled="isViewDetail"
                    :model-value="testConfig.totalQuestionDisplayInPage"
                    name="totalQuestionDisplayInPage"
                    type="number"
                  >
                    <div class="mr-6">
                      <div class="d-flex align-center">
                        <div class="mr-3 conditon-input">
                          <CmTextField
                            v-model="testConfig.totalQuestionDisplayInPage"
                            :field="field"
                            type="number"
                            :disabled="isViewDetail"
                            :min="0"
                          />
                        </div>
                        <span class="text-regular-md">{{ t('question') }}</span>
                      </div>
                      <div class="styleError text-errors">
                        {{ errors[0] }}
                      </div>
                    </div>
                  </Field>
                </div>
              </div>
            </div>
          </CmCheckBox>
        </VCol>
      </VRow>

      <VRow>
        <VCol>
          <CmCheckBox
            v-model:model-value="isShowRandom"
            :disabled="isViewDetail"
          >
            <div class="d-flex align-center">
              <div class="ml-2 mr-4 text-medium-md">
                {{ t('random') }}
              </div>
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
                          />
                        </div>
                        <span class="text-regular-md">{{ t('over') }} {{ 2 }} {{ t('question').toLowerCase() }}</span>
                      </div>
                      <div class="styleError text-errors">
                        {{ errors[0] }}
                      </div>
                    </div>
                  </Field>
                </div>
              </div>
            </div>
          </CmCheckBox>
        </VCol>
      </VRow>

      <VRow>
        <VCol>
          <CmCheckBox
            v-model:model-value="isTimeOfWork"
            :disabled="isViewDetail"
          >
            <div class="d-flex align-center">
              <div class="ml-2 mr-4 text-medium-md">
                {{ t('time-doing') }}
              </div>
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
                      <div class="styleError text-errors">
                        {{ errors[0] }}
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
                      <div class="styleError text-errors">
                        {{ errors[0] }}
                      </div>
                    </div>
                  </Field>
                </div>
              </div>
            </div>
          </CmCheckBox>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <CmCheckBox
            v-model:model-value="isAutoLog"
            :disabled="isViewDetail"
          >
            <div class="d-flex align-center">
              <div class="ml-2 mr-4 text-medium-md">
                {{ t('auto-log') }}
              </div>
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
                            v-model="testConfig.writeLogMinute"
                            :field="field"
                            type="number"
                            style="width:7rem"
                            :disabled="isViewDetail"
                            :min="0"
                          />
                        </div>
                        <span class="text-regular-md">{{ t('minutes').toLowerCase() }}</span>
                      </div>
                      <div class="styleError text-errors">
                        {{ errors[0] }}
                      </div>
                    </div>
                  </Field>
                </div>
              </div>
            </div>
          </CmCheckBox>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <CmCheckBox
            v-model:model-value="isAllowRetake"
            :disabled="isViewDetail"
            @change="allowRetakeChange"
          >
            <div class="d-flex align-center">
              <div class="ml-2 mr-4 text-medium-md">
                {{ t('rework-is-allowed') }}
              </div>
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
                          />
                        </div>
                        <span class="text-regular-md">{{ t('turns').toLowerCase() }}</span>
                      </div>
                      <div class="styleError text-errors">
                        {{ errors[0] }}
                      </div>
                    </div>
                  </Field>
                </div>
              </div>
            </div>
          </CmCheckBox>
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
                v-model="testConfig.retakeResultType"
                :disabled="isViewDetail"
                name="retakeResultType"
                :type="1"
                :value="2"
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
              v-model:model-value="testConfig.isRequiredRetest"
              :disabled="isViewDetail"
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
            v-model:model-value="testConfig.isDisplayPoint"
            :disabled="isViewDetail"
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
                v-model="testConfig.reviewId"
                name="time"
                :type="1"
                :value="1"
              />
            </div>
            <div class="d-flex align-center mr-4 text-medium-md">
              <div>{{ t('no-review') }}</div>
            </div>
          </div>
          <div class="mt-3 d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="testConfig.reviewId"
                name="time"
                :type="1"
                :value="2"
              />
            </div>
            <div class="d-flex align-center mr-4 text-medium-md">
              <div>{{ t('review-without-point') }}</div>
            </div>
          </div>
          <div class="mt-3 d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="testConfig.reviewId"
                name="time"
                :type="1"
                :value="3"
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

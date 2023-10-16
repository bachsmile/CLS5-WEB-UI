<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import { configStore } from '@/stores/index'
import CmTextField from '@/components/common/CmTextField.vue'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import CmRadio from '@/components/common/CmRadio.vue'

const props = withDefaults(defineProps<Props>(), {
  isShuffle: false,
  pageSize: 0,
  randomQuestion: 0,
  countDown: 0,
  persistentStatus: false,
  preserveTime: false,
  authRequest: 0,
  time: 0,
  authRequestTimes: '',
  autoLogger: 0,
  retakeTime: 0,
  retakeResult: 0,
  displayPoint: false,
  displayTrue: false,
  displayCorrect: false,
  displayFalse: false,
  reviewAfterFinish: false,
  fullScreen: false,
  switchingPage: false,
})

const emit = defineEmits<Emit>()

const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup, ruleMessage } = storeValidate
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
  totalQuestion: number
}

interface Emit {
  (e: string, value: any): void
}

const isAutoLog = ref(false)
const isViewDetail = ref(false)
const isAllowRetake = ref(false)
const minuteWork = ref<any>(null)
const myFormConfig = ref()

// biến model

const reviewId = ref(null)

// state mới
// const isShuffle = ref(false)
// const pageSize = ref<number>(0)
// const randomQuestion = ref<number>(0)
// const countDown = ref<number>(0)
// const persistentStatus = ref<boolean>(false)
// const preserveTime = ref<boolean>(false)
// const authRequest = ref<number>(0)
// const time = ref<number>(0)
// const autoLogger = ref(0)
// const retakeTime = ref(0)
// const retakeResult = ref(0)
// const displayPoint = ref(0)
// const displayTrue = ref(false)
// const displayCorrect = ref(false)
// const displayFalse = ref(false)
// const reviewAfterFinish = ref(false)
// const fullScreen = ref(false)
// const switchingPage = ref(false)

interface Props {
  isShuffle?: boolean
  pageSize?: number
  randomQuestion?: number
  countDown?: number
  persistentStatus?: boolean
  preserveTime?: boolean
  authRequest?: number
  time?: number
  authRequestTimes?: string
  autoLogger?: number
  retakeTime?: number
  retakeResult?: number
  displayPoint?: boolean
  displayTrue?: boolean
  displayCorrect?: boolean
  displayFalse?: boolean
  reviewAfterFinish?: boolean
  fullScreen?: boolean
  switchingPage?: boolean
}

// state dùng trên component
const isShowPageSize = ref(false)
const isShowRandom = ref(false)
const isCountDown = ref(false)
const isAuthRequest = ref(false)
const autoCaptureType = ref('random')
const isTimeOfWork = ref(false)
const timeline = ref<number[]>([])

const schema = computed(() => ({
  pointRatio: schemaOption.defaultNumber100YubNoRequire,
  ...(isShowPageSize.value ? ({ totalQuestionDisplayInPage: schemaOption.defaultNumberNoReqPosNoNull }) : {}),
  ...(isShowRandom.value ? ({ randomQuestion: schemaOption.defaultNumberNoReqPosNoNulls(props.totalQuestion) }) : {}),
  ...(isCountDown.value ? ({ countDown: schemaOption.defaultNumberNoReqPosNoNull }) : {}),
  ...(isTimeOfWork.value ? ({ time: schemaOption.defaultNumberNoReqPosNoNull }) : {}),
  ...(isAutoLog.value ? ({ writeLogMinute: schemaOption.defaultNumberNoReqPosNoNull }) : {}),
  ...(isAllowRetake.value ? ({ numberOfRetake: schemaOption.defaultNumberNoReqPosNoNullNot0 }) : {}),
  authRequest: yup.number().typeError(ruleMessage.typeNumber).test('positive', ruleMessage.positive, (value: any) => value >= 0).nullable().required(ruleMessage.required()).max(16, 'Số mốc nhỏ hơn hoặc bằng 16'),
}))

watch(() => props.pageSize, val => {
  if (val)
    isShowPageSize.value = true
})
watch(() => props.randomQuestion, val => {
  if (val)
    isShowRandom.value = true
})
watch(() => props.time, val => {
  if (val)
    isTimeOfWork.value = true
})

function updateValue(val: any, text: string) {
  emit(`update:${text}`, val)
}

function changeTimeline() {
  const requestTimes = timeline.value.join(';')
  updateValue(requestTimes, 'authRequestTimes')
}
const validateTimeline = computed(() => {
  return (i: number) => (timeline.value.filter(item => item === timeline.value[i - 1]).length > 1 || timeline.value[i - 1] >= props.time) as boolean
})

function allowRetakeChange(val: boolean) {
  if (props.retakeResult === 0)
    updateValue(1, 'retakeResult')
}

function changeReviewMode(val: any, type: string) {
  if (type === 'displayFalse' && val) {
    updateValue(false, 'displayTrue')
    updateValue(false, 'displayCorrect')
  }
  if (val && ['displayTrue', 'displayCorrect'].includes(type))
    updateValue(false, 'displayFalse')
}

defineExpose({
  myFormConfig,
})
</script>

<template>
  <div class="mt-6">
    <Form
      ref="myFormConfig"
      :validation-schema="schema"
    >
      <VRow>
        <VCol class="d-flex align-center mr-4 text-semibold-md">
          <div>{{ t('setting-custom') }}</div>
        </VCol>
      </VRow>

      <VRow>
        <VCol>
          <CmCheckBox
            :model-value="isShuffle"
            :disabled="isViewDetail"
            @update:model-value="updateValue($event, 'isShuffle')"
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
              v-model:model-value="isShowPageSize"
              :disabled="isViewDetail"
            >
              <div class="ml-2 mr-4 text-medium-md">
                {{ t('number-pages') }}
              </div>
            </CmCheckBox>
          </div>

          <div
            v-if="isShowPageSize"
            class="d-flex align-center h-100"
          >
            <div class="mr-3">
              <Field
                v-slot="{ field, errors }"
                :disabled="isViewDetail"
                :model-value="pageSize"
                name="totalQuestionDisplayInPage"
                type="number"
              >
                <div class="d-flex align-center h-100">
                  <div class="mr-3 conditon-input">
                    <CmTextField
                      :model-value="pageSize"
                      :field="field"
                      type="number"
                      style="width: 90px;"
                      :disabled="isViewDetail"
                      :is-errors="!!errors.length"
                      :min="0"
                      @update:model-value="updateValue($event, 'pageSize')"
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
                :model-value="randomQuestion"
                :disabled="isViewDetail"
                name="randomQuestion"
                type="number"
              >
                <div class="mr-6">
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        :model-value="randomQuestion"
                        :field="field"
                        type="number"
                        :disabled="isViewDetail"
                        :min="0"
                        @update:model-value="updateValue($event, 'randomQuestion')"
                      />
                    </div>
                    <span class="text-regular-md">{{ t('over') }} {{ totalQuestion }} {{ t('question').toLowerCase() }}</span>
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
            v-model:model-value="isCountDown"
            :disabled="isViewDetail"
          >
            <div class="ml-2 mr-4 text-medium-md">
              {{ t('countdown-on-exam') }}
            </div>
          </CmCheckBox>
          <div
            v-if="isCountDown"
            class="d-flex align-center"
          >
            <div class="mr-3">
              <Field
                v-slot="{ field, errors }"
                :disabled="isViewDetail"
                :model-value="countDown"
                name="countDown"
                type="number"
              >
                <div class="mr-3">
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        :model-value="countDown"
                        :field="field"
                        type="number"
                        :disabled="isViewDetail"
                        :min="0"
                        @update:model-value="updateValue($event, 'countDown')"
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
          <CmCheckBox
            :model-value="persistentStatus"
            @update:model-value="updateValue($event, 'persistentStatus')"
          >
            <div class="ml-2 mr-4 text-medium-md">
              {{ t('persistent-status') }}
            </div>
          </CmCheckBox>
        </VCol>
      </VRow>
      <VRow>
        <VCol class="d-flex align-center">
          <CmCheckBox
            v-model:model-value="isTimeOfWork"
            :disabled="isViewDetail"
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
                :model-value="time"
                name="time"
                type="number"
              >
                <div class="mr-3">
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        :model-value="time"
                        :field="field"
                        type="number"
                        :disabled="isViewDetail"
                        :min="0"
                        @update:model-value="updateValue($event, 'time')"
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
          <CmCheckBox
            :model-value="preserveTime"
            :disabled="isViewDetail || time === 0"
            @update:model-value="updateValue($event, 'preserveTime')"
          >
            <div class="ml-2 mr-4 text-medium-md">
              {{ t('preserving-time') }}
            </div>
          </CmCheckBox>
        </VCol>
      </VRow>
      <VRow>
        <VCol cols="4">
          <div class="d-flex align-center">
            <CmCheckBox
              v-model:model-value="isAuthRequest"
              :disabled="isViewDetail || time === 0"
            >
              <div class="ml-2 mr-4 text-medium-md text-no-wrap">
                {{ t('auto-request-face') }}
              </div>
            </CmCheckBox>
          </div>
        </VCol>
        <VCol
          v-if="isAuthRequest"
          class="d-flex align-center ml-2"
        >
          <div class="mr-3">
            <Field
              v-slot="{ field, errors }"
              :model-value="authRequest"
              :disabled="isViewDetail"
              name="authRequest"
            >
              <div class="mr-3">
                <div class="d-flex align-center">
                  <div class="mr-3 conditon-input">
                    <CmTextField
                      :model-value="authRequest"
                      :field="field"
                      type="number"
                      style="width:7rem"
                      :disabled="isViewDetail"
                      :min="0"
                      @update:model-value="updateValue($event, 'authRequest')"
                    />
                  </div>
                  <span class="text-regular-md">{{ t('turns').toLowerCase() }}</span>
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
        </VCol>
      </VRow>
      <div v-if="authRequest">
        <div class="d-flex align-center my-1">
          <CmRadio
            v-model="autoCaptureType"
            name="some-radios"
            value="random"
          />
          <label
            class="ml-2"
          >Chọn ngẫu nhiên</label>
        </div>
        <div class="d-flex align-center my-1">
          <CmRadio
            v-model="autoCaptureType"
            name="some-radios"
            value="setting"
          />
          <label class="ml-2">Đặt thời gian ({{ time ? `Từ 0 đến ${time - 1}` : 'Bằng 0' }})</label>
        </div>
        <div v-if="autoCaptureType === 'setting'">
          <VRow>
            <VCol
              v-for="i in Number(authRequest)"
              :key="i"
              cols="1"
              time-step
            >
              <CmTextField
                v-model:model-value="timeline[i - 1]"
                :is-show-errors="false"
                :is-errors="validateTimeline(i)"
                @change="changeTimeline"
              />
            </VCol>
          </VRow>
        </div>
      </div>
      <VRow>
        <VCol class="d-flex algin-center">
          <CmCheckBox
            v-model:model-value="isAutoLog"
            :disabled="isViewDetail || time === 0"
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
                :model-value="autoLogger"
                :disabled="isViewDetail"
                name="writeLogMinute"
                type="number"
              >
                <div class="mr-3">
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        :model-value="autoLogger"
                        :field="field"
                        type="number"
                        style="width:7rem"
                        :disabled="isViewDetail"
                        :min="0"
                        @update:model-value="updateValue($event, 'autoLogger')"
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
                  :model-value="retakeTime"
                  :disabled="isViewDetail"
                  name="retakeTime"
                  type="number"
                >
                  <div class="mr-3">
                    <div class="d-flex align-center">
                      <div class="mr-3 conditon-input">
                        <CmTextField
                          :model-value="retakeTime"
                          :field="field"
                          type="number"
                          :disabled="isViewDetail"
                          :min="0"
                          :max="59"
                          @update:model-value="updateValue($event, 'retakeTime')"
                        />
                      </div>
                      <span class="text-regular-md">{{ t('turns').toLowerCase() }}</span>
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
            v-if="isAllowRetake"
            class="ml-9 mt-3 d-flex align-center"
          >
            <div class="d-flex align-center mr-4">
              <CmRadio
                :model-value="retakeResult"
                :disabled="isViewDetail"
                name="retakeResult"
                :type="1"
                :value="1"
                @update:model-value="updateValue($event, 'retakeResult')"
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
                :model-value="retakeResult"
                :disabled="isViewDetail"
                name="retakeResult"
                :type="1"
                :value="2"
                @update:model-value="updateValue($event, 'retakeResult')"
              />
            </div>
            <div class="d-flex align-center mr-4 text-medium-md">
              <div>{{ t('get-the-final-result') }}</div>
            </div>
          </div>
        </VCol>
      </VRow>

      <VRow>
        <VCol>
          <CmCheckBox
            :model-value="displayPoint"
            :disabled="isViewDetail"
            @update:model-value="updateValue($event, 'displayPoint')"
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
                v-model:model-value="reviewId"
                name="reviewId"
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
                v-model:model-value="reviewId"
                name="reviewId"
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
                v-model:model-value="reviewId"
                name="reviewId"
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
            v-if="reviewId === 3"
            class="ml-9 mt-2 d-flex align-center"
          >
            <CmCheckBox
              :model-value="displayTrue"
              :disabled="isViewDetail"
              @change="changeReviewMode($event, 'displayTrue')"
            >
              <div class="ml-2 text-medium-md">
                {{ t('show-correct-option') }}
              </div>
            </CmCheckBox>
          </div>
          <div
            v-if="reviewId === 3"
            class="ml-9 mt-2 d-flex align-center"
          >
            <CmCheckBox
              :model-value="displayCorrect"
              :disabled="isViewDetail"
              @change="changeReviewMode($event, 'displayCorrect')"
            >
              <div class="ml-2 text-medium-md">
                {{ t('show-true-false') }}
              </div>
            </CmCheckBox>
          </div>
          <div
            v-if="reviewId === 3"
            class="ml-9 mt-2 d-flex align-center"
          >
            <CmCheckBox
              :model-value="displayFalse"
              :disabled="isViewDetail"
              @change="changeReviewMode($event, 'displayFalse')"
            >
              <div class="ml-2 text-medium-md">
                {{ t('show-false') }}
              </div>
            </CmCheckBox>
          </div>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <CmCheckBox
            :model-value="reviewAfterFinish"
            :disabled="isViewDetail || reviewId !== 3 "
            @update:model-value="updateValue($event, 'reviewAfterFinish')"
          >
            <div class="ml-2 mr-4 text-medium-md">
              {{ t('review-when-test-end') }}
            </div>
          </CmCheckBox>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <CmCheckBox
            :model-value="reviewAfterFinish"
            :disabled="isViewDetail"
            @update:model-value="updateValue($event, 'reviewAfterFinish')"
          >
            <div class="ml-2 mr-4 text-medium-md">
              {{ t('show-rating-results') }}
            </div>
          </CmCheckBox>
        </VCol>
      </VRow>
      <VRow
        class="d-flex align-center mr-4"
      >
        <VCol>
          <div class="text-semibold-md text-medium-md">
            {{ t('anti-cheating') }}
          </div>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <CmCheckBox
            :model-value="fullScreen"
            :disabled="isViewDetail"
            @update:model-value="updateValue($event, 'fullScreen')"
          >
            <div class="ml-2 mr-4 text-medium-md">
              {{ t('always-full-screen') }}
            </div>
          </CmCheckBox>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <CmCheckBox
            :model-value="switchingPage"
            :disabled="isViewDetail"
            @update:model-value="updateValue($event, 'switchingPage')"
          >
            <div class="ml-2 mr-4 text-medium-md">
              {{ t('Không cho chuyển trang') }}
            </div>
          </CmCheckBox>
        </VCol>
      </VRow>
      <VRow>
        <VCol cols="3">
          <div class="ml-2 mr-4 text-medium-md">
            {{ t('suspended-after') }}
          </div>
        </VCol>
        <VCol cols="2">
          <div class="d-flex align-center">
            <CmTextField />
            <div class="ml-2 mr-4 text-medium-md">
              {{ t('violation-time') }}
            </div>
          </div>
        </VCol>
      </vrow>
    </form>
  </div>
</template>

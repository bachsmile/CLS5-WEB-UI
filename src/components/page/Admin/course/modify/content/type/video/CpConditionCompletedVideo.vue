<!-- eslint-disable indent -->
<script setup lang="ts">
import CpQuestionCondition from './CpQuestionCondition.vue'
import { contentTypeManagerStore } from '@/stores/admin/course/type/contentVideoTypeModify'
import { validatorStore } from '@/stores/validatator'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import { load } from '@/stores/loadComponent.js'
import { configStore } from '@/stores/index'
import toast from '@/plugins/toast'

const CmCheckBox = defineAsyncComponent(() => import('@/components/common/CmCheckBox.vue'))
const CmDateTimePicker = defineAsyncComponent(() => import('@/components/common/CmDateTimePicker.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))

/** LIB */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()

/** store */
const store = load()
const { unLoadComponent } = store
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const storeContentVideoTypeModifyManager = contentTypeManagerStore()
const { conditionComplete, testConfig, timeComplete, isViewDetail, myFormSettingConditions, isNumberPerPage, isShowRandom, isTimeOfWork, isAutoLog, isAllowRetake, minuteWork, secondWork } = storeToRefs(storeContentVideoTypeModifyManager)
const { changeType, getQuestionsData } = storeContentVideoTypeModifyManager

const configControl = configStore()
const { settingDefaults } = storeToRefs(configControl)

/** state */

/** method */
function handleCancle() {
  router.push({ name: 'course-edit', params: { tab: 'content', id: Number(route.params.id) } })
}
function getErrorsMessage(errorsMess: Array<any>) {
  let str = ''
  errorsMess.forEach(element => {
    str += `${t(element.message, element.params)}`
    str += '. '
  })

  return str
}

/** state */
const LABEL = Object.freeze({
  TITLE1: t('setting-time'),
  LABEL1: t('click-complete'),
  LABEL2: t('befor-time'),
  LABEL3: t('attendance-time'),
  LABEL4: t('anwser-question'),
})

const myFormAddConditionComplete = ref()

const isHaveConfig = ref(false)
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

const time = ref({
  minuteTime: 0,
  secondTime: 0,
  noActiveMinute: 0,
  noActiveSecond: 0,
  noticeMinute: 0 as any,
  noticeSecond: 0 as any,
})
async function getDefaultSetting() {
  const defaultRatioPoints = settingDefaults.value.find(item => item.typeId === 4)
  testConfig.value.isCompleteEnoughPoints = !!defaultRatioPoints?.value
}
function loadDataEdit() {
  time.value.minuteTime = Math.floor(conditionComplete.value.timeFinish / 60)
  time.value.secondTime = (conditionComplete.value.timeFinish % 60)
  time.value.noActiveMinute = Math.floor(conditionComplete.value.noticeTimeAttendance / 60)
  time.value.noActiveSecond = (conditionComplete.value.noticeTimeAttendance % 60)
  time.value.noticeMinute = Math.floor(conditionComplete.value.numberOfAttendance / 60)
  time.value.noticeSecond = (conditionComplete.value.numberOfAttendance % 60)
  changeTimeComplete()
}
function changeTimeComplete() {
  timeComplete.value = conditionComplete.value.isAfterTime ? Number(time.value.minuteTime) * 60 + Number(time.value.secondTime) : 0
}

// get config
async function fetchConfig() {
  const params = { id: Number(route.params.contentId) }
  await MethodsUtil.requestApiCustom(CourseService.GetConfiguration, TYPE_REQUEST.GET, params).then((value: any) => {
    if (value.data !== null) {
      isHaveConfig.value = true
      testConfig.value = value.data
    }
  })
}
function showNotiError(errorObject: any) {
  window._.forEach(errorObject, (value, key) => {
    toast('ERROR', t('Thông tin tùy chỉnh không hợp lệ'))
  })
}

// lưu  dữ liệu
async function saveDataCondition(idx: any) {
  myFormAddConditionComplete.value.validate().then(async (success: any) => {
    unLoadComponent(idx)
    if (success.valid) {
      if (conditionComplete.value.isComplete === false && conditionComplete.value.isAfterTime === false && conditionComplete.value.isAnswerTheQuestion === false) {
        toast('WARNING', t('condition-complete-invalid'))
        return
      }

      if (conditionComplete.value.isAfterTime === true && time.value.minuteTime !== null && time.value.secondTime !== null) {
        conditionComplete.value.timeFinish = Number(time.value.minuteTime) * 60 + Number(time.value.secondTime)
        if (time.value.noActiveMinute !== null && time.value.noActiveSecond !== null)
          conditionComplete.value.noticeTimeAttendance = Number(time.value.noActiveMinute) * 60 + Number(time.value.noActiveSecond)
        else conditionComplete.value.noticeTimeAttendance = 0
        if ((time.value.noticeMinute !== null) && time.value.noticeSecond !== null)
          conditionComplete.value.numberOfAttendance = Number(time.value.noticeMinute) * 60 + Number(time.value.noticeSecond)
        else conditionComplete.value.numberOfAttendance = 0
        if (conditionComplete.value.timeFinish <= conditionComplete.value.noticeTimeAttendance) {
          toast('WARNING', t('notice-time-less-than-success-time'))
          return
        }
      }
      else {
        conditionComplete.value.timeFinish = 0
        conditionComplete.value.noticeTimeAttendance = 0
        conditionComplete.value.numberOfAttendance = 0
      }
      if (conditionComplete.value.isAnswerTheQuestion) {
        // thiết lập các giá trih về mặc định khi ko chọn
        if (isNumberPerPage.value !== true)
          testConfig.value.totalQuestionDisplayInPage = 0
        if (isShowRandom.value !== true)
          testConfig.value.randomQuestion = 0
        if (isTimeOfWork.value !== true)
          testConfig.value.minuteWork = 0
        if (isAutoLog.value !== true)
          testConfig.value.writeLogMinute = 0
        if (isAllowRetake.value !== true) {
          testConfig.value.numberOfRetake = 0
          testConfig.value.retakeResultType = 0
        }
        const validateSet = await myFormSettingConditions.value.validate().then(async (successSetting: any) => {
          if (successSetting.valid) {
            if (isTimeOfWork.value === true && minuteWork.value !== null && secondWork.value !== null)
              testConfig.value.minuteOfWork = Number(minuteWork.value) * 60 + Number(secondWork.value)

            else testConfig.value.minuteOfWork = 0
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
      let response
      response = await MethodsUtil.requestApiCustom(CourseService.PostSaveRequireFinish, TYPE_REQUEST.POST, conditionComplete.value)
      if (response.code === 200) {
        toast('SUCCESS', t(response.message))

        // cập nhật config
        changeTimeComplete()
        if (conditionComplete.value.isAnswerTheQuestion === true) {
          testConfig.value.courseContentId = Number(route.params.contentId)

          // thêm config
          if (isHaveConfig.value === true) {
            await MethodsUtil.requestApiCustom(CourseService.PostuUpdateTestConfig, TYPE_REQUEST.POST, testConfig.value)
          }
          else {
            const res = await MethodsUtil.requestApiCustom(CourseService.PostuCreateTestConfig, TYPE_REQUEST.POST, testConfig.value)
            if (res.code === 200) {
              testConfig.value.id = res.data
              isHaveConfig.value = true
            }
          }

          // lưu danh sách câu hỏi
          const model = {
            courseContentId: Number(route.params.contentId),
            listData: getQuestionsData() || [],
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
        }
      }
      else {
        toast('ERROR', t(response.message))
      }
    }
  })
}

onMounted(async () => {
  if (!conditionComplete.value.isAnswerTheQuestion)
    await getDefaultSetting()
  loadDataEdit()
  if (route.params.contentId)
    await fetchConfig()
})
watch(() => conditionComplete.value, (val: any) => {
  loadDataEdit()
})
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
              @change="changeType($event, 'isComplete')"
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
                @change="changeType($event, 'isAfterTime')"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ LABEL.LABEL2 }}</div>
            </div>
            <div v-if="conditionComplete.isAfterTime">
              <div class="d-flex">
                <Field
                  v-slot="{ field, errors }"
                  v-model="time.minuteTime"
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
                    <div class="styleError text-errors">
                      {{ errors[0] }}
                    </div>
                  </div>
                </Field>
                <Field
                  v-slot="{ field, errors }"
                  v-model="time.secondTime"
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
                    <div class="styleError text-errors">
                      {{ errors[0] }}
                    </div>
                  </div>
                </Field>
              </div>
            </div>
          </div>
          <div
            v-if="conditionComplete.isAfterTime"
            class="d-flex align-center"
          >
            <div class="d-flex align-center mr-4 ml-8">
              <div>{{ LABEL.LABEL3 }}</div>
            </div>
            <div>
              <div class="d-flex">
                <Field
                  v-slot="{ field, errors }"
                  v-model="time.noActiveMinute"
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
                    <div class="styleError text-errors">
                      {{ errors[0] }}
                    </div>
                  </div>
                </Field>
                <Field
                  v-slot="{ field, errors }"
                  v-model="time.noActiveSecond"
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
                    <div class="styleError text-errors">
                      {{ errors[0] }}
                    </div>
                  </div>
                </Field>
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
                @change="changeType($event, 'isAnswerTheQuestion')"
              />
            </div>
          </div>
        </vcol>
      </VRow>
      <div v-if="conditionComplete.isAnswerTheQuestion">
        <div class="text-medium-lg">
          {{ t('list-content-req') }}
        </div>
        <CpQuestionCondition />
      </div>

      <div>
        <CpActionFooterEdit
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

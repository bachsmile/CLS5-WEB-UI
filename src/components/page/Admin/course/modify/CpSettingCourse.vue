<script setup lang="ts">
import ComboboxService from '@/api/combobox/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { validatorStore } from '@/stores/validatator'
import constant from '@/constant/constant'
import { load } from '@/stores/loadComponent.js'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import CmDateTimePicker from '@/components/common/CmDateTimePicker.vue'
import CmSelect from '@/components/common/CmSelect.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import CmRadio from '@/components/common/CmRadio.vue'
import CpActionFooterEdit from '@/components/page/gereral/CpActionFooterEdit.vue'
import toast from '@/plugins/toast'
import CourseService from '@/api/course/index'
import MethodsUtil from '@/utils/MethodsUtil'

/** LIB */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()

/** store */
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const store = load()
const { unLoadComponent } = store
const settingData = ref({
  courseStartDate: null as null | string,
  courseEndDate: null as null | string,
  registrationStartDate: null as null | string,
  registrationEndDate: null as null | string,
  isReviewExpired: false,
  isDisplayHome: false,
  certificationTemplateId: null,
  certificationDurationMonth: null,
  ratingScaleId: null,
  displayId: null,
  numberOfRemindDay: 0,
  timesOfRemind: 0,
  timeSpanByMinute: 0,
  studyTimeType: 1,
  studyTime: 0,
  point: null,
  formOfRegistration: 1,
  studyMode: 1,
  certificationId: null,
  courseId: 3589,
  organizationalStructureIds: [],
})
const optionData = reactive({
  isRegisterTime: false,
  isTimeAttend: false,
  isCertification: false,
  isRatingScale: false,
  isRemind: false,
  isAmountRemind: false,
  isTimeLearning: false,
  experiencePoint: false,
})

const schema = computed(() => ({
  ...(optionData.isRegisterTime ? { isStartTime: schemaOption.defaultString, isEndTime: schemaOption.defaultString } : {}),
  ...(optionData.isTimeAttend ? { courseStartDate: schemaOption.defaultString, courseEndDate: schemaOption.defaultString } : {}),
  ...(optionData.isTimeLearning ? { studyTime: schemaOption.defaultNumberNoReqPosNoNull } : {}),
  ...(optionData.isRemind ? { numberOfRemindDay: schemaOption.defaultNumberNoReqPosNoNull } : {}),
  ...((optionData.isRemind && optionData.isAmountRemind) ? { timesOfRemind: schemaOption.defaultNumber, timeSpanByMinute: schemaOption.defaultNumber } : {}),
  ...(optionData.isCertification ? { certificationDurationMonth: schemaOption.defaultNumber } : {}),
  ...(optionData.experiencePoint ? { point: schemaOption.defaultNumber } : {}),
}))
const comboboxCertificate = ref([])
const comboboxRatingScale = ref([])
const displayHomeOption = ref([
  { key: 1, value: t('public') },
  { key: 2, value: t('internal') },
  { key: 3, value: t('by-org') },
])

/** *******method-******* */
// danh sách chứng nhận
function getComboboxCertificate() {
  if (window._.isEmpty(comboboxCertificate.value)) {
    const params = { type: 1 }
    window.requestApiCustom(ComboboxService.GetComboboxCertificate, TYPE_REQUEST.GET, params).then((value: any) => {
      comboboxCertificate.value = value?.data || []
    })
  }
}

// danh sách thang đánh giá
async function getComboboxRatingScale() {
  if (window._.isEmpty(comboboxRatingScale.value)) {
    window.requestApiCustom(ComboboxService.GetComboboxRatingScale, TYPE_REQUEST.GET).then((value: any) => {
      comboboxRatingScale.value = value?.data || []
    })
  }
}
async function changeCheckBoxTimeLearning(state: any) {
  if (state) {
    settingData.value.studyTimeType = 1
    settingData.value.studyTime = 0
  }
  else {
    settingData.value.studyTime = 0
    settingData.value.studyTimeType = 0
  }
}
async function getSettingCourse() {
  const params = {
    id: route.params.id,
  }
  await window.requestApiCustom(CourseService.GetSettingCourse, TYPE_REQUEST.GET, params).then((value: any) => {
    settingData.value = value?.data
  })
  if (settingData.value.registrationStartDate !== null)
    optionData.isRegisterTime = true
  if (settingData.value.courseStartDate !== null)
    optionData.isTimeAttend = true
  if (settingData.value.studyTime !== null && settingData.value.studyTime > 0)
    optionData.isTimeLearning = true
  if (settingData.value.timesOfRemind !== null && settingData.value.timesOfRemind > 0)
    optionData.isRemind = true
  if (settingData.value.numberOfRemindDay !== null && settingData.value.numberOfRemindDay > 0)
    optionData.isRemind = true
  if (settingData.value.timesOfRemind !== null && settingData.value.timesOfRemind > 0)
    optionData.isAmountRemind = true
  if (settingData.value.ratingScaleId !== null) {
    getComboboxRatingScale()
    optionData.isRatingScale = true
  }
  if (settingData.value.certificationTemplateId && settingData.value.certificationTemplateId !== null && settingData.value.certificationTemplateId !== 0) {
    optionData.isCertification = true
    getComboboxCertificate()
  }
  if (!settingData.value.studyTimeType && optionData.isTimeLearning)
    settingData.value.studyTimeType = 1
  if (settingData.value?.point === 0 || settingData.value?.point)
    optionData.experiencePoint = true
}

/** *************main */
const myFormSettingCourse = ref()
async function saveSetting(idx: number) {
  await myFormSettingCourse.value.validate().then(async (successSetting: any) => {
    if (successSetting.valid) {
      // nếu không chọn thời gian đăng kí
      if (optionData.isRegisterTime === false) {
        settingData.value.registrationStartDate = null
        settingData.value.registrationEndDate = null
      }
      else {
        const registrationStartDate = new Date(settingData.value.registrationStartDate || '')
        const registrationEndDate = new Date(settingData.value.registrationEndDate || '')
        if (registrationEndDate <= registrationStartDate) {
          toast('WARNING', t('time-register-invalid'))
          return
        }
        const courseEndDate = new Date(settingData.value.courseEndDate || '')
        if (settingData.value?.courseEndDate && registrationEndDate > courseEndDate) {
          toast('WARNING', t('time-register-invalid-end'))
          return
        }
      }

      // không lựa chọn thời gian tham gia học
      if (optionData.isTimeAttend === false) {
        settingData.value.courseStartDate = null
        settingData.value.courseEndDate = null
      }
      else { // lựa chọn thời gian tham gia học
        const courseStartDate: any = new Date(settingData.value.courseStartDate || '')
        const courseEndDate: any = new Date(settingData.value.courseEndDate || '')
        if (courseEndDate <= courseStartDate) {
          toast('WARNING', t('time-learn-invalid'))
          return
        }
        if (optionData.isTimeLearning === true) {
          const timeAttent = parseInt(settingData.value.studyTime.toString(), 10)

          // Nếu thời gian học lớn hơn thời gian diễn ra khóa học
          if (!isNaN(timeAttent) && ((courseEndDate - courseStartDate) < timeAttent * 24 * 3600 * 1000)) {
            toast('WARNING', t('time-study-invalid'))
            return
          }
        }
      }

      // không lựa chọn thời gian học
      if (optionData.isTimeLearning !== true) {
        settingData.value.studyTime = 0
        settingData.value.studyTimeType = 0
      }

      // không lựa chọn Nhắc nhở trước khi hết hạn
      if (optionData.isRemind !== true) {
        settingData.value.numberOfRemindDay = 0
        settingData.value.timesOfRemind = 0
        settingData.value.timeSpanByMinute = 0
      }
      if (optionData.isAmountRemind !== true) {
        settingData.value.numberOfRemindDay = 0
        settingData.value.certificationDurationMonth = null
      }

      // không lựa chọn Cấp chứng nhận
      if (optionData.isCertification !== true)
        settingData.value.certificationTemplateId = null

      // không lựa chọn thang đánh giá
      if (optionData.isRatingScale !== true)
        settingData.value.ratingScaleId = null

      // không lựa chọn điểm kinh nghiệm
      if (!optionData.experiencePoint)
        settingData.value.point = null

      await window.requestApiCustom(CourseService.PostUpdateSettingCourse, TYPE_REQUEST.POST, settingData.value).then((value: any) => {
        toast('SUCCESS', t(value?.message))
        unLoadComponent(idx)
      }).catch((error: any) => {
        if (error?.response?.data?.errors?.length > 0)
          toast('ERROR', t(window.getErrorsMessage(error?.response?.data?.errors, t)))
      })
    }
    else { unLoadComponent(idx) }
  })
}
function handleCancle() {
  router.push({ name: 'course' })
}

getSettingCourse()
</script>

<template>
  <div class="setting-course mt-7">
    <Form
      ref="myFormSettingCourse"
      :validation-schema="schema"
    >
      <!-- Cài đặt thiết lập -->
      <VRow>
        <VCol>
          <div class="text-semibold-md color-text-900">
            {{ t('setting-register') }}
          </div>
        </VCol>
      </VRow>
      <!-- Thời gian đăng ký -->
      <VRow :class="{ 'pb-2': !optionData.isRegisterTime }">
        <VCol>
          <CmCheckBox
            v-model:model-value="optionData.isRegisterTime"
            :label="t('time-register')"
          />
        </VCol>
      </VRow>
      <VRow
        v-if="optionData.isRegisterTime"
        class="ml-4 pb-2"
      >
        <VCol
          cols="12"
          md="4"
          sm="6"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="settingData.registrationStartDate"
            name="isStartTime"
            type="text"
          >
            <CmDateTimePicker
              :model-value="settingData.registrationStartDate"
              :max-date="settingData.registrationEndDate"
              :field="field"
              :errors="errors"
              :text="`${t('start-day')}*`"
              :placeholder="t('start-day')"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          md="4"
          sm="6"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="settingData.registrationEndDate"
            name="isEndTime"
            type="text"
          >
            <CmDateTimePicker
              :model-value="settingData.registrationEndDate"
              :field="field"
              :errors="errors"
              :text="`${t('to-day')}*`"
              :placeholder="t('to-day')"
            />
          </Field>
        </VCol>
      </VRow>
      <!-- Thời gian diễn ra khóa học -->
      <VRow :class="{ 'pb-2': !optionData.isTimeAttend }">
        <VCol>
          <CmCheckBox
            v-model:model-value="optionData.isTimeAttend"
            :label="t('time-attend-course')"
          />
        </VCol>
      </VRow>
      <VRow
        v-if="optionData.isTimeAttend"
        class="ml-4 pb-2"
      >
        <VCol
          cols="12"
          md="4"
          sm="6"
        >
          <Field
            v-slot="{ field, errors }"
            :model-value="settingData.courseStartDate"
            name="courseStartDate"
            type="text"
          >
            <CmDateTimePicker
              v-model="settingData.courseStartDate"
              :max-date="settingData.courseEndDate"
              :field="field"
              :errors="errors"
              :text="`${t('start-day')}*`"
              :placeholder="t('start-day')"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          md="4"
          sm="6"
        >
          <Field
            v-slot="{ field, errors }"
            :model-value="settingData.courseEndDate"
            name="courseEndDate"
            type="text"
          >
            <CmDateTimePicker
              v-model="settingData.courseEndDate"
              :min-date="settingData.courseStartDate"
              :field="field"
              :errors="errors"
              :text="`${t('to-day')}*`"
              :placeholder="t('to-day')"
            />
          </Field>
        </VCol>
      </VRow>
      <!-- Không cho phép học viên xem lại khóa học khi hết hạn -->
      <VRow class="pb-2">
        <VCol>
          <CmCheckBox
            v-model:model-value="settingData.isReviewExpired"
            :label="t('no-preview')"
          />
        </VCol>
      </VRow>
      <!-- Thời gian học -->
      <VRow class="pb-2">
        <VCol class="p-0">
          <div class="d-flex">
            <CmCheckBox
              v-model:model-value="optionData.isTimeLearning"
              :label="t('learning-time')"
              @change="changeCheckBoxTimeLearning"
            />
            <div
              v-if="optionData.isTimeLearning"
              class="ml-4"
            >
              <Field
                v-slot="{ field, errors }"
                :model-value="settingData.studyTime"
                name="studyTime"
                type="number"
              >
                <div class="mr-6">
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        v-model="settingData.studyTime"
                        :field="field"
                        type="number"
                        :min="constant.MIN_NUMBER"
                        :max="constant.MAX_NUMBER"
                        :maxlength="constant.MAX_NUMBER.toString().length"
                        counter
                      />
                    </div>
                    <span class="text-regular-md text-lowercase">{{ t('day') }}</span>
                  </div>
                  <div
                    v-if="errors[0]"
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
      <VRow
        v-if="optionData.isTimeLearning"
        class="ml-7"
      >
        <VCol
          cols="12"
          class="mln-2"
        >
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="settingData.studyTimeType"
                :type="1"
                name="studyTimeType"
                :value="1"
              />
            </div>
            <div class="d-flex align-center mr-4 text-medium-md">
              <div>{{ t('from-student-start') }}</div>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow
        v-if="optionData.isTimeLearning"
        class="ml-7"
      >
        <VCol
          cols="12"
          class="mln-2"
        >
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="settingData.studyTimeType"
                :type="1"
                name="studyTimeType"
                :value="2"
              />
            </div>
            <div class="d-flex align-center text-medium-md mr-4">
              <div>{{ t('from-course-release') }}</div>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow
        v-if="optionData.isTimeLearning"
        class="ml-7"
      >
        <VCol
          cols="12"
          class="mln-2"
        >
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="settingData.studyTimeType"
                :type="1"
                name="studyTimeType"
                :value="3"
              />
            </div>
            <div class="d-flex align-center text-medium-md mr-4">
              <div>{{ t('from-register') }}</div>
            </div>
          </div>
        </VCol>
      </VRow>
      <!-- Nhắc nhở trước khi hết hạn -->
      <VRow class="pb-2">
        <VCol class="p-0">
          <div class="d-flex algin-center">
            <CmCheckBox
              v-model:model-value="optionData.isRemind"
              :label="t('remind-before-expiration')"
            />
            <div
              v-if="optionData.isRemind"
              class="ml-4"
            >
              <Field
                v-slot="{ field, errors }"
                :model-value="settingData.numberOfRemindDay"
                name="numberOfRemindDay"
                type="number"
              >
                <div class="mr-6">
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        v-model="settingData.numberOfRemindDay"
                        :field="field"
                        type="number"
                        :min="constant.MIN_NUMBER"
                        :max="constant.MAX_NUMBER"
                        :maxlength="constant.MAX_NUMBER.toString().length"
                        counter
                      />
                    </div>
                    <span class="text-regular-md text-lowercase">{{ t('day') }}</span>
                  </div>
                  <div
                    v-if="errors[0]"
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
      <VRow
        v-if="optionData.isRemind"
        class="ml-7"
      >
        <VCol
          cols="12"
          class="mln-2"
        >
          <div class="d-flex">
            <CmCheckBox
              v-model:model-value="optionData.isAmountRemind"
              :label="t('times-remind')"
            />
            <div
              v-if="optionData.isAmountRemind"
              class="d-flex"
            >
              <div
                class="ml-3"
              >
                <Field
                  v-slot="{ field, errors }"
                  :model-value="settingData.timeSpanByMinute"
                  name="timeSpanByMinute"
                  type="number"
                >
                  <div>
                    <div class="d-flex align-center">
                      <div class="mr-3 conditon-input">
                        <CmTextField
                          v-model="settingData.timeSpanByMinute"
                          :field="field"
                          type="number"
                          :min="constant.MIN_NUMBER"
                          :max="constant.MAX_NUMBER"
                          :maxlength="constant.MAX_NUMBER.toString().length"
                          counter
                        />
                      </div>
                      <span class="text-regular-md text-lowercase">{{ t('separate') }}</span>
                    </div>
                    <div
                      v-if="errors[0]"
                      class="styleError text-errors"
                    >
                      {{ t(MethodsUtil.showErrorsYub(errors)) }}
                    </div>
                  </div>
                </Field>
              </div>
              <div
                class="ml-3"
              >
                <Field
                  v-slot="{ field, errors }"
                  v-model="settingData.timesOfRemind"
                  name="timesOfRemind"
                  type="number"
                >
                  <div>
                    <div class="d-flex align-center">
                      <div class="mr-3 conditon-input">
                        <CmTextField
                          :model-value="settingData.timesOfRemind"
                          :field="field"
                          type="number"
                          :min="constant.MIN_NUMBER"
                          :max="constant.MAX_NUMBER"
                          :maxlength="constant.MAX_NUMBER.toString().length"
                          counter
                        />
                      </div>
                      <span class="text-regular-md text-lowercase">{{ t('minutes') }}</span>
                    </div>
                    <div
                      v-if="errors[0]"
                      class="styleError text-errors"
                    >
                      {{ t(MethodsUtil.showErrorsYub(errors)) }}
                    </div>
                  </div>
                </Field>
              </div>
            </div>
          </div>
        </VCol>
      </VRow>
      <!-- Cấp chứng nhận -->
      <VRow class="pb-2">
        <VCol class="p-0">
          <CmCheckBox
            v-model:model-value="optionData.isCertification"
            :label="t('certifications')"
          />
        </VCol>
      </VRow>
      <VRow
        v-if="optionData.isCertification"
        class="ml-8"
      >
        <div class="mbn-2 text-medium-sm">
          {{ t('certification-template') }}
        </div>
      </VRow>
      <VRow
        v-if="optionData.isCertification"
        class="ml-7"
      >
        <VCol
          cols="12"
          md="4"
          sm="6"
          class="mln-2"
        >
          <CmSelect
            v-model="settingData.certificationTemplateId"
            :items="comboboxCertificate"
            item-value="key"
            custom-key="value"
            :placeholder="t('choose-template-cert')"
            @open="getComboboxCertificate"
          />
        </VCol>
        <VCol
          cols="12"
          md="8"
          sm="6"
          class="d-flex align-center"
        >
          <div class="mr-4 d-flex align-center">
            {{ t('time-use') }}
          </div>
          <div>
            <div class="mr-3">
              <Field
                v-slot="{ field, errors }"
                :model-value="settingData.certificationDurationMonth"
                name="certificationDurationMonth"
                type="number"
              >
                <div class="mr-6">
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        v-model="settingData.certificationDurationMonth"
                        :field="field"
                        type="number"
                        :min="constant.MIN_NUMBER"
                        :max="constant.MAX_NUMBER"
                        :maxlength="constant.MAX_NUMBER.toString().length"
                        counter
                      />
                    </div>
                    <span class="text-regular-md text-lowercase">{{ t('month') }}</span>
                  </div>
                  <div
                    v-if="errors[0]"
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
      <!-- Thang đánh giá -->
      <VRow class="pb-2">
        <VCol class="p-0">
          <CmCheckBox
            v-model:model-value="optionData.isRatingScale"
            :label="t('rating-scale')"
          />
        </VCol>
      </VRow>
      <VRow
        v-if="optionData.isRatingScale"
        class="ml-8"
      >
        <div class="mbn-2">
          {{ t('rating-scale') }}
        </div>
      </VRow>
      <VRow
        v-if="optionData.isRatingScale"
        class="ml-7"
      >
        <VCol
          cols="12"
          md="4"
          sm="6"
          class="mln-2"
        >
          <CmSelect
            v-model="settingData.ratingScaleId"
            :items="comboboxRatingScale"
            item-value="key"
            custom-key="value"
            :placeholder="t('choose-rating-scale')"
            @open="getComboboxRatingScale"
          />
        </VCol>
      </VRow>
      <!-- Hiển thị trang chủ -->
      <VRow class="pb-2">
        <VCol class="p-0">
          <CmCheckBox
            v-model:model-value="settingData.isDisplayHome"
            :label="t('is-display-home')"
          />
        </VCol>
      </VRow>
      <VRow
        v-if="settingData.isDisplayHome"
        class="ml-8"
      >
        <div class="mbn-2">
          {{ t('type-display') }}
        </div>
      </VRow>
      <VRow
        v-if="settingData.isDisplayHome"
        class="ml-7"
      >
        <VCol
          cols="12"
          md="4"
          sm="6"
          class="mln-2"
        >
          <CmSelect
            v-model="settingData.displayId"
            :items="displayHomeOption"
            item-value="key"
            custom-key="value"
            :placeholder="t('choose-type-display')"
          />
        </VCol>
      </VRow>
      <!-- Tính điểm kinh nghiệm theo thời gian học -->
      <VRow class="pb-2">
        <VCol class="p-0">
          <div class="d-flex">
            <CmCheckBox
              v-model:model-value="optionData.experiencePoint"
              :label="t('calculating-experience-points')"
            />
            <div
              v-if="optionData.experiencePoint"
              class="ml-4"
            >
              <Field
                v-slot="{ field, errors }"
                :model-value="settingData.point"
                name="point"
                type="number"
              >
                <div class="mr-6">
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        v-model="settingData.point"
                        :field="field"
                        type="number"
                        :min="constant.MIN_NUMBER"
                        :max="constant.MAX_NUMBER"
                        :maxlength="constant.MAX_NUMBER.toString().length"
                        counter
                      />
                    </div>
                    <span class="text-regular-md text-lowercase">{{ t('point') }} / {{ t('minutes') }}</span>
                  </div>
                  <div
                    v-if="errors[0]"
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
      <!-- Hình thức học viên đăng kí tham gia khóa học -->
      <VRow class="pb-2">
        <VCol>
          <div class="text-semibold-md color-text-900">
            {{ t('register-form') }}
          </div>
        </VCol>
      </VRow>
      <VRow
        class="ml-1"
      >
        <VCol
          cols="12"
          class="mln-2"
        >
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="settingData.formOfRegistration"
                :type="1"
                name="formOfRegistration"
                :value="1"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ t('from-student-start') }}</div>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow
        class="ml-1"
      >
        <VCol
          cols="12"
          class="mln-2"
        >
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="settingData.formOfRegistration"
                :type="1"
                name="formOfRegistration"
                :value="2"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ t('registration-requires-moderation') }}</div>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow
        class="ml-1"
      >
        <VCol
          cols="12"
          class="mln-2"
        >
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="settingData.formOfRegistration"
                :type="1"
                name="formOfRegistration"
                :value="3"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ t('not-allow-register') }}</div>
            </div>
          </div>
        </VCol>
      </VRow>
      <!-- Hình thức học viên đăng kí tham gia khóa học -->
      <VRow class="pb-2">
        <VCol>
          <div class="text-semibold-md color-text-900">
            {{ t('study-mode') }}
          </div>
        </VCol>
      </VRow>
      <VRow
        class="ml-1"
      >
        <VCol
          cols="12"
          class="mln-2"
        >
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="settingData.studyMode"
                :type="1"
                name="studyMode"
                :value="1"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ t('study-out-of-order') }}</div>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow
        class="ml-1"
      >
        <VCol
          cols="12"
          class="mln-2"
        >
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="settingData.studyMode"
                :type="1"
                name="studyMode"
                :value="2"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ t('learn-by-order') }}</div>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow
        class="ml-1"
      >
        <VCol
          cols="12"
          class="mln-2"
        >
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="settingData.studyMode"
                :type="1"
                name="studyMode"
                :value="3"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ t('conditional-study') }}</div>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <CpActionFooterEdit
            is-cancel
            is-save
            :title-cancel="t('cancel-title')"
            :title-save="t('save')"
            @on-save="saveSetting"
            @on-cancel="handleCancle"
          />
        </VCol>
      </VRow>
    </Form>
  </div>
</template>

<style lang="scss">
.conditon-input{
  min-width: 100px;
}
</style>

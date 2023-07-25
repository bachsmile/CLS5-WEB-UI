<!-- eslint-disable indent -->
<script setup lang="ts">
import { contentTypeVideoManagerStore } from '@/stores/admin/course/type/contentVideoTypeModify'
import { validatorStore } from '@/stores/validatator'
import { load } from '@/stores/loadComponent.js'
import { configStore } from '@/stores/index'
import CpConditionCompleted from '@/components/page/gereral/CpConditionCompleted.vue'

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
const storeContentVideoTypeModifyManager = contentTypeVideoManagerStore()
const { conditionComplete, testConfig, timeComplete, isViewDetail, isNumberPerPage, isShowRandom, isTimeOfWork, isAutoLog, isAllowRetake, minuteWork, secondWork } = storeToRefs(storeContentVideoTypeModifyManager)
const { fetchConditionComplete } = storeContentVideoTypeModifyManager

const configControl = configStore()
const { settingDefaults } = storeToRefs(configControl)

/** state */

/** method */
onMounted(async () => {
  if (!window._.isEmpty(conditionComplete))
    await fetchConditionComplete(Number(route.params.contentId))

  await console.log(conditionComplete.value)
})

/** state */
const LABEL = Object.freeze({
  TITLE1: t('setting-time'),
  LABEL1: t('click-complete'),
  LABEL2: t('befor-time'),
  LABEL3: t('attendance-time'),
  LABEL4: t('anwser-question'),
})

const isHaveConfig = ref(false)

const time = ref({
  minuteTime: 0,
  secondTime: 0,
  noActiveMinute: 0,
  noActiveSecond: 0,
  noticeMinute: 0 as any,
  noticeSecond: 0 as any,
})
</script>

<template>
  <div class="mt-6">
    <CpConditionCompleted
      v-model:isHaveConfig="isHaveConfig"
      v-model:isNumberPerPage="isNumberPerPage"
      v-model:isShowRandom="isShowRandom"
      v-model:isTimeOfWork="isTimeOfWork"
      v-model:minuteWork="minuteWork"
      v-model:isViewDetail="isViewDetail"
      v-model:timeComplete="timeComplete"
      v-model:timeData="time"
      v-model:testConfigModel="testConfig"
      v-model:conditionCompleteData="conditionComplete"
      route-back="course-edit"
      :params-route="{ params: { id: Number(route.params.id) }, query: { tab: 'content' } }"
    />
  </div>
</template>

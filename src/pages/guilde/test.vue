<script lang="ts" setup>
import CmButton from '@/components/common/CmButton.vue'
import CpConfiguration from '@/components/page/gereral/CpConfiguration.vue'

// import CpQuestionListCondition from '@/components/page/gereral/CpQuestionListCondition.vue'

// import CpConditionCompleted from '@/components/page/gereral/CpConditionCompleted.vue'

import CpCondition from '@/components/page/gereral/CpCondition.vue'
import type { Any } from '@/typescript/interface'

const { t } = window.i18n()

const headers = [
  { text: '', value: 'checkbox', width: 50 },
  { text: t('content'), value: 'name' },
  { text: t('author'), value: 'author', type: 'custom' },
  { text: t('status-name'), value: 'statusName', type: 'custom' },
]

const items = ref([
  {
    id: 1,
    name: 'Nội dung 1',
    firstName: '1',
    lastName: 'win',
    statusId: 1,
    statusName: 'QuestionService.ExamActive',
  },
])
const abc = ref()
function abcd() {
  console.log(abc.value)
}
const isStartTime = ref(false)
const isEndTime = ref(false)
const isShowContentReq = ref(true)
const selected = ref<Any[]>([])
const dateTimeStart = ref<any>(null)
const dateTimeEnd = ref<any>(null)

// watchEffect(() => {
//   console.log('isStartTime', isStartTime.value)
//   console.log('isEndTime', isEndTime.value)
//   console.log('isShowContentReq', isShowContentReq.value)
//   console.log('selected', selected.value)
//   console.log('dateTimeStart', dateTimeStart.value)
//   console.log('dateTimeEnd', dateTimeEnd.value)
// })

/** ============================================================= */
const conditionComplete = ref({
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
  timeFinish: 0
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
const timeComplete = ref(0)
const secondWork = ref(0)
const time = ref({
  minuteTime: 0,
  secondTime: 0,
  noActiveMinute: 0,
  noActiveSecond: 0,
  noticeMinute: 0 as any,
  noticeSecond: 0 as any,
})

const isAllowRetake = ref(false)
const isAutoLog = ref(false)
const isHaveConfig = ref(false)
const isNumberPerPage = ref(false)
const isShowRandom = ref(false)
const isTimeOfWork = ref(false)
const isViewDetail = ref(false)
const minuteWork = ref(0)
const listQuestions = ref<Any[]>([])
function abc213(val: any) {
  // console.log(val)
  // console.log(testConfig.value)
}
watch(testConfig.value, val => {
  // console.log(val)
})
</script>

<template>
  <CpCondition
    ref="abc"
    v-model:date-time-end="dateTimeEnd"
    v-model:is-end-time="isEndTime"
    v-model:is-start-time="isStartTime"
    v-model:date-time-start="dateTimeStart"
    v-model:selected="selected"
    :headers="headers"
    :items="items"
    :is-show-content-req="isShowContentReq"
  />

  <!--
    <CpConditionCompleted
    v-model:listQuestions="listQuestions"
    v-model:isAllowRetake="isAllowRetake"
    v-model:isAutoLog="isAutoLog"
    v-model:isHaveConfig="isHaveConfig"
    v-model:isNumberPerPage="isNumberPerPage"
    v-model:isShowRandom="isShowRandom"
    v-model:isTimeOfWork="isTimeOfWork"
    v-model:isViewDetail="isViewDetail"
    v-model:minuteWork="minuteWork"
    v-model:conditionCompleteData="conditionComplete"
    v-model:time="time"
    v-model:secondWork="secondWork"
    v-model:timeComplete="timeComplete"
    @update:conditionCompleteData="abc213"
    @update:timeData="abc213"
    />
  -->
  <!-- <CpQuestionListCondition v-model:items="listQuestions" /> -->
  <CpConfiguration
    v-model:testConfigModel="testConfig"
    :total-question="12"
  />
  <CmButton
    title="hello"
    @click="abc213"
  />
</template>

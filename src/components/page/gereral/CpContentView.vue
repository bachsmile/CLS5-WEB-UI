<script setup lang="ts">
import CpSingleChoiceView from '@/components/page/Admin/content/question/question-view/CpSingleChoiceView.vue'
import CpMultiChoiseView from '@/components/page/Admin/content/question/question-view/CpMultiChoiseView.vue'
import CpUnderlinedView from '@/components/page/Admin/content/question/question-view/CpUnderlinedView.vue'
import CpTrueFalseView from '@/components/page/Admin/content/question/question-view/CpTrueFalseView.vue'
import CpClauseTrueFalseView from '@/components/page/Admin/content/question/question-view/CpClauseTrueFalseView.vue'
import CpEssayView from '@/components/page/Admin/content/question/question-view/CpEssayView.vue'
import CpMatchingView from '@/components/page/Admin/content/question/question-view/CpMatchingView.vue'
import CpFillBlankView from '@/components/page/Admin/content/question/question-view/CpFillBlankView.vue'
import CpFillBlank2View from '@/components/page/Admin/content/question/question-view/CpFillBlank2View.vue'

// survey
import CpSingleChoiseSvView from '@/components/page/Admin/content/survey/survey-view/CpSingleChoiseSvView.vue'
import CpMultiChoiseSvView from '@/components/page/Admin/content/survey/survey-view/CpMultiChoiseSvView.vue'
import CpRangeSvView from '@/components/page/Admin/content/survey/survey-view/CpRangeSvView.vue'
import CpEvaluateSvView from '@/components/page/Admin/content/survey/survey-view/CpEvaluateSvView.vue'
import CpEssaySvView from '@/components/page/Admin/content/survey/survey-view/CpEssaySvView.vue'
import CpMatrixSingleSvView from '@/components/page/Admin/content/survey/survey-view/CpMatrixSingleSvView.vue'
import CpMatrixMultiSvView from '@/components/page/Admin/content/survey/survey-view/CpMatrixMultiSvView.vue'

const props = withDefaults(defineProps<Props>(), ({
  type: 1,
  showContent: true,
  showMedia: true,
  showAnswerTrue: false,
  isSurvey: false,
  disabled: false,
  isReview: false,
  isShuffle: false,
  isSentence: false,
  isShowAnsTrue: false,
  isShowAnsFalse: false,
  isHideNotChoose: false,
}))
const emit = defineEmits<Emit>()
const { t } = window.i18n()
interface Emit {
  (e: 'loaded'): void
  (e: 'update:isAnsweredGroup', val?: any): void
}

/**
 * Xem chi tiết các loại câu hỏi
 */
interface question {
  content: string
  [name: string]: any
}
interface Props {
  type: number
  data: question
  showContent: boolean
  showMedia: boolean
  showAnswerTrue: boolean
  isSurvey?: boolean
  disabled?: boolean
  isReview?: boolean
  maxWidth?: number
  listCurrentId?: number // vị trí hiện thị của danh sách đám án click câu đk loại 2
  isShuffle?: boolean // cờ  hiện thị nút xáo trộn
  isSentence?: boolean // cờ  hiện thị thông tin dạng câu x
  isShowAnsTrue?: boolean // cờ  hiện thị đáp án đúng
  isShowAnsFalse?: boolean // cờ  hiện thị đáp án sai
  isHideNotChoose?: boolean // cờ tắt hiện thị đáp án đúng khi chưa chọn
  numberQuestion?: number | string // số thứ tự câu hỏi
  totalPoint?: number // tong diem
  isGroup?: boolean
}
const dataValue = ref()
function checkTypeQuestion() {
  switch (props.type) {
    case 1:
      return CpSingleChoiceView

    case 2:
      return CpMultiChoiseView

    case 3:
      return CpUnderlinedView

    case 4:
      return CpTrueFalseView

    case 5:
      return CpClauseTrueFalseView

    case 6:
      return CpFillBlankView

    case 7:
      return CpFillBlank2View

    case 8:
      return CpMatchingView

    case 9:
      return CpEssayView

    default:
      return CpSingleChoiceView
  }
}
function checkTypeSurvey() {
  switch (props.type) {
    case 1:
      return CpSingleChoiseSvView

    case 2:
      return CpMultiChoiseSvView

    case 3:
      return CpEssaySvView

    case 4:
      return CpRangeSvView

    case 5:
      return CpEvaluateSvView

    case 6:
      return CpMatrixSingleSvView

    case 7:
      return CpMatrixMultiSvView

    default:
      return CpSingleChoiseSvView
  }
}
function updateAnswered(value: any, data: any) {
  if (props.isGroup)
    emit('update:isAnsweredGroup', value)
  else
    dataValue.value.isAnswered = value
}
onMounted(() => {
  emit('loaded')
})
watch(() => props.data, (val: any) => dataValue.value = val, { immediate: true })
</script>

<template>
  <div class="w-100">
    <Component
      :is="isSurvey ? checkTypeSurvey() : checkTypeQuestion()"
      v-if="!dataValue?.isGroup || isSurvey"
      v-model:data="dataValue"
      class="mb-8"
      :show-content="showContent"
      :show-media="showMedia"
      :show-answer-true="showAnswerTrue"
      :list-current-id="listCurrentId"
      :max-width="maxWidth"
      :disabled="disabled"
      :number-question="numberQuestion"
      :point="dataValue.unitPoint"
      :total-point="totalPoint"
      :is-review="isReview"
      :is-shuffle="isShuffle"
      :is-sentence="isSentence"
      :is-show-ans-true="isShowAnsTrue"
      :is-show-ans-false="isShowAnsFalse"
      :is-hide-not-choose="isHideNotChoose"
      @update:isAnswered="($value) => updateAnswered($value, dataValue)"
    />
    <div v-else-if="dataValue?.isGroup">
      <div>
        <div class="mb-1">
          <div>
            {{ t('general-request') }}
          </div>
          <div v-html="dataValue.content" />
        </div>
        <div
          v-for="(qsItem, index) in dataValue?.questions"
          :key="qsItem.id"
          class="mb-5"
        >
          <CpContentView
            :type="qsItem.typeId"
            :data="qsItem"
            :show-media="false"
            :show-content="true"
            :number-question="`${numberQuestion}.${index + 1}`"
            :disabled="disabled || isReview"
            :is-review="isReview"
            :total-point="totalPoint"
            :is-sentence="isSentence"
            :is-show-ans-false="isReview"
            :is-show-ans-true="isReview"
            :show-answer-true="showAnswerTrue"
            :list-current-id="listCurrentId"
            :max-width="maxWidth"
            :is-shuffle="isShuffle"
            :is-hide-not-choose="isHideNotChoose"
          />
        </div>
      </div>
    </div>
  </div>
</template>

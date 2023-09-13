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
  maxWidth?: number
  listCurrentId?: number // vị trí hiện thị của danh sách đám án click câu đk loại 2
}
const props = withDefaults(defineProps<Props>(), ({
  type: 1,
  showContent: true,
  showMedia: true,
  showAnswerTrue: true,
  isSurvey: false,
  disabled: false,
}))

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
</script>

<template>
  <div class="w-100">
    <Component
      :is="isSurvey ? checkTypeSurvey() : checkTypeQuestion()"
      v-if="!data?.isGroup || isSurvey"
      :data="data"
      :show-content="showContent"
      :show-media="showMedia"
      :show-answer-true="showAnswerTrue"
      :list-current-id="listCurrentId"
      :max-width="maxWidth"
      :disabled="disabled"
    />
    <div v-else-if="data?.isGroup">
      <div
        v-for="qsItem in data?.questions"
        :key="qsItem.id"
        class="mb-5"
      >
        <CpContentView
          :type="qsItem.typeId"
          :data="qsItem"
          :show-media="false"
        />
      </div>
    </div>
  </div>
</template>

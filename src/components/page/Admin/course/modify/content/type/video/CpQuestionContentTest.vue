<script setup lang="ts">
import CmTextField from '@/components/common/CmTextField.vue'

interface Props {
  data: any
  questions: any
  questionIndex: number
}
const props = withDefaults(defineProps<Props>(), ({
}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update:question', question: any, id: number): void
}
const dataContentQuestion = ref()
const isViewDetail = ref()

function expanded(value: any) {
  // const question = JSON.parse(JSON.stringify(this.questions[this.data.originalIndex]))
  // question.expanded = !question.expanded
  // this.questions[this.data.originalIndex] = question
  // this.$set(this.questions, this.data.originalIndex, question)
  if (dataContentQuestion.value) {
    dataContentQuestion.value.expanded = true
    dataContentQuestion.value.listQuestions.forEach((question: any) => {
      if (question.questionTypeId === 6 && question.content) {
        const div = document.createElement('div')
        div.innerHTML = question.content
        const fillblanks: any = div.getElementsByClassName('answer-fill-blank') || []
        let i = 1

        fillblanks?.forEach((element: any) => {
          element.innerHTML = `( ${i} )`
          i += 1
        })
        question.content = div.innerHTML
      }
      else if (question.questionTypeId === 7 && question.content) {
        const div = document.createElement('div')
        div.innerHTML = question.content
        const fillblanks: any = div.getElementsByClassName('answer-select')
        let i = 1

        fillblanks.forEach((element: any) => {
          element.innerHTML = `( ${i} )`
          i += 1
        })
        question.content = div.innerHTML
      }
    })
  }

  // this.questions = this.$set(this.questions[dataContentQuestion.value.originalIndex], 'expanded', !this.questions[dataContentQuestion.value.originalIndex].expanded)
}
function showContentAnswer() {
  dataContentQuestion.value.expanded = false
  emit('update:question', false, dataContentQuestion.value.originalIndex)
}
function getAmountWord(data: any, number: any) {
  if (data) {
    const strs = data.split(' ')
    if (strs.length > number) {
      let str = ''
      const newStrs = strs.slice(0, number)
      for (let i = 0; i < number; i += 1) {
        str += newStrs[i]
        if (i !== number - 1)
          str += ' '
      }
      str += '...'
      return str
    }
  }

  return data
}

// điểm số thay đổi
function pointChange(point: any, data: any, index: number) {
  point = parseFloat(point)
  const question = props.questions[props.questionIndex]
  question.listQuestions[index].unitPoint = point
  let totalPoint = 0
  question.listQuestions.forEach((element: any) => {
    totalPoint += parseFloat(element.unitPoint)
  })
  question.unitPoint = totalPoint
  question.isEdit = true
}

function getComponent(data: any) {
  switch (data.questionTypeId) {
    case 1:
      return 'single-choice'
    case 2:
      return 'multiple-choice'
    case 3:
      return 'underlined'
    case 4:
      return 'choice-true-false'
    case 5:
      return 'clause-true-false'
    case 6:
      return 'fill-in-the-gap'
    case 7:
      return 'fill-select'
    case 8:
      return 'pairing'
    case 9:
      return 'essay'
    default:
      return 'single-choice'
  }
}
</script>

<template>
  <div
    class="question-test-content"
  >
    <div
      v-if="dataContentQuestion.expanded === false"
      @click="expanded(true)"
    >
      <span>
        {{ dataContentQuestion.isQuestionGroup === true ? getAmountWord(dataContentQuestion.contentBasic, 15) : getAmountWord(dataContentQuestion.listQuestions[0].contentBasic, 15) }}
      </span>
      <VIcon :icon="dataContentQuestion.expanded === true ? 'tabler:chevrons-up' : 'tabler:chevrons-down'" />
    </div>
    <div v-else>
      <div
        v-if="dataContentQuestion.isQuestionGroup === true"
        class="mb-2"
      >
        <span class="font-weight-600">{{ dataContentQuestion.questionGroupContentBasic }}</span>
      </div>
      <template
        v-for="(item, index) in dataContentQuestion.listQuestions"
      >
        <div
          v-if="dataContentQuestion.listQuestions.length > 1"
          :key="index"
          class="d-flex align-items-center"
        >
          <div class="content-input">
            <CmTextField
              v-model="item.unitPoint"
              :disabled="isViewDetail === true"
              class="score"
              type="number"
              @change="pointChange($event, data, index)"
            />
          </div>
          <div class="content-question">
            <Component
              :is="getComponent(item)"
              :data="item"
              :show-content-answer="showContentAnswer"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

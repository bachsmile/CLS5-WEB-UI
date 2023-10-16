<script setup lang="ts">
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'
import CmBadge from '@/components/common/CmBadge.vue'
import CmButton from '@/components/common/CmButton.vue'

/// /////////////////////////////Khởi tạo////////////////////////////////////

/**
 * Xem chi tiết các loại câu hỏi
 */

interface question {
  content: string
  answers: Array<any>
  answersClone: Array<any>
  [name: string]: any
}
interface Props {
  data: question
  isGroup?: boolean
  showContent: boolean
  showMedia: boolean
  showAnswerTrue: boolean
  disabled?: boolean // trạng thái chọn
  isShuffle?: boolean
  isShowAnsTrue: boolean // hiện thị câu đúng
  isShowAnsFalse: boolean // hiện thị câu sai
  isSentence?: boolean // trạng thái câu
  isHideNotChoose?: boolean // ẩn hiện thị đáp án các câu không chọn
  typeShow?: number // trạng thái hiện thị
  numberQuestion?: number | null
  totalPoint?: number | null
  point?: number | null
  customKeyValue?: string
  isReview?: boolean
}
const props = withDefaults(defineProps<Props>(), ({
  data: () => ({
    content: '',
    answers: [],
    answersClone: [],
  }),
  showContent: true,
  showMedia: true,
  showAnswerTrue: true,
  disabled: false,
  isShuffle: true,
  isSentence: false,
  isShowAnsTrue: false,
  isShowAnsFalse: false,
  isHideNotChoose: false,
  isReview: false,
  numberQuestion: 0,
  totalPoint: 0,
  point: 0,
  customKeyValue: 'answeredValue',
}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update:model-value', val: any): void
  (e: 'update:data', val: any): void
  (e: 'saveLocalData', val: any): void
  (e: 'update:isAnswered', val: any): void

}
const { t } = window.i18n()

function getIndex(position: number) {
  return `${String.fromCharCode(65 + position - 1)}.`
}
const questionValue = ref(window._.cloneDeep(props.data))

const contentBlank = ref()
function formatDataInit() {
  const result = ref(questionValue.value.content)

  // Chuỗi ban đầu
  // Lấy tất cả các phần tử <span> có class="answer-fill-blank"
  // Tạo một phần tử tạm thời để chứa chuỗi HTML
  const tempElement = document.createElement('div')
  tempElement.innerHTML = questionValue.value.content

  // Lấy tất cả các phần tử <span> có class="answer-fill-blank"
  const spanElements = tempElement.querySelectorAll('span.answer-fill-blank')

  // Lặp qua từng phần tử và xóa nội dung bên trong
  console.log(spanElements)
  spanElements.forEach((spanElement: any, index: number) => {
    const ans = questionValue.value.answers.find((item: any) => item.answeredValue === index + 1)
    if (!window._.isEmpty(ans)) {
      spanElement.innerHTML = props.showAnswerTrue ? `<span >${questionValue.value?.answerBlank[index]?.content}</span>` : `<span>${ans.content}</span>`
      spanElement.setAttribute('data-answer', ans.id)
    }
    else { spanElement.innerHTML = props.showAnswerTrue ? `<span >${questionValue.value?.answerBlank[index]?.content}</span>` : '<span class="chooseAnsPld">Lựa chọn</span>' }
  })

  // Lấy chuỗi HTML đã chỉnh sửa từ phần tử tạm thời
  result.value = tempElement.innerHTML
  return result.value
}

/// ///////////////////////////Thêm Event vào blank//////////////////////////////////////
const contentBlankRef1 = ref()

function attachClickEvent() {
  nextTick(() => {
    const answerSpans = contentBlankRef1.value?.querySelectorAll('.answer-fill-blank')
    answerSpans?.forEach((span: any, pos: number) => {
      if (!props.isReview && !props.disabled) {
        span.addEventListener('click', ($event: any) => handleSpanClick($event))
        span.addEventListener('dragover', ($event: any) => handleSpanDragover($event))
        span.addEventListener('dragleave', ($event: any) => handleSpanDragleave($event))
        span.addEventListener('drop', ($event: any) => handleSpanDrop($event))
      }
    })
  })
}

function handleSpanClick(event: any) {
  const dataAnswer: any = event.currentTarget.getAttribute('data-answer')
  if (dataAnswer && dataAnswer !== null) {
    const dragItem: any = document.getElementById(`answer${dataAnswer}`)
    if (dragItem.classList.contains('droped'))
      dragItem.classList.remove('droped')

    event.currentTarget.removeAttribute('data-answer')
    event.currentTarget.innerHTML = '<span class="chooseAnsPld">Lựa chọn</span>'
    saveDataLocal()
  }
}
function handleSpanDragover(event: any) {
  event.preventDefault()
  if (!event.target.classList.contains('hover'))
    event.target.classList.add('hover')
}
function handleSpanDragleave(event: any) {
  event.preventDefault()
  if (event.target.classList.contains('hover'))
    event.target.classList.remove('hover')
}
function handleSpanDrop(event: any) {
  const dataTrangferId = event.dataTransfer
    .getData('sourceId')
    .replace('drag', '')
  const contain = event.target.closest('.fill-blank-container')
  if (contain) {
    let dataAnswer: any = null
    if (event.target.className === 'hover')
      dataAnswer = event.target.parentNode.getAttribute('data-answer')
    else
      dataAnswer = event.target.getAttribute('data-answer')

    // const dropContent = event.target.innerHTML
    const className = event.target.className.split(' ')
    let targetFillBlank: any = ''
    if (!className.includes('answer-fill-blank')) {
      targetFillBlank = event.target.closest('.answer-fill-blank')
    }
    else {
      // gán attribute data-answer là id của đáp án
      targetFillBlank = event.target
    }
    targetFillBlank.setAttribute('data-answer', dataTrangferId)
    targetFillBlank.classList.remove('hover')
    setTimeout(() => {
      let dragItem: any = document.getElementById(`answer${dataTrangferId}`)
      if (dragItem) {
        targetFillBlank.innerHTML = dragItem.innerHTML
        if (!dragItem.classList.contains('droped'))
          dragItem.classList.add('droped')
      }
      if (dataAnswer && dataAnswer !== null) {
        dragItem = document.getElementById(`answer${dataAnswer}`)
        if (dragItem.classList.contains('droped'))
          dragItem.classList.remove('droped')
      }
    }, 0)
  }

  saveDataLocal()
}

/// ////////////////////////////Event drag///////////////////////////////////////
/* clone đối tượng kéo thêm vào đối tượng chứa */
const dragElement = ref<any>(null)
function startDrag(event: any) {
  dragElement.value = event.target.cloneNode(true)

  dragElement.value.id = `drag${dragElement.value.id.replace('answer', '')}`

  event.dataTransfer.setData('sourceId', dragElement.value.id)
}

/* kết thúc kéo thả */
function dragEnd(event: any) {
  dragElement.value.parentNode?.removeChild(dragElement.value)
  dragElement.value = null
  if (event.target.classList.contains('droped'))
    event.target.style.display = ''

  else event.target.style.display = 'inline-block'
}
function dragDelta(event: any) {
  //
}

/// ///////////////////////////Lưu///////////////////////////////////////

// lưu dữ liệu storage
const fillBlankContainer = ref()

function saveDataLocal() {
  if (props.isReview === true)
    return
  const container = fillBlankContainer.value

  questionValue.value.answers.forEach(element => {
    element.answeredValue = null
  })

  if (fillBlankContainer.value) {
    const fillItems = container.getElementsByClassName('answer-fill-blank')
    for (let i = 0; i < fillItems.length; i += 1) {
      const element = fillItems[i]
      const dataAnswer = element.getAttribute('data-answer')
      if (dataAnswer) {
        const answer = questionValue.value.answers.find(
          x => x.id === Number(dataAnswer),
        )
        if (answer)
          answer.answeredValue = i + 1
      }
    }
  }
  const answers: any[] = []

  questionValue.value.answers.forEach(element => {
    answers.push({
      id: element.id,
      value: element.answeredValue,
    })
  })
  emit('saveLocalData', {
    id: questionValue.value.questionId,
    value: answers,
    typeId: questionValue.value.questionTypeId,
  })
  questionValue.value.isAnswered = !!questionValue.value.answers.filter((item: any) => item[props.customKeyValue] !== null).length
  emit('update:isAnswered', questionValue.value.isAnswered)
  emit('update:data', questionValue.value)
}

////////////////////////////////////////////////////////////////////
function handlePinQs() {
  questionValue.value.isMark = !questionValue.value.isMark
}

watch(() => props.data, val => {
  questionValue.value = val

  // questionValue.value.answersClone = window._.cloneDeep(questionValue.value.answers)
  contentBlank.value = formatDataInit()
  attachClickEvent()
  questionValue.value.isAnswered = !!questionValue.value.answers.map((item: any) => item[props.customKeyValue] !== null).length
  emit('update:isAnswered', questionValue.value.isAnswered)
}, { immediate: true })
</script>

<template>
  <div class="content-view">
    <div
      v-if="isSentence"
      class="mb-4"
    >
      <span class="text-bold-md color-primary">{{ t('sentence') }} {{ numberQuestion }} - {{ point }}/{{ totalPoint }} {{ t('scores') }}</span>
      <CmButton
        v-if="!isGroup"
        :disabled="disabled"
        class="ml-3"
        icon="ic:round-bookmark-border"
        :color="questionValue.isMark ? 'warning' : 'secondary'"
        color-icon="white"
        is-rounded
        :size="36"
        :size-icon="20"
        @click="handlePinQs"
      />
    </div>
    <div
      ref="fillBlankContainer"
      class="fill-blank-container"
    >
      <div
        v-if="showContent"
        ref="contentBlankRef1"
        class="text-medium-md mb-5 color-text-900"
        v-html="contentBlank"
      />
      <div
        v-if="showMedia && questionValue.urlFile"
        class="flex-center"
      >
        <div
          class="view-media mb-5 "
        >
          <CpMediaContent
            :disabled="true"
            :src="questionValue.urlFile"
          />
        </div>
      </div>
      <div class="line-ans">
        <CmBadge
          v-for="(item, index) in (showAnswerTrue || !isReview && isSentence ? questionValue.answers : questionValue.answersClone)"
          :key="item.id"
          location="top right"
          color="success"
          :offset-x="20"
          :hide="!(isReview && isShowAnsTrue && item.isTrue && (!isHideNotChoose || isHideNotChoose && item[customKeyValue]))"
        >
          <template
            #badge-content
          >
            {{ item.correctAnswer }}
          </template>
          <div
            :id="`answer${item.id}`"
            class="drag-item line-blank text-regular-md "
            :draggable="!isReview && !disabled"
            :class="{
              'ansTrue': isReview && isShowAnsTrue && item.isTrue && (!isHideNotChoose || isHideNotChoose && item[customKeyValue]),
              'ansFalse': isReview && isShowAnsFalse && !item.isTrue && item[customKeyValue],
              'droped': isReview ? false : item.answeredValue === index + 1,
              'cursor-move': !isReview && !disabled,
            }"
            @dragstart="startDrag($event)"
            @drag.prevent="dragDelta"
            @dragend="dragEnd"
          >
            <div
              v-if="item"
              v-html="item.content"
            />
          </div>
        </CmBadge>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.content-view{
  .line-ans{
    display: flex;
    .line-blank{
      border-radius: 8px;
      margin-right: 16px;
      border: 1px solid rgb(var(--v-gray-300));
      padding: 10px 14px;
      display: flex;
      align-items: center;
    }
    .line-blank.ansTrue{
      border: 1px solid rgb(var(--v-success-600));
      color:rgb(var(--v-success-600));
    }
  }
  .answer-fill-blank.text-success {
    border-radius: 8px;
    border: 1px solid rgb(var(--v-success-600));
    background: #FFF;
    color:rgb(var(--v-success-600));
  }
  .answer-fill-blank.text-danger {
    border-radius: 8px;
    border: 1px solid rgb(var(--v-error-600));
    background: #FFF;
    color:rgb(var(--v-error-600));
  }
  .view-media{
    width: 60%;
  }
  .drag-item{
    &.droped {
      display: none !important;
    }
  }
}
</style>

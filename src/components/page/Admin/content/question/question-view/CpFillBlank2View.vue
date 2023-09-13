<script setup lang="ts">
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'
import CmRadio from '@/components/common/CmRadio.vue'

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
  showContent: boolean
  showMedia: boolean
  showAnswerTrue: boolean
  listCurrentId: number
}
const props = withDefaults(defineProps<Props>(), ({
  data: () => ({
    content: '',
    answers: [],
    answersClone: [],
  }),
  showContent: true,
  showMedia: true,
  showAnswerTrue: false,
  listCurrentId: 1,
}))
const { t } = window.i18n()
const listCurrent = ref(1)
function getIndex(position: number) {
  return `${String.fromCharCode(65 + position)}.`
}

const contentBlank = ref()

const contentBlankRef = ref()
const listAnserView = ref<any[]>([])

function handleSpanClick(event: any, pos: number) {
  // Xử lý sự kiện khi thẻ span được click
  listCurrent.value = pos
}
function attachClickEvent() {
  nextTick(() => {
    const answerSpans = contentBlankRef.value?.querySelectorAll('.answer-select')
    answerSpans?.forEach((span: any, pos: number) => {
      span.addEventListener('click', ($event: any) => handleSpanClick($event, pos + 1))
    })
  })
}
props.data.answers.forEach((item: any, index: number) => {
  if (!listAnserView.value[item.position])
    listAnserView.value[item.position] = [toRaw(item)]
  else
    listAnserView.value[item.position].push(item)
})
onMounted(() => {
  const result = ref(props.data.content)

  const tempElement = document.createElement('div')
  tempElement.innerHTML = props.data.content
  const spanElements = tempElement.querySelectorAll('.answer-select')

  // Lặp qua từng phần tử và xóa nội dung bên trong
  spanElements.forEach((spanElement, idx) => {
    const isTrue = listAnserView.value[idx + 1].findIndex((item: any) => item.isTrue)
    spanElement.innerHTML = ''

    spanElement.innerHTML = `<span style="display: inline-flex;" class="${!props.showAnswerTrue ? 'chooseAnsPld' : ''}">${props.showAnswerTrue ? `Đáp án ${getIndex(isTrue)}` : `Lựa chọn ${idx + 1}`} <svg xmlns="http://www.w3.org/2000/svg" style="margin-top: 5px;" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 9l6 6l6-6"></path></svg>
    </span>`
  })

  contentBlank.value = tempElement.innerHTML
  attachClickEvent()
})
watch(() => props.listCurrentId, (val: number) => {
  listCurrent.value = val
})
</script>

<template>
  <div class="content-view">
    <div
      v-if="showContent"
      ref="contentBlankRef"
      class="text-medium-md mb-5"
      v-html="contentBlank"
    />
    <div
      v-if="showMedia && data.urlFile"
      class="view-media mb-5"
    >
      <CpMediaContent
        :disabled="true"
        :src="data.urlFile"
      />
    </div>
    <div
      v-for="(item, idx) in listAnserView[listCurrent]"
      :key="item.id"
      class="item-answer w-100"
    >
      <CmRadio
        :type="1"
        :model-value="showAnswerTrue ? item.isTrue : false"
        :disabled="true"
        :name="`bl2-${data.id}`"
        :value="true"
        class="mr-3"
      />
      <div class="w-100">
        <span class="mr-1">{{ getIndex(idx) }} </span>
        <span v-html="item.content" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.content-view{
  .item-answer {
    display:flex;
    width: 100%;
    border-radius: 8px;
    border: 1px solid rgb(var(--v-gray-300));
    background: #FFF;
    padding: 1rem;
    margin-bottom: 12px;
  }
  .item-answer:last-child {
    margin-bottom: unset;
  }

  .view-media{
    width: 60%;
  }
}
</style>

<script setup lang="ts">
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'

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
}))
const { t } = window.i18n()
function getIndex(position: number) {
  return `${String.fromCharCode(65 + position - 1)}.`
}
const contentBlank = computed(() => {
  const result = ref(props.data.content)

  // Chuỗi ban đầu
  // Lấy tất cả các phần tử <span> có class="answer-fill-blank"
  // Tạo một phần tử tạm thời để chứa chuỗi HTML
  const tempElement = document.createElement('div')
  tempElement.innerHTML = props.data.content

  // Lấy tất cả các phần tử <span> có class="answer-fill-blank"
  const spanElements = tempElement.querySelectorAll('span.answer-fill-blank')

  // Lặp qua từng phần tử và xóa nội dung bên trong
  spanElements.forEach((spanElement: any, index: number) => {
    spanElement.innerHTML = props.showAnswerTrue ? `<span >${props.data?.answerBlank[index]?.content}</span>` : '<span class="chooseAnsPld">Lựa chọn</span>'
  })

  // Lấy chuỗi HTML đã chỉnh sửa từ phần tử tạm thời
  result.value = tempElement.innerHTML
  return result.value
})
</script>

<template>
  <div class="content-view">
    <div
      v-if="showContent"
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
    <div class="line-ans">
      <div
        v-for="item in (showAnswerTrue ? data.answers : data.answersClone)"
        :key="item.id"
        class="line-blank text-regular-md"
      >
        <div
          v-if="item"
          v-html="item.content"
        />
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

  }

  .view-media{
    width: 60%;
  }
}
</style>

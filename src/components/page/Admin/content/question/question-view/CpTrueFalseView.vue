<script setup lang="ts">
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'
import CmRadio from '@/components/common/CmRadio.vue'

/**
 * Xem chi tiết các loại câu hỏi
 */
interface question {
  content: string
  answers: Array<any>
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
  }),
  showContent: true,
  showMedia: true,
  showAnswerTrue: true,
}))
const { t } = window.i18n()
function getIndex(position: number) {
  return `${String.fromCharCode(65 + position - 1)}.`
}
</script>

<template>
  <div class="content-view">
    <div
      v-if="showContent"
      class="text-medium-md mb-5"
      v-html="data.content"
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
      v-for="item in 2"
      :key="item"
      class="item-answer w-100"
    >
      <CmRadio
        :type="1"
        :model-value="showAnswerTrue ? (data.answers.length ? data.answers[0].isTrue : null) : null "
        :disabled="true"
        :name="`TF-${data.id}`"
        :value="item === 1"
        class="mr-3"
      />

      <div class="w-100">
        <span class="mr-1">{{ getIndex(item) }} </span>
        <span>
          {{ item === 1 ? t('true') : t('false') }}
        </span>
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

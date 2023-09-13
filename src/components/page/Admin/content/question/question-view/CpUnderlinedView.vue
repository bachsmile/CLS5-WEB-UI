<script setup lang="ts">
import CmRadio from '@/components/common/CmRadio.vue'
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'

/**
 * Xem chi tiết các loại câu hỏi
 */
interface question {
  content: string
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
      v-for="item in data.answers"
      :key="item.id"
      class="item-answer w-100"
    >
      <CmRadio
        :type="1"
        :model-value="showAnswerTrue ? item.isTrue : false"
        :disabled="true"
        :name="`UL-${data.id}`"
        value="true"
        class="mr-3"
      />
      <div class="w-100">
        <span class="mr-1">{{ getIndex(item.position) }} </span>
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

<script setup lang="ts">
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'
import CmCheckBox from '@/components/common/CmCheckBox.vue'

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
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), ({
  data: () => ({
    content: '',
  }),
  showContent: true,
  showMedia: true,
  showAnswerTrue: true,
  disabled: false,
}))
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
      v-if="showMedia && data.urlMedia"
      class="view-media mb-5"
    >
      <CpMediaContent
        :disabled="true"
        :src="data.urlMedia"
      />
    </div>
    <div
      v-for="item in data.answers"
      :key="item.id"
      class="item-answer w-100"
    >
      <div class="mr-1">
        <CmCheckBox
          :disabled="disabled"
          :model-value="showAnswerTrue ? item.isTrue : false"
        />
      </div>

      <div class="w-100">
        <span class="mr-1">{{ getIndex(item.position) }} </span>
        <span v-html="item.content" />
        <div
          v-if="showMedia && item.urlMedia"
          class="view-media mt-2"
        >
          <CpMediaContent
            :disabled="true"
            :src="item.urlMedia"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.content-view {
  .item-answer {
    display:flex;
    width: 100%;
    padding: 1rem;
    border: 1px solid rgb(var(--v-gray-300));
    border-radius: var(--v-border-radius-xs);
    margin-bottom: 12px;
    background: #FFF;
  }

  .item-answer:last-child {
    margin-bottom: unset;
  }

  .view-media {
    width: 60%;
  }
}
</style>

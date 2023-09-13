<script setup lang="ts">
import CmRating from '@/components/common/CmRating.vue'
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { reaction } from '@/constant/data/iconList.json'

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
  maxWidth?: number
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
const indexFrom = computed(() => {
  if (props.data?.answers?.length)
    return props.data.answers[0]?.position === 0 ? props.data.answers[1]?.position + 1 : props.data.answers[1]?.position

  return 0
})

const labels = computed(() => props.data.answers.map((item: any) => item.content))
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
    <div class="d-flex align-center">
      <CmRating
        :disabled="disabled"
        :length="data?.answers?.length"
        :full-color="data?.color"
        :labels="labels"
        :max-width="maxWidth"
        :full-icon=" MethodsUtil.checkType(data.reactionId, reaction, 'value')?.fullIcon"
        :empty-icon=" MethodsUtil.checkType(data.reactionId, reaction, 'value')?.emptyIcon"
      />
    </div>
  </div>
</template>

<style lang="scss">
.content-view{

  .item-answer-range {
    display:flex;
    width:auto;
    border-radius: 8px;
    border: 1px solid rgb(var(--v-gray-300));
    background: #FFF;
    padding: 1rem;
  }
  .item-range-number{
    display: flex;
    margin-inline: auto;
    .range-item {
      padding: 0.5rem;
    }
  }

  .view-media{
    width: 60%;
  }
}
</style>

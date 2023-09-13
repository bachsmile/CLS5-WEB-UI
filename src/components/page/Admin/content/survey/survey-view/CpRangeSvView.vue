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
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), ({
  data: () => ({
    content: '',
  }),
  showContent: true,
  showMedia: true,
  showAnswerTrue: true,
  disabled: true,
}))
const indexFrom = computed(() => {
  if (props.data?.answers?.length)
    return props.data.answers[0]?.position === 0 ? props.data.answers[1]?.position + 1 : props.data.answers[1]?.position

  return 0
})
const isFromZero = computed(() => props.data.answers[0]?.position === 0)
function getIndex(position: number) {
  return `${String.fromCharCode(65 + position - 1)}.`
}
const valueRange = ref(null)
watch(() => props.data.answeredValue, val => {
  valueRange.value = val
})
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
      <div class="item-answer-range">
        <span v-html="data.answers[0].content" />
      </div>
      <div class="item-range-number">
        <div
          v-for="(item, idx) in indexFrom"
          :key="idx"
          class="range-item"
        >
          <div class="d-flex align-center justify-center">
            {{ isFromZero ? idx : item }}
          </div>
          <div class="d-flex align-center justify-center">
            <CmRadio
              :type="1"
              :model-value="showAnswerTrue || !disabled ? valueRange : null"
              :disabled="disabled"
              :name="`single-${data.id}`"
              :value="isFromZero ? idx : item"
              @update:model-value="($value: any) => valueRange = $value"
            />
          </div>
        </div>
      </div>
      <div class="item-answer-range">
        <span v-html="data.answers[1].content" />
      </div>
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

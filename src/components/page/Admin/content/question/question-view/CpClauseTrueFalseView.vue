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
    <div class="title-TF">
      <div class="text-medium-md title">
        <span>Đúng</span>
      </div>
      <div class="text-medium-md title">
        <span>Sai</span>
      </div>
    </div>
    <div
      v-for="item in data.answers"
      :key="item.id"
      class="item-answer-group w-100"
    >
      <CmRadio
        :type="1"
        :model-value="showAnswerTrue ? item.isTrue : null"
        :disabled="true"
        :name="`clauseTF${item.position}-${data.id}`"
        :value="true"
        class="mr-7"
      />
      <CmRadio
        :type="1"
        :model-value="showAnswerTrue ? item.isTrue : null"
        :disabled="true"
        :name="`clauseTF${item.position}-${data.id}`"
        :value="false"
        class="mr-3"
      />
      <div class="answer-item d-flex justify-space-between">
        <div>
          <div>
            <span class="mr-1">{{ getIndex(item.position) }} </span>
            <span v-html="item.content" />
          </div>
          <div
            v-if="showMedia"
            class="view-media mt-2"
          >
            <CpMediaContent
              :disabled="true"
              :src="item.urlFile"
            />
          </div>
        </div>
        <div :title="item?.isShuffle ? t('allowed-shuffle') : t('not-allowed-shuffle')">
          <VIcon
            icon="iconamoon:playlist-shuffle-light"
            :size="20"
            :color="item?.isShuffle ? 'primary' : ''"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.content-view{
  .title-TF{
    .title{
      width: 50px;
    }
    display:flex;
    margin-bottom: 20px;
    color:rgb(var(--v-gray-900));
  }
.item-answer-group{
  display:flex;
  margin-bottom: 12px;
  .answer-item {
    width: 100%;
    border-radius: 8px;
    border: 1px solid rgb(var(--v-gray-300));
    background: #FFF;
    padding: 1rem;
  }
  .answer-item:last-child {
    margin-bottom: unset;
  }
}
  .view-media{
    width: 60%;
  }
}
</style>

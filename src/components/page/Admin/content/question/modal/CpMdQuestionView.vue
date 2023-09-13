<script setup lang="ts">
import CmDialogs from '@/components/common/CmDialogs.vue'
import CpContentView from '@/components/page/gereral/CpContentView.vue'

const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
})

const emit = defineEmits<Emit>()

interface Props {
  isShowModal: boolean
  data?: any
}
interface Emit {
  (e: 'update:isShowModal', value: any): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

/**
 * store
 */

/** setting validate */

/** state */
/** method */
async function onCancel() {
  emit('update:isShowModal', false)
}
async function onConfirm() {
  //
}

watch(() => props.isShowModal, isShow => {
//
})
</script>

<template>
  <div class="view-content">
    <CmDialogs
      :title="t('preview')"
      :is-dialog-visible="isShowModal"
      close-on-back
      is-hide-footer
      @cancel="onCancel"
      @confirm="onConfirm"
    >
      <div v-if="data.typeId !== 10">
        <CpContentView
          :type="data.typeId"
          :data="data"
          :show-answer-true="false"
        />
      </div>
      <div v-if="data.typeId === 10 && data">
        <div class="text-medium-md text-cluse-title">
          Yêu cầu chung: Nội dung câu hỏi chùm câu hỏi chùm câu hỏi chùm
        </div>
        <div
          v-for="qsItem in data?.questions"
          :key="qsItem.id"
          class="mb-5"
        >
          <CpContentView
            :type="qsItem.typeId"
            :data="qsItem"
            :show-answer-true="false"
          />
        </div>
      </div>
    </CmDialogs>
  </div>
</template>

<style lang="scss">
 .text-cluse-title{
    color:  rgb(var(--v-gray-900)) !important;
    margin-bottom: 20px;
  }
</style>

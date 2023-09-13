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
      <CpContentView
        :type="data.questionTypeId"
        :data="data"
        :show-answer-true="false"
        :is-survey="true"
      />
    </CmDialogs>
  </div>
</template>

<style lang="scss">
 .text-cluse-title{
    color:  rgb(var(--v-gray-900)) !important;
    margin-bottom: 20px;
  }
</style>

<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
})
const emit = defineEmits<Emit>()
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
interface Props {
  isShowModal: boolean
}
interface Emit {
  (e: 'update:isShowModal', value: any): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const LABEL = Object.freeze({
  TITLE: t('feedback-management'),
})
async function onCancel() {
  emit('update:isShowModal', false)
}
</script>

<template>
  <div>
    <CmDialogs
      :is-dialog-visible="isShowModal"
      close-on-back
      :is-ok="false"
      :title="t('download-file-course')"
      :is-div-space="false"
      @cancel="onCancel"
    >
      <div>
        á
      </div>
    </CmDialogs>
  </div>
</template>

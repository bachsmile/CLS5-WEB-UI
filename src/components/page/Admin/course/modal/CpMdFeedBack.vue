<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), {
  isShowModalFeedBack: false,
})
const emit = defineEmits<Emit>()
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
interface Props {
  isShowModalFeedBack: boolean
  dataFeedBack: any
}
interface Emit {
  (e: 'update:isShowModalFeedBack', value: any): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const LABEL = Object.freeze({
  TITLE: t('feedback-management'),
})
async function onCancel() {
  emit('update:isShowModalFeedBack', false)
}
</script>

<template>
  <div>
    <CmDialogs
      :is-dialog-visible="isShowModalFeedBack"
      close-on-back
      :is-ok="false"
      @cancel="onCancel"
    >
      <template #title>
        <div class="d-flex mb-5">
          <div class="icon-noti">
            <VIcon
              icon="tabler:copy"
              color="infor"
              class="noti-zindex"
              :size="24"
            />
            <span
              class="ring1 ring1-type-2"
            />
            <span
              class="ring2 ring2-type-2"
            />
          </div>
          <div class="ml-5 d-flex align-center">
            {{ t(LABEL.TITLE) }}
          </div>
        </div>
      </template>
      <div>
        {{ dataFeedBack }}
      </div>
    </CmDialogs>
  </div>
</template>

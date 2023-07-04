<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), ({
}))

const emit = defineEmits<Emit>()

const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmRadio = defineAsyncComponent(() => import('@/components/common/CmRadio.vue'))

interface Props {
  isDialogVisible: boolean
}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'updateOptionUpload', data: any): void
  (e: 'confirm'): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const acceptDownload = ref(false)
const acceptCLone = ref(window._.cloneDeep(acceptDownload.value))
const LABEL = Object.freeze({
  TITLE: t('api-info'),
  TITLE1: t('api-name'),
  TITLE2: t('code-number'),
})

async function onCancel() {
  acceptDownload.value = acceptCLone.value
  emit('updateOptionUpload', acceptCLone.value)
  emit('update:isDialogVisible', false)
}
async function onConfirm() {
  acceptCLone.value = acceptDownload.value
  emit('confirm')
}
watch(() => props.isDialogVisible, isShow => {
  if (isShow)
    acceptDownload.value = false
})
</script>

<template>
  <CmDialogs
    :is-dialog-visible="props.isDialogVisible"
    :title="LABEL.TITLE"
    close-on-back
    :button-ok-name="t('continue')"
    @cancel="onCancel"
    @confirm="onConfirm"
  >
    <div class="mb-4">
      <div class="text-semibold-md color-text-900 mb-4 ">
        {{ t("setting-dowload-video") }}
      </div>
      <div class="d-flex align-center mb-6">
        <div class="d-flex align-center">
          <div class="d-flex align-center mr-4">
            <CmRadio
              v-model="acceptDownload"
              :type="1"
              name="acceptDownload"
              :value="false"
              @change="emit('updateOptionUpload', false)"
            />
          </div>
          <div class="d-flex align-center mr-4">
            <div>{{ t('download-not-allowed') }}</div>
          </div>
        </div>
        <div class="d-flex align-center">
          <div class="d-flex align-center mr-4">
            <CmRadio
              v-model="acceptDownload"
              :type="1"
              name="acceptDownload"
              :value="true"
              @change="emit('updateOptionUpload', true)"
            />
          </div>
          <div class="d-flex align-center mr-4">
            <div>{{ t('download-allowed') }}</div>
          </div>
        </div>
      </div>
    </div>
  </CmDialogs>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
})
const emit = defineEmits<Emit>()
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
interface Props {
  isShowModal: boolean
  qrCode?: any
}
interface Emit {
  (e: 'update:isShowModal', value: any): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
async function onCancel() {
  emit('update:isShowModal', false)
}
</script>

<template>
  <div>
    <CmDialogs
      :is-dialog-visible="isShowModal"
      close-on-back
      is-theme-custom
      @cancel="onCancel"
    >
      <template #isTheme>
        <div class="box-zoom">
          <div class="d-flex justify-center align-center w-100">
            <img
              :src="qrCode"
              alt="QR"
              class="box-img-qr"
            >
          </div>
        </div>
      </template>
    </CmDialogs>
  </div>
</template>

<style lang="scss">
.box-zoom{
  background-color: #fff;
  border-radius: 12px;
  .box-img-qr {
    width: 600px;
  }
}
</style>

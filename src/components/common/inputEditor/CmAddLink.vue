<script setup lang="ts">
import { load } from '@/stores/loadComponent.js'
import CmTextField from '@/components/common/CmTextField.vue'
import CmDialogs from '@/components/common/CmDialogs.vue'

interface Emit {
  (e: 'addLinkUrl', key: any, option: any, value?: any, selection?: any, range?: any): void
}
const props = withDefaults(defineProps<Props>(), ({
  text: '',
  disabled: false,
}))
const emit = defineEmits<Emit>()
const store = load()
const { unLoadComponent } = store

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const isShowModal = ref(false)
interface Props {
  text?: any
  disabled?: boolean
}
const link = ref({
  text: props.text,
  url: '',
})
const selection = ref()
function setLink() {
  isShowModal.value = true
  link.value.text = window.getSelection()?.toString()
  selection.value = null
  selection.value = {
    anchorNode: window.getSelection()?.anchorNode,
    extentNode: (window.getSelection() as any)?.extentNode,
    anchorOffset: window.getSelection()?.anchorOffset,
    extentOffset: (window.getSelection() as any)?.extentOffset,
  }
}
async function onCancel() {
  isShowModal.value = false
}
async function onConfirm(idx: any) {
// link
  addLinkUrl(idx)
}
function addLinkUrl(idx: any) {
  const range = document.createRange()
  emit('addLinkUrl', 'createLink', false, link.value.url, selection.value, range)
  unLoadComponent(idx)

  isShowModal.value = false
}
</script>

<template>
  <div class="d-flex">
    <button
      class=" btn-full cursor-pointer"
      style="border: none"
      :disabled="disabled"
      @click="setLink"
    >
      <strong>
        <VIcon
          icon="tabler:link"
          size="18"
        />
      </strong>
    </button>
    <CmDialogs
      :title="t('url')"
      :is-dialog-visible="isShowModal"
      :button-ok-name="t('save')"
      close-on-back
      persistent
      size="sm"
      @cancel="onCancel"
      @confirm="onConfirm"
    >
      <div class="mb-3">
        <CmTextField
          v-model="link.url"
          :text="t('url')"
          :placeholder="t('url')"
        />
      </div>
      <div class="mb-4">
        <CmTextField
          v-model="link.text"
          :text="t('content')"
          :placeholder="t('content')"
        />
      </div>
    </CmDialogs>
  </div>
</template>

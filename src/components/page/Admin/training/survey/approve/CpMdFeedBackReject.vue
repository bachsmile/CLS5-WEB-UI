<script lang="ts" setup>
import CmDialogs from '@/components/common/CmDialogs.vue'
import type { Any } from '@/typescript/interface'

// Khởi tạo
const props = withDefaults(defineProps<Props>(), ({
  isShow: false,
  title: '',
  message: '',
}))

const emit = defineEmits<Emit>()
interface Emit {
  (e: 'ok', value: any): void
  (e: 'edit', value: any): void
  (e: 'update:isShow', value: any): void
}
interface Props {
  isShow: boolean
  title: string
  message?: string
}

function cancelModal() {
  emit('update:isShow', false)
}

const dataInput = ref<Any>({})
function confirmModal() {
  if (dataInput.value.id)
    emit('edit', dataInput.value)
  else
    emit('ok', dataInput.value)
  emit('update:isShow', false)
}
function resetData() {
  dataInput.value = {
    id: '',
    name: '',
    description: '',
  }
}
</script>

<template>
  <CmDialogs
    :is-dialog-visible="isShow"
    :title="title"
    size="sm"
    :is-ok="false"
    @cancel="cancelModal"
    @confirm="confirmModal"
    @hide="resetData"
  >
    <div class="rounded-lg outlined-error pa-4 v-btn--variant-tonal text-error bg-error-50">
      {{ message }}
    </div>
  </CmDialogs>
</template>

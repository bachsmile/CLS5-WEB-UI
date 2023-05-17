<script lang="ts" setup>
import CmDialogs from '@/components/common/CmDialogs.vue'
import CmSelect from '@/components/common/CmSelect.vue'

interface Props {
  list: any[]
  isShow: boolean
  title: string
  nameFeild: string
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update:isShow', data: boolean): void
  (e: 'confirm', data: unknown): void
}
const cancelModal = () => {
  emit('update:isShow', false)
}
const motionId = ref<any>(null)
const confirmModal = () => {
  emit('confirm', motionId.value)
}
</script>

<template>
  <CmDialogs
    :is-dialog-visible="isShow"
    :title="title"
    size="sm"
    @cancel="cancelModal"
    @confirm="confirmModal"
  >
    <CmSelect
      v-model:model-value="motionId"
      :text="nameFeild"
      :items="list"
      custom-key="value"
      item-value="key"
    />
  </CmDialogs>
</template>


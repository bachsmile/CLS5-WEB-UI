<script lang="ts" setup>
import CmSelect from '@/components/common/CmSelect.vue'
import { useStoreAddUser } from '@/stores/admin/group-user/modalEditGroupUser'

const props = withDefaults(defineProps<Props>(), ({}))
const emit = defineEmits<Emit>()
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
interface Props {
  isShow: boolean
  title: string
}
interface Emit {
  (e: 'update:isShow', data: boolean): void
  (e: 'ok', data: any): void
}
function hidden(val: any) {
  emit('update:isShow', false)
}

const store = useStoreAddUser()
const groupId = ref(null)
function confirm(val: any) {
  emit('ok', groupId.value)
}
</script>

<template>
  <CmDialogs
    :is-dialog-visible="props.isShow"
    :title="title"
    size="sm"
    persistent
    @cancel="hidden"
    @confirm="confirm"
    @hide="() => {
      groupId = null
    }"
  >
    <span>Chọn nhóm người dùng</span>
    <CmSelect
      v-model:model-value="groupId"
      :items="store.dataHeader.listGroupUser"
      append-to-body
      item-value="id"
      class="mb-4"
      custom-key="name"
    />
  </CmDialogs>
</template>

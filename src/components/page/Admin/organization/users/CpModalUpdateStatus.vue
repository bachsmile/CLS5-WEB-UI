<script setup lang="ts">
import CmDialogs from '@/components/common/CmDialogs.vue'
import CmSelect from '@/components/common/CmSelect.vue'
import { comboboxStore } from '@/stores/combobox'

interface Props {
  isDialogVisible: boolean
}

const props = withDefaults(defineProps<Props>(), ({
}))

const emit = defineEmits<Emit>()

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', data: any): void
}
const store = comboboxStore()
const { statusesCombobox } = storeToRefs(store)
const { fetchStatusUsersCombobox } = store
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const LABEL = Object.freeze({
  TEXT: 'Trạng thái',
  PLACEHOLDER: 'Chọn trạng thái',
})

const statusList = ref(null)

const updateModelValue = () => {
  emit('update:isDialogVisible', false)
}

const onConfirmation = () => {
  emit('update:isDialogVisible', false)

  emit('confirm', statusList.value)
}

if (window._.isEmpty(statusesCombobox.value))
  fetchStatusUsersCombobox()
</script>

<template>
  <CmDialogs
    :is-dialog-visible="props.isDialogVisible"
    :title="t('common.action-table.changes-status')"
    close-on-back
    @cancel="updateModelValue"
    @confirm="onConfirmation"
  >
    <div>
      <CmSelect
        v-model="statusList"
        item-value="key"
        custom-key="value"
        :text="LABEL.TEXT"
        :placeholder="LABEL.PLACEHOLDER"
        :items="statusesCombobox"
      />
    </div>
  </CmDialogs>
</template>


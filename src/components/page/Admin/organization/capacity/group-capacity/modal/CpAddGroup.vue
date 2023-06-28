<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'

const props = withDefaults(defineProps<Props>(), ({
  isShow: false,
  title: '',
  dataDetail: {
    name: '',
    description: '',
  },
}))

const emit = defineEmits<Emit>()
interface Emit {
  (e: 'ok', value: any): void
  (e: 'edit', value: any): void
  (e: 'update:isShow', value: any): void
}

// Ẩn modal
const storeValidate = validatorStore()
const { Field, Form } = storeValidate
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
interface Props {
  isShow: boolean
  title: string
  dataDetail: any
}

/**
 * Thêm nhóm năng lực
 * */
const dataInput = ref({
  id: '',
  name: '',
  description: '',
})

/**
 * Chỉnh sửa
 * */

watch(() => props.dataDetail, val => {
  if (val) {
    dataInput.value.id = val.id
    dataInput.value.name = val.name
    dataInput.value.description = val.description
  }
})

function cancelModal() {
  emit('update:isShow', false)
}

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
    :sub-title="title"
    @cancel="cancelModal"
    @confirm="confirmModal"
    @hide="resetData"
  >
    <Form>
      <VRow>
        <VCol>
          <CmTextField
            :text="`${t('users.capacity-management.proficiency-group.name')}*`"
            :placeholder="t('users.capacity-management.proficiency-group.name')"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <CmTextField
            :text="t('description')"
            :placeholder="t('users.capacity-management.proficiency-group.name')"
          />
        </VCol>
      </VRow>
    </Form>
  </CmDialogs>
</template>

<script lang="ts" setup>
import CmDialogs from '@/components/common/CmDialogs.vue'
import type { Any } from '@/typescript/interface'
import CmTextField from '@/components/common/CmTextField.vue'
import { validatorStore } from '@/stores/validatator'

// Khởi tạo
const props = withDefaults(defineProps<Props>(), ({
  isShow: false,
  title: '',
  dataEdit: null,
}))
const emit = defineEmits<Emit>()
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup, ruleMessage } = storeValidate
const { t } = window.i18n()

interface Emit {
  (e: 'ok', val: any): void
  (e: 'update:isShow', value: any): void
  (e: 'update:name', val: string): void
  (e: 'update:archivePoint', val: any): void
}
interface Props {
  isShow: boolean
  title: string
  name: string
  archivePoint: number | null
  dataEdit: Any | null
}

function cancelModal() {
  emit('update:isShow', false)
}

const myForm = ref()
const schema = yup.object({
  name: schemaOption.defaultString,
  archivePoint: yup.number().typeError(ruleMessage.typeNumber).required(ruleMessage.required()).min(0, t('min-value', { val: 0 })).max(100, ruleMessage.max(100)),
})

async function confirmModal(idx: number, unload: any) {
  await myForm.value.validate().then((status: Any) => {
    if (status.valid)
      emit('ok', unload())
  })
  unload()
}
onUnmounted(() => {
  emit('update:name', '')
  emit('update:archivePoint', null)
})
</script>

<template>
  <CmDialogs
    :is-dialog-visible="isShow"
    :title="title"
    @cancel="cancelModal"
    @confirm="confirmModal"
  >
    <Form
      ref="myForm"
      :validation-schema="schema"
      @submit.prevent="useForm"
    >
      <Field
        v-slot="{ field, errors }"
        :model-value="name"
        name="name"
        type="string"
      >
        <CmTextField
          :model-value="name"
          :field="field"
          :errors="errors"
          :text="t('rating-scale-name')"
          @update:model-value="emit('update:name', $event)"
        />
      </Field>
      <Field
        v-slot="{ field, errors }"
        :model-value="archivePoint"
        name="archivePoint"
        type="number"
      >
        <CmTextField
          :model-value="archivePoint"
          :field="field"
          :errors="errors"
          :text="t('passed-score')"
          @update:model-value="emit('update:archivePoint', $event)"
        />
      </Field>
    </Form>
  </CmDialogs>
</template>

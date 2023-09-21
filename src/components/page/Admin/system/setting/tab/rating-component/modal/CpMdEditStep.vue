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
  (e: 'ok', value: any): void
  (e: 'update:isShow', value: any): void
  (e: 'update:name', val: string): void
  (e: 'update:archivePoint', val: string): void
}
interface Props {
  isShow: boolean
  title: string
  name: string
  archivePoint: number | null
}

function cancelModal() {
  emit('update:isShow', false)
}

const dataInput = ref<Any>({
  name: '',
  achievePoint: '',
})

function resetData() {
  dataInput.value = {
    name: '',
    achievePoint: '',
  }
}
const myForm = ref()
const schema = yup.object({
  name: schemaOption.defaultString,
  achievePoint: yup.number().typeError(ruleMessage.typeNumber).required(ruleMessage.required()).min(0, t('min-value', { val: 0 })).max(100, ruleMessage.max(100)),
})

async function confirmModal(idx: number, unload: any) {
  await myForm.value.validate().then((status: Any) => {
    if (status.valid)
      emit('ok', unload)
  })
  unload()
}
</script>

<template>
  <CmDialogs
    :is-dialog-visible="isShow"
    :title="title"
    @cancel="cancelModal"
    @confirm="confirmModal"
    @hide="resetData"
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
          :text="t('name-level')"
          @update:model-value="emit('update:name', $event)"
        />
      </Field>
      <Field
        v-slot="{ field, errors }"
        :model-value="archivePoint"
        name="achievePoint"
        type="number"
      >
        <CmTextField
          :model-value="dataInput.achievePoint"
          :field="field"
          :errors="errors"
          :text="t('minimum-score')"
          @update:model-value="emit('update:archivePoint', $event)"
        />
      </Field>
    </Form>
  </CmDialogs>
</template>

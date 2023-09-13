<script lang="ts" setup>
import CmDialogs from '@/components/common/CmDialogs.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import CmTextArea from '@/components/common/CmTextArea.vue'
import { validatorStore } from '@/stores/validatator'

const props = withDefaults(defineProps<Props>(), {
  isShow: false,
  title: '',
})
const emit = defineEmits<Emit>()
const { t } = window.i18n()
interface Props {
  isShow: boolean
  title: string
  dataDetail: DataInput
}
interface Emit {
  (e: 'update:isShow', status: boolean): void
  (e: 'confirm', data: any, fn: any): void
}
function cancelModal() {
  emit('update:isShow', false)
}
interface DataInput {
  id?: number
  description: string
  name: string
}
const dataInput = ref<DataInput>({
  name: '',
  description: '',
})

// validate
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const schema = reactive({
  name: schemaOption.requiredString(),
})
const formEdit = ref()

function confirmModal(idx: number, unload: any) {
  formEdit.value.validate().then((status: any) => {
    if (status.valid)
      emit('confirm', dataInput.value, unload)
  })
}

watch(() => props.dataDetail, (val: DataInput) => {
  dataInput.value = val
})

function resetData() {
  dataInput.value = {
    name: '',
    description: '',
  }
}
</script>

<template>
  <CmDialogs
    :is-dialog-visible="isShow"
    :title="t('add-type-cost')"
    @cancel="cancelModal"
    @confirm="confirmModal"
    @hide="resetData"
  >
    <Form
      ref="formEdit"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <Field
        v-slot="{ field, errors }"
        v-model="dataInput.name"
        name="name"
        type="text"
      >
        <CmTextField
          :field="field"
          :errors="errors"
          :model-value="dataInput.name"
          :text="`${t('type-name-cost')}*`"
          :placeholder="t('type-name-cost')"
        />
      </Field>

      <CmTextArea
        v-model="dataInput.description"
        :text="t('description')"
      />
    </Form>
  </CmDialogs>
</template>

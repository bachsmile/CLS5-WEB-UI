<script lang="ts" setup>
import CmDialogs from '@/components/common/CmDialogs.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import CmtextArea from '@/components/common/CmtextArea.vue'
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
  (e: 'confirm', data: any): void
}
function cancelModal() {
  emit('update:isShow', false)
}
interface DataInput {
  id?: number
  description: string
  name: string
  [e: string]: any
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
const formEditTopic = ref()

function confirmModal() {
  formEditTopic.value.validate().then((status: any) => {
    if (status.valid)
      emit('confirm', dataInput.value)
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
const route = useRoute()
const fieldName = computed(() => {
  switch (route.params.tab) {
    case 'degree':
      return {
        variableName: 'degreeName',
        text: t('type-degree'),
      }
    case 'academicdegree':
      return {
        variableName: 'name',
        text: t('academidegreeName'),
      }
    case 'academicrank':
      return {
        variableName: 'name',
        text: t('academicrankName'),
      }
  }
  return {
    variableName: 'name',
    text: t('name'),
  }
})
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
      ref="formEditTopic"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <Field
        v-slot="{ field, errors }"
        v-model="dataInput[fieldName.variableName]"
        name="name"
        type="text"
      >
        <CmTextField
          :field="field"
          :errors="errors"
          :model-value="dataInput[fieldName.variableName]"
          :text="`${t(fieldName.text)}(*)`"
          :placeholder="`${t(fieldName.text)}`"
        />
      </Field>

      <CmtextArea
        v-model="dataInput.description"
        :text="t('description')"
      />
    </Form>
  </CmDialogs>
</template>

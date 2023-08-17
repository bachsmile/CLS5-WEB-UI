<script setup lang="ts">
import CmSelect from '@/components/common/CmSelect.vue'
import { validatorStore } from '@/stores/validatator'

const props = withDefaults(defineProps<Props>(), ({
  typeId: 1,
  isEdit: false,
}))
const emit = defineEmits<Emit>()
interface Props {
  typeId?: any
  isEdit?: boolean
}
interface Emit {
  (e: 'update:typeId', value: any): void
  (e: 'update:data', value: any): void

}
const { t } = window.i18n()
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const schema = yup.object({
  typeId: schemaOption.defaultSelectSingle,
})
const questionTypes = [
  {
    value: t('QuestionService.QuestionSingleChoice'),
    key: 1,
  },
  {
    value: t('QuestionService.QuestionMultipleChoice'),
    key: 2,
  },
  {
    value: t('QuestionService.QuestionUnderlined'),
    key: 3,
  },
  {
    value: t('QuestionService.QuestionChooseTrueFalse'),
    key: 4,
  },
  {
    value: t('QuestionService.QuestionClauseTrueFalse'),
    key: 5,
  },
  {
    value: t('QuestionService.QuestionFillInTheGap'),
    key: 6,
  },
  {
    value: t('QuestionService.QuestionFillInTheGap2'),
    key: 7,
  },
  {
    value: t('QuestionService.QuestionPairing'),
    key: 8,
  },
  {
    value: t('QuestionService.QuestionEssay'),
    key: 9,
  },
]
const dataInput = ref<any>({
  typeId: null,
})
const myFormOptionQs = ref()
const isSubmit = computed(() => {
  return myFormOptionQs.value.validate
})
function changeValue(key: string, value: any) {
  dataInput.value[key] = value
  emit('update:data', dataInput.value)

  switch (key) {
    case 'typeId':
      emit('update:typeId', value)
      break

    default:
      break
  }
}
defineExpose({
  isSubmit,
})
</script>

<template>
  <Form
    ref="myFormOptionQs"
    :validation-schema="schema"
    @submit.prevent="submitForm"
  >
    <VRow>
      <VCol
        cols="12"
        md="4"
        sm="4"
      >
        <Field
          v-slot="{ field, errors }"
          :model-value="typeId"
          name="typeId"
          type="number"
        >
          <CmSelect
            :disabled="isEdit"
            :clearable="false"
            :field="field"
            :errors="errors"
            :model-value="typeId"
            :items="questionTypes"
            item-value="key"
            custom-key="value"
            :text="`${t('question-type')}*`"
            :placeholder="t('question-type')"
            @update:model-value="($value) => changeValue('typeId', $value)"
          />
        </Field>
      </VCol>
    </VRow>
  </Form>
</template>

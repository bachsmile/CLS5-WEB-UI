<script setup lang="ts">
import CmSelect from '@/components/common/CmSelect.vue'
import { validatorStore } from '@/stores/validatator'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import QuestionService from '@/api/question'
import type { Any } from '@/typescript/interface'

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
const surveyTypes = ref<any[]>([])
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
function getSurveyType() {
  if (window._.isEmpty(surveyTypes.value)) {
    MethodsUtil.requestApiCustom(QuestionService.GetSurveyType, TYPE_REQUEST.GET).then(({ data }: { data: Any[] }) => {
      surveyTypes.value = data
    })
  }
}
onMounted(() => {
  getSurveyType()
})
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
            :items="surveyTypes"
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

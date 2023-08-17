<script lang="ts" setup>
import CmTextField from '@/components/common/CmTextField.vue'
import CpTopicSelect from '@/components/page/gereral/CpTopicSelect.vue'
import CmDateTimePicker from '@/components/common/CmDateTimePicker.vue'
import CmRadio from '@/components/common/CmRadio.vue'
import { validatorStore } from '@/stores/validatator'

const route = useRoute()
// eslint-disable-next-line vue/define-macros-order
const props = withDefaults(defineProps<Props>(), {
  data: null,
})

const emit = defineEmits<Emit>()

const storeValidate = validatorStore()

const { schemaOption, Field, Form, useForm, yup, ruleMessage } = storeValidate
const { submitForm } = useForm()
const { t } = window.i18n()
const schema = reactive({
  name: schemaOption.requiredString(),
  topicId: schemaOption.defaultSelectSingle,
  fromDate: schemaOption.defaultString,
  todate: schemaOption.defaultString,
})

interface Props {
  data: DataInput | null
}
interface Emit {
  (e: 'update:data', data: DataInput): void
}
interface DataInput {
  fromDate: any
  isHandWork: boolean
  name: string
  surveyExamId: number
  todate: any
  topicId: number | null
  id?: number
}

const dataInput = ref<DataInput>({
  name: '',
  fromDate: null,
  surveyExamId: Number(route.params.id),
  todate: null,
  topicId: null,
  isHandWork: false,
})

const myForm = ref()
watch(() => props.data, val => {
  if (val)
    dataInput.value = val
}, { immediate: true })
const isSubmit = computed(() => {
  return myForm.value.validate
})
defineExpose({
  isSubmit,
})
</script>

<template>
  <Form
    ref="myForm"
    :validation-schema="schema"
    class="mt-3"
    @submit.prevent="submitForm"
  >
    <VRow class="flex-wrap">
      <VCol
        cols="12"
        lg="4"
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
            :text="`${t('name-survey-topics')}*`"
            :placeholder="t('name-survey-topics')"
            @update:model-value="emit('update:data', dataInput)"
          />
        </Field>
      </VCol>
      <VCol
        cols="12"
        lg="4"
      >
        <Field
          v-slot="{ field, errors }"
          :model-value="dataInput.topicId"
          name="topicId"
          type="number"
        >
          <CpTopicSelect
            v-model:model-value="dataInput.topicId"
            :field="field"
            :errors="errors"
            :type="6"
            :text="`${t('topic')}*`"
            :placeholder="t('topic')"
            @update:model-value="emit('update:data', dataInput)"
          />
        </Field>
      </VCol>
      <VCol
        cols="12"
        lg="4"
      >
        <VRow>
          <VCol cols="6">
            <Field
              v-slot="{ field, errors }"
              v-model:model-value="dataInput.fromDate"
              name="fromDate"
              type="text"
            >
              <CmDateTimePicker
                :model-value="dataInput.fromDate"
                :field="field"
                :errors="errors"
                :max-date="dataInput.todate"
                :text="`${t('start-time')}*`"
                @update:model-value="emit('update:data', dataInput)"
              />
            </Field>
          </VCol>
          <VCol cols="6">
            <Field
              v-slot="{ field, errors }"
              v-model:model-value="dataInput.todate"
              name="todate"
              type="text"
            >
              <CmDateTimePicker
                :model-value="dataInput.todate"
                :field="field"
                :errors="errors"
                :min-date="dataInput.fromDate"
                :text="`${t('end-time')}*`"
                @update:model-value="emit('update:data', dataInput)"
              />
            </Field>
          </VCol>
        </VRow>
      </VCol>
      <VCol
        cols="12"
        lg="4"
      >
        <label class="text-medium-sm color-dark">{{ t('method-create-test') }}</label>
        <div class="mt-2">
          <VRow>
            <VCol lg="6">
              <div class="d-flex align-center">
                <CmRadio
                  v-model="dataInput.isHandWork"
                  name="type"
                  :value="true"
                  @update:model-value="emit('update:data', dataInput)"
                />
                <label class="ml-2">{{ t('handmade-create') }}</label>
              </div>
            </VCol>
            <VCol lg="6">
              <div class="d-flex align-center">
                <CmRadio
                  v-model="dataInput.isHandWork"
                  name="type"
                  :value="false"
                  @update:model-value="emit('update:data', dataInput)"
                />
                <label class="ml-2">{{ t('auto-create') }}</label>
              </div>
            </VCol>
          </VRow>
        </div>
      </VCol>
    </VRow>
  </Form>
</template>

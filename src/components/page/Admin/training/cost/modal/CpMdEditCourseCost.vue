<script lang="ts" setup>
import CmDialogs from '@/components/common/CmDialogs.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import { validatorStore } from '@/stores/validatator'
import CmTextArea from '@/components/common/CmTextArea.vue'
import { comboboxStore } from '@/stores/combobox'
import CmSelect from '@/components/common/CmSelect.vue'
import CmInputCurrency from '@/components/common/CmInputCurrency.vue'

// Khởi tạo
const props = withDefaults(defineProps<Props>(), ({
  isShow: false,
  title: '',
}))

const emit = defineEmits<Emit>()

const route = useRoute()
const storeCombobox = comboboxStore()
const { getComboboxCourse, getCostTypeCombobox, getExamCombobox } = storeCombobox
const { courseCombobox, costTypeCombobox, examCombobox } = storeToRefs(storeCombobox)
function getData() {
  if (!courseCombobox.value.length && route.query.tab === 'cost-course')
    getComboboxCourse()
  if (!costTypeCombobox.value.length)
    getCostTypeCombobox()
  if (!examCombobox.value.length && route.query.tab === 'exam-course')
    getExamCombobox()
}

const { t } = window.i18n() // Khai báo biến ngôn ngữ
interface Emit {
  (e: 'confirm', value: any, fn: any): void
  (e: 'update:isShow', value: any): void
}
interface Props {
  isShow: boolean
  title: string
  dataDetail: DataInput
}
interface DataInput {
  costTypeId: number | null
  courseId: number | null
  examId: number | null
  description: string | null
  id?: number | null
  name: string | null
  unitPrice: number | null
  [key: string]: any
}

// validate
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const schema = reactive({
  name: schemaOption.requiredString(),
  costTypeId: schemaOption.defaultSelectSingle,
  unitPrice: schemaOption.defaultString,

  ...(route.query.tab === 'cost-course' ? { courseId: schemaOption.defaultSelectSingle } : {}),
  ...(route.query.tab === 'cost-exam' ? { examId: schemaOption.defaultSelectSingle } : {}),
})

const formEdit = ref()
function cancelModal() {
  emit('update:isShow', false)
}

const dataInput = ref<DataInput>({
  name: '',
  costTypeId: null,
  description: null,
  courseId: null,
  unitPrice: null,
  examId: null,
})
function confirmModal(idx: number, unload: any) {
  formEdit.value.validate().then((status: any) => {
    if (status.valid)
      emit('confirm', dataInput.value, unload)

    else unload()
  })
}
function resetData() {
  dataInput.value = {
    name: '',
    costTypeId: null,
    description: null,
    courseId: null,
    unitPrice: null,
    examId: null,
  }
}
watch(() => props.dataDetail, (val: DataInput) => {
  dataInput.value = val
})
</script>

<template>
  <CmDialogs
    :is-dialog-visible="isShow"
    :title="t('add-cost')"
    :sub-title="title"
    size="sm"
    persistent
    @cancel="cancelModal"
    @confirm="confirmModal"
    @hide="resetData"
    @show="getData"
  >
    <Form
      ref="formEdit"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <Field
        v-slot="{ field, errors }"
        :model-value="dataInput.name"
        name="name"
        type="text"
      >
        <CmTextField
          v-model="dataInput.name"
          :field="field"
          :errors="errors"
          :text="`${t('cost-name')}*`"
          :placeholder="t('cost-name')"
        />
      </Field>

      <Field
        v-slot="{ field, errors }"
        v-model="dataInput.costTypeId"
        name="costTypeId"
        type="text"
      >
        <CmSelect
          :field="field"
          :errors="errors"
          :items="costTypeCombobox"
          item-value="key"
          custom-key="value"
          append-to-body
          :model-value="dataInput.costTypeId"
          :text="`${t('cost-type')}*`"
          :placeholder="t('type-name-cost')"
        />
      </Field>

      <Field
        v-if="route.query.tab === 'cost-exam'"
        v-slot="{ field, errors }"
        v-model="dataInput.examId"
        name="examId"
        type="text"
      >
        <CmSelect
          :field="field"
          :errors="errors"
          :items="examCombobox"
          item-value="key"
          append-to-body
          custom-key="value"
          :model-value="dataInput.examId"
          :text="`${t('exam-management')}*`"
          :placeholder="t('exam-management')"
        />
      </Field>
      <Field
        v-if="route.query.tab === 'cost-course'"
        v-slot="{ field, errors }"
        v-model="dataInput.courseId"
        name="courseId"
        type="text"
      >
        <CmSelect
          :items="courseCombobox"
          item-value="key"
          :model-value="dataInput.courseId"
          :field="field"
          :errors="errors"
          custom-key="value"
          :text="`${t('course')}*`"
          :placeholder="t('course')"
        />
      </Field>
      <Field
        v-slot="{ field, errors }"
        v-model="dataInput.unitPrice"
        name="unitPrice"
        type="text"
      >
        <CmInputCurrency
          v-model="dataInput.unitPrice"
          :field="field"
          :errors="errors"
          is-currency
          :text="`${t('money')}*`"
          :placeholder="t('money')"
        />
      </Field>
      <Field
        v-slot="{ field, errors }"
        v-model="dataInput.description"
        name="description"
        type="text"
      >
        <CmTextArea
          :field="field"
          :errors="errors"
          :model-value="dataInput.description"
          :text="t('description')"
          :placeholder="t('description')"
        />
      </Field>
    </Form>
  </CmDialogs>
</template>

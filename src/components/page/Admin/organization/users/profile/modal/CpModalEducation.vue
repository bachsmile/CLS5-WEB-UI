<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import MethodsUtil from '@/utils/MethodsUtil'
import ApiUser from '@/api/user/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

interface Props {
  isDialogVisible: boolean
  educationData: any
}
interface Emit {
  (e: 'update:isDialogVisible', value: boolean, type: any): void
  (e: 'update:profile', value: any, edit: boolean): void
}

const props = withDefaults(defineProps<Props>(), ({
  educationData: () => ({
    schoolId: null,
    schoolName: null,
    degreeId: null,
    degreeName: null,
    description: null,
    graduationYear: null,
    isEdit: false,
    index: 0,
  }),
}))

const emit = defineEmits<Emit>()

const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CmDateTimePicker = defineAsyncComponent(() => import('@/components/common/CmDateTimePicker.vue'))
const CmTextArea = defineAsyncComponent(() => import('@/components/common/CmTextArea.vue'))

/**
 * lib
 */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

/**
 * content data
 */
const data = reactive({
  nameSchoolsCombobox: [],
  degreesCombobox: [],
})

const DATA_LABEL = Object.freeze({
  TITLE: t('add-education'),
  LABEL_SCHOOL: t('school-name'),
  LABEL_DEGREE: t('degree'),
})

// get name schools '

const fetchNameSchools = async () => {
  await MethodsUtil.requestApiCustom(ApiUser.fetchNameSchools, TYPE_REQUEST.GET).then(value => {
    data.nameSchoolsCombobox = value.data
  })
}

fetchNameSchools()

// get bằng cấp trình độ '
const fetchDegrees = async () => {
  await MethodsUtil.requestApiCustom(ApiUser.fetchDegrees, TYPE_REQUEST.GET).then(value => {
    data.degreesCombobox = value.data
  })
}

fetchDegrees()

/**
 * form
 */
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm } = storeValidate

const schema = reactive<any>({
  schoolId: schemaOption.requiredString(),
  degreeId: schemaOption.requiredString(),
  graduationYear: schemaOption.requiredString(),
})

const { values, setValues, resetForm } = useForm({
  validationSchema: schema,
  initialValues: ref(props.educationData),
})

/** event dialog */
const cancelModal = () => {
  emit('update:isDialogVisible', false, 'EDUCATION')
}

const myFormEducation = ref(null)

/**
 * add data modal education
 */

const addEducation = () => {
  const school: any = data.nameSchoolsCombobox.find((itemSchoool: any) => itemSchoool.key === values.schoolId)
  if (school)
    values.schoolName = school.value

  const degree: any = data.degreesCombobox.find((itemDegrees: any) => itemDegrees.key === values.degreeId)
  if (degree)
    values.degreeName = degree.value
  if (props?.educationData?.isEdit === false)
    emit('update:profile', window._.clone(values), false)

  else
    emit('update:profile', window._.clone(values), true)
}

const onConfirmation = () => {
  const form: any = myFormEducation.value
  if (form) {
    form.validate().then((success: any) => {
      if (success.valid)
        addEducation()
    })
  }
}

watch(() => props.isDialogVisible, value => {
  if (value && !props.educationData?.isEdit)
    resetForm()
})
watch(() => props.educationData, value => {
  setValues(value)
}, { deep: true })
</script>

<template>
  <CmDialogs
    :is-dialog-visible="isDialogVisible"
    :title="DATA_LABEL.TITLE"
    persistent
    @cancel="cancelModal"
    @confirm="onConfirmation"
  >
    <Form ref="myFormEducation">
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <!-- tên trường -->
          <div>
            <Field
              v-slot="{ field, errors }"
              v-model="values.schoolId"
              name="schoolId"
              :rules="schema.schoolId"
            >
              <CmSelect
                :field="field"
                :model-value="values.schoolId"
                :text="DATA_LABEL.LABEL_SCHOOL"
                :placeholder="DATA_LABEL.LABEL_SCHOOL"
                :items="data.nameSchoolsCombobox"
                :errors="errors"
                item-value="key"
                custom-key="value"
              />
            </Field>
          </div>
          <!-- bằng cấp -->
          <div class="mt-2">
            <Field
              v-slot="{ field, errors }"
              v-model="values.degreeId"
              name="degreeId"
              :rules="schema.degreeId"
            >
              <CmSelect
                :field="field"
                :model-value="values.degreeId"
                :text="DATA_LABEL.LABEL_DEGREE"
                :placeholder="DATA_LABEL.LABEL_DEGREE"
                :items="data.degreesCombobox"
                :errors="errors"
                item-value="key"
                custom-key="value"
              />
            </Field>
          </div>
          <div class="mt-2">
            <Field
              v-slot="{ field, errors }"
              v-model="values.graduationYear"
              name="graduationYear"
              :rules="schema.graduationYear"
            >
              <label class="text-label-default">{{ t('years') }}</label>
              <CmDateTimePicker
                :key="errors.length"
                v-model="values.graduationYear"
                :error="errors.length > 0 ? errors : false"
                :error-messages="errors ? errors[0] : ''"
                :field="field"
                placeholder="dd-mm-yyyy"
              />
            </Field>
          </div>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <!-- Mô tả -->
          <Field
            v-slot="{ field }"
            v-model="values.description"
            name="description"
          >
            <CmTextArea
              :field="field"
              :text="t('description')"
            />
          </Field>
        </VCol>
      </VRow>
    </Form>
  </CmDialogs>
</template>

<style scoped lang="scss">
@use "@/styles/style-global.scss" as *;
</style>


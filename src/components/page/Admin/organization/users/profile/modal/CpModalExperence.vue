<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import MethodsUtil from '@/utils/MethodsUtil'
import ApiUser from '@/api/user/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

interface Props {
  isDialogVisible: boolean
  experienceData: any
}
interface Emit {
  (e: 'update:isDialogVisible', value: boolean, type: any): void
  (e: 'update:profile', value: any, edit: boolean): void
}

const props = withDefaults(defineProps<Props>(), ({
  experienceData: () => ({
    companyName: null,
    dateFinish: null,
    dateStart: null,
    description: null,
    isWork: false,
    position: null,
    isEdit: false,
    index: 0,
  }),
}))

const emit = defineEmits<Emit>()

const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CmTextArea = defineAsyncComponent(() => import('@/components/common/CmTextArea.vue'))
const CmDateTimePicker = defineAsyncComponent(() => import('@/components/common/CmDateTimePicker.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const CmCheckBox = defineAsyncComponent(() => import('@/components/common/CmCheckBox.vue'))

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
  TITLE: t('users.add-user.add-experience'),
  LABEL_COMPANY: `${t('users.add-user.name-company')}(*)`,
  LABEL_POSITION: `${t('users.add-user.location')}(*)`,
  IS_WORK: t('users.add-user.working-here'),
})

// get name schools '

async function fetchNameSchools() {
  await MethodsUtil.requestApiCustom(ApiUser.fetchNameSchools, TYPE_REQUEST.GET).then((value: any) => {
    data.nameSchoolsCombobox = value.data
  })
}

fetchNameSchools()

// get bằng cấp trình độ '
async function fetchDegrees() {
  await MethodsUtil.requestApiCustom(ApiUser.fetchDegrees, TYPE_REQUEST.GET).then((value: any) => {
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
  companyName: schemaOption.requiredString(),
  position: schemaOption.requiredString(),
  dateStart: schemaOption.requiredString(),
  dateFinish: schemaOption.requiredString(),
})

const { values, setValues, resetForm } = useForm({
  validationSchema: schema,
  initialValues: ref(props.experienceData),
})

/** event dialog */

async function onCancel() {
  emit('update:isDialogVisible', false, 'EXPERENCE')
}
const myFormExperence = ref(null)

/**
 * add data modal Experience
 */

function addExperience() {
  if (props?.experienceData?.isEdit === false)
    emit('update:profile', window._.clone(values), false)

  else
    emit('update:profile', window._.clone(values), true)
}

function onConfirmation() {
  const form: any = myFormExperence.value
  if (form) {
    form.validate().then((success: any) => {
      if (success.valid)
        addExperience()
    })
  }
}

watch(() => props.isDialogVisible, value => {
  if (value && !props.experienceData?.isEdit)
    resetForm()
})
watch(() => props.experienceData, value => {
  setValues(value)
}, { deep: true })
</script>

<template>
  <CmDialogs
    :is-dialog-visible="isDialogVisible"
    :title="DATA_LABEL.TITLE"
    persistent
    @cancel="onCancel"
    @confirm="onConfirmation"
  >
    <Form ref="myFormExperence">
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <!-- tên CÔNG TY -->
          <div class="mt-2">
            <Field
              v-slot="{ field, errors }"
              v-model="values.companyName"
              name="companyName"
              :rules="schema.companyName"
            >
              <CmTextField
                :field="field"
                :errors="errors"
                :text="DATA_LABEL.LABEL_COMPANY"
                :placeholder="DATA_LABEL.LABEL_COMPANY"
              />
            </Field>
          </div>
          <!-- tên vị trí -->
          <div class="mt-2">
            <Field
              v-slot="{ field, errors }"
              v-model="values.position"
              name="position"
              :rules="schema.position"
            >
              <CmTextField
                :field="field"
                :errors="errors"
                :text="DATA_LABEL.LABEL_POSITION"
                :placeholder="DATA_LABEL.LABEL_POSITION"
              />
            </Field>
          </div>
          <!-- Nơi làm việc -->
          <div class="mt-2">
            <Field
              name="isWork"
            >
              <CmCheckBox
                v-model="values.isWork"
              >
                {{ DATA_LABEL.IS_WORK }}
              </CmCheckBox>
            </Field>
          </div>
          <VRow class="mt-2">
            <VCol
              cols="12"
              md="6"
            >
              <Field
                v-slot="{ field, errors }"
                v-model="values.dateStart"
                name="dateStart"
                :rules="schema.dateStart"
              >
                <label class="text-label-default">{{ t('common.from-years') }}<code>(*)</code></label>
                <CmDateTimePicker
                  :key="errors.length"
                  v-model="values.dateStart"
                  :error="errors.length > 0 ? errors : false"
                  :error-messages="errors ? errors[0] : ''"
                  :field="field"
                  placeholder="dd-mm-yyyy"
                />
              </Field>
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <Field
                v-slot="{ field, errors }"
                v-model="values.dateFinish"
                name="dateFinish"
                :rules="schema.dateFinish"
              >
                <label class="text-label-default">{{ t('common.to-years') }} <code>(*)</code></label>
                <CmDateTimePicker
                  :key="errors.length"
                  v-model="values.dateFinish"
                  :error="errors.length > 0 ? errors : false"
                  :error-messages="errors ? errors[0] : ''"
                  :field="field"
                  placeholder="dd-mm-yyyy"
                />
              </Field>
            </VCol>
          </VRow>
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
@use "/src/styles/style-global" as *;
</style>

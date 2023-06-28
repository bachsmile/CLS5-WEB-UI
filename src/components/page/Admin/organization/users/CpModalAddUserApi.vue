<script setup lang="ts">
import axios from 'axios'
import { validatorStore } from '@/stores/validatator'
import toast from '@/plugins/toast'

const props = withDefaults(defineProps<Props>(), ({
}))

const emit = defineEmits<Emit>()

const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
interface Props {
  isDialogVisible: boolean
}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', data: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const LABEL = Object.freeze({
  TITLE: t('api-info'),
  TITLE1: t('api-name'),
  TITLE2: t('code-number'),
})

/**
 * store
 */
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()

const schema = yup.object({
  name: schemaOption.linkUrl,
  code: schemaOption.requiredString(),
})
let apiInfo = reactive({
  name: '',
  code: '',
})
const myFormAdd = ref()

async function onCancel() {
  emit('update:isDialogVisible', false)
}
async function onConfirm() {
  myFormAdd.value.validate().then(async (success: any) => {
    if (success.valid) {
      window.showAllPageLoading('FULL-OPACITY')
      await axios.get(`${apiInfo.name}/${apiInfo.code}`)
        .then((data: any) => {
          window.hideAllPageLoading()
          toast('SUCCESS', t('success'))
          emit('confirm', data.data)
          emit('update:isDialogVisible', false)
        })
      window.hideAllPageLoading()
    }
  })
}
watch(() => props.isDialogVisible, isShow => {
  if (isShow) {
    apiInfo = reactive({
      name: '',
      code: '',
    })
  }
})
</script>

<template>
  <CmDialogs
    :is-dialog-visible="props.isDialogVisible"
    :title="LABEL.TITLE"
    close-on-back
    @cancel="onCancel"
    @confirm="onConfirm"
  >
    <Form
      ref="myFormAdd"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <Field
        v-slot="{ field, errors }"
        v-model="apiInfo.name"
        name="name"
        type="text"
      >
        <CmTextField
          :field="field"
          :errors="errors"
          :text="LABEL.TITLE1"
          :placeholder="LABEL.TITLE1"
          class="mb-4"
        />
      </Field>
      <Field
        v-slot="{ field, errors }"
        v-model="apiInfo.code"
        name="code"
        type="text"
      >
        <CmTextField
          :field="field"
          :errors="errors"
          :text="LABEL.TITLE2"
          :placeholder="LABEL.TITLE2"
        />
      </Field>
    </Form>
  </CmDialogs>
</template>

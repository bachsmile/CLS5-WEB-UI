<script lang="ts" setup>
import CmTextField from '@/components/common/CmTextField.vue'
import { validatorStore } from '@/stores/validatator'
import CmTextArea from '@/components/common/CmTextArea.vue'
import CmButton from '@/components/common/CmButton.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Any } from '@/typescript/interface'
import toast from '@/plugins/toast'
import CmDateTimePicker from '@/components/common/CmDateTimePicker.vue'

const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
interface DataInput {
  code: string | null
  deadline: number | null
  description: string | null
  fromDate: string | null
  name: string | null
  todate: string | null
  id?: number
}
const { t } = window.i18n()
const dataInput = ref<DataInput>({
  code: null,
  deadline: null,
  description: null,
  fromDate: null,
  name: null,
  todate: '',
})
const schema = {
  name: schemaOption.requiredString(),
  fromDate: schemaOption.requiredString(),
  todate: schemaOption.requiredString(),
  description: schemaOption.defaultStringArea,
}
const formEdit = ref()
const router = useRouter()
const route = useRoute()
function saveExam(isUpdate: boolean, idx?: number, unload?: any) {
  formEdit.value.validate().then((status: Any) => {
    if (status.valid) {
      if (!route.params.id) {
        dataInput.value.deadline = 1
        MethodsUtil.requestApiCustom(QuestionService.PostCreateExam, TYPE_REQUEST.POST, dataInput.value).then((res: Any) => {
          toast('SUCCESS', t('add-success'))
          if (isUpdate)
            router.push({ name: 'exam-edit', params: { tab: 'info', id: res.data } })
          else
            router.push({ name: 'exam-list' })
          unload(idx)
        }).catch((err: Any) => {
          toast('ERROR', t(err?.response?.data?.message) || t('server-error'))
          unload(idx)
        })
      }
      else {
        MethodsUtil.requestApiCustom(QuestionService.PostUpdateExam, TYPE_REQUEST.POST, dataInput.value).then((res: Any) => {
          toast('SUCCESS', t('USR_UpdateSuccess'))
          if (isUpdate)
            router.push({ name: 'exam-edit', params: { tab: 'info', id: res.data } })
          else
            router.push({ name: 'exam-list' })
          unload(idx)
        }).catch((err: Any) => {
          toast('ERROR', t(err?.response?.data?.message) || t('server-error'))
          unload(idx)
        })
      }
    }
    else {
      unload(idx)
    }
  })
}

async function getDataDetail() {
  const { data } = await MethodsUtil.requestApiCustom(QuestionService.GetDetailExam, TYPE_REQUEST.GET, { id: route.params.id })
  dataInput.value = data
}
if (route.params.id)
  getDataDetail()
</script>

<template>
  <div class="mt-6">
    <Form
      ref="formEdit"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <VRow class="flex-warp">
        <VCol
          cols="12"
          sm="4"
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
              :text="`${t('exam-name')}*`"
              :placeholder="t('exam-name')"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          sm="4"
        >
          <CmTextField
            v-model="dataInput.code"
            :text="t('code-exam')"
            :placeholder="t('code-exam')"
          />
        </VCol>
        <VCol
          cols="12"
          sm="4"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="dataInput.fromDate"
            name="fromDate"
            type="text"
          >
            <CmDateTimePicker
              :field="field"
              :errors="errors"
              :model-value="dataInput.fromDate"
              :text="`${t('start-time')}*`"
              :placeholder="t('start-time')"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          sm="4"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="dataInput.todate"
            name="todate"
            type="text"
          >
            <CmDateTimePicker
              :field="field"
              :errors="errors"
              :model-value="dataInput.todate"
              :text="`${t('end-time')}*`"
              :placeholder="t('end-time')"
            />
          </Field>
        </VCol>
      </VRow>
      <Field
        v-slot="{ field, errors }"
        v-model="dataInput.description"
        name="description"
        type="text"
      >
        <CmTextArea
          :field="field"
          :errors="errors"
          :text="`${t('description')}*`"
          :placeholder="t('description')"
        />
      </Field>
    </Form>

    <div class="d-flex justify-end mt-6">
      <CmButton
        :title="t('come-back')"
        color="secondary"
        variant="outlined"
        @click="router.push({ name: 'exam-list' })"
      />
      <CmButton
        :title="t('save')"
        class="ml-3"
        is-load
        @click="(idx, $unload) => saveExam(false, idx, $unload)"
      />
      <CmButton
        v-if="!route.params.id"
        class="ml-3"
        :title="t('save-and-update')"
        @click="saveExam(true)"
      />
    </div>
  </div>
</template>

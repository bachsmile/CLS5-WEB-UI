<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import toast from '@/plugins/toast'
import CmRadioGroup from '@/components/common/CmRadioGroup.vue'

import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import ExamService from '@/api/exam'

const props = withDefaults(defineProps<Props>(), ({
  numberUser: 0,
}))

const emit = defineEmits<Emit>()

const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
interface Props {
  isDialogVisible: boolean
  numberUser: number
  idShift: number
}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', data?: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const LABEL = Object.freeze({
  TITLE: t('add-student-auto'),
})
const optionType = ref([
  {
    label: t('Chọn theo chữ cái'),
    value: false,
  },
  {
    label: t('Chọn ngẫu nhiên'),
    value: true,
  },
])

/**
 * store
 */
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()

const schema = yup.object({
  numberUser: schemaOption.defaultNumberNoReqPosNoNulls(props.numberUser),
})
let apiInfo = reactive({
  shiftId: null as null | number,
  numberUser: 0 as null | number,
  testId: null as null | number,
  isRandom: false,
})
const myFormAdd = ref()

async function onCancel() {
  emit('update:isDialogVisible', false)
}
async function onConfirm(idx: number, unload: any) {
  myFormAdd.value.validate().then(async (success: any) => {
    if (success.valid) {
      apiInfo.testId = Number(route.params.thematicId)
      apiInfo.shiftId = props.idShift
      MethodsUtil.requestApiCustom(ExamService.PostSaveUserShiftAuto, TYPE_REQUEST.POST, apiInfo).then((result: any) => {
        toast('SUCCESS', t(result.message))
        unload(idx)
        emit('confirm')
        nextTick(() => {
          onCancel()
        })
      }).catch((err: any) => {
        toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
      })
    }
  })
}
watch(() => props.isDialogVisible, isShow => {
  if (isShow) {
    apiInfo = reactive({
      shiftId: null,
      testId: null,
      numberUser: 0,
      isRandom: false,
    })
  }
})
</script>

<template>
  <CmDialogs
    :is-dialog-visible="props.isDialogVisible"
    :title="LABEL.TITLE"
    close-on-back
    size="sm"
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
        v-model="apiInfo.numberUser"
        name="numberUser"
        type="number"
      >
        <div class="d-flex align-center">
          <div>{{ t('amount-student') }}</div>
          <div style="width: 110px">
            <CmTextField
              :model-value="apiInfo.numberUser"
              :field="field"
              :errors="errors"
              class="mx-4 my-6"
              type="number"
              @update:model-value="($value) => apiInfo.numberUser = Number($value)"
            />
          </div>
          <div>{{ t('count-student', { count: numberUser }) }}</div>
        </div>
      </Field>
    </Form>
    <div class="text-semibold-md mb-4">
      {{ t('select-candidates') }}
    </div>
    <div class="mb-6">
      <CmRadioGroup
        v-model="apiInfo.isRandom"
        :option="optionType"
      />
    </div>
  </CmDialogs>
</template>

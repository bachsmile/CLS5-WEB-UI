<script setup lang="ts">
import CmTab from '@/components/common/CmTab.vue'
import { validatorStore } from '@/stores/validatator'
import CmTextField from '@/components/common/CmTextField.vue'
import CmDateTimePicker from '@/components/common/CmDateTimePicker.vue'
import CpActionFooterEdit from '@/components/page/gereral/CpActionFooterEdit.vue'
import CpShiftCandiates from '@/components/page/Admin/exam/edit/thematic/components/CpShiftCandiates.vue'
import CpShiftTestCode from '@/components/page/Admin/exam/edit/thematic/components/CpShiftTestCode.vue'
import toast from '@/plugins/toast'

import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import ExamService from '@/api/exam'

const props = withDefaults(defineProps<Props>(), {
  idShift: 0,
})

const emit = defineEmits<Emit>()
interface Props {
  idShift?: number
}
interface Emit {
  (e: 'cancel'): void
}
const route = useRoute()
const storeValidate = validatorStore()

const { schemaOption, Field, Form, useForm, yup, ruleMessage } = storeValidate
const { submitForm } = useForm()
const { t } = window.i18n()
const schema = reactive({
  name: schemaOption.requiredString(),
  fromDate: schemaOption.defaultString,
  todate: schemaOption.defaultString,
})
const idShiftValue = ref(0)
const isDisabled = computed(() => !idShiftValue.value)
watch(() => props.idShift, (val: number) => {
  if (val) {
    idShiftValue.value = val
    getByIdShift()
  }
}, { immediate: true })

/**
 *
 * tab
 */

function listTabCandidate() {
  return [
    {
      key: 'info',
      title: 'info',
      isSlot: true,
      isRendered: true,
    },
    {
      key: 'list-candidates',
      title: 'list-candidates',
      isSlot: true,
      isRendered: false,
      isDisabled: isDisabled.value,
    },
    {
      key: 'exam-supervision',
      title: 'exam-supervision',
      isSlot: true,
      isRendered: false,
      isDisabled: isDisabled.value,
    },
    {
      key: 'test-code',
      title: 'test-code',
      isSlot: true,
      isRendered: false,
      isDisabled: isDisabled.value,
    },
  ]
}
const dataInput = ref<any>({
  name: '',
  fromDate: null,
  testId: Number(route.params.thematicId),
  todate: null,
})
const myFormShift = ref()
async function confirm(idx: number, unload: any) {
  await myFormShift.value.validate().then((success: any) => {
    if (success.valid) {
      MethodsUtil.requestApiCustom(ExamService.PostCreateShift, TYPE_REQUEST.POST, dataInput.value).then((result: any) => {
        toast('SUCCESS', t(result.message) || t('note-add-infor-shift'))
        idShiftValue.value = result.data
      }).catch((err: any) => {
        toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
      })
    }
  })
  unload(idx)
}
async function getByIdShift() {
  const params = {
    id: idShiftValue.value,
  }
  MethodsUtil.requestApiCustom(ExamService.GetShiftById, TYPE_REQUEST.GET, params).then((result: any) => {
    dataInput.value = result.data
  }).catch((err: any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
  })
}
</script>

<template>
  <div>
    <CmTab
      :is-render="true"
      :list-tab="listTabCandidate()"
      label="type"
      is-un-query
    >
      <template #default="{ context }">
        <div
          v-if="context.key === 'info'"
          class="mt-6"
        >
          <Form
            ref="myFormShift"
            :validation-schema="schema"
            class="mt-3"
            @submit.prevent="submitForm"
          >
            <VRow class="flex-wrap">
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
                    :text="`${t('name-exam-antholory')}*`"
                    :placeholder="t('name-exam-antholory')"
                  />
                </Field>
              </VCol>

              <VCol
                cols="12"
                sm="4"
              >
                <Field
                  v-slot="{ field, errors }"
                  :model-value="dataInput.fromDate"
                  name="fromDate"
                  type="text"
                >
                  <CmDateTimePicker
                    v-model:model-value="dataInput.fromDate"
                    :field="field"
                    :errors="errors"
                    :max-date="dataInput.todate"
                    :text="`${t('start-time')}*`"
                  />
                </Field>
              </VCol>
              <VCol
                cols="12"
                sm="4"
              >
                <Field
                  v-slot="{ field, errors }"
                  :model-value="dataInput.todate"
                  name="todate"
                  type="text"
                >
                  <CmDateTimePicker
                    v-model:model-value="dataInput.todate"
                    :field="field"
                    :errors="errors"
                    :min-date="dataInput.fromDate"
                    :text="`${t('end-time')}*`"
                  />
                </Field>
              </VCol>
            </VRow>
          </Form>
          <VRow>
            <VCol class="mt-6">
              <CpActionFooterEdit
                is-save
                :title-save="t('save')"
                :title-cancel="t('come-back')"
                @on-cancel="emit('cancel')"
                @on-save="(idx: number, unload: any) => confirm(idx, unload)"
              />
            </VCol>
          </VRow>
        </div>
        <div v-if="context.key === 'list-candidates'">
          <CpShiftCandiates
            :id-shift="idShiftValue"
            :type-id="1"
            :type-id-md="6"
            :type-title-name="t('name-candidates')"
          />
        </div>
        <div v-if="context.key === 'exam-supervision'">
          <CpShiftCandiates
            :id-shift="idShiftValue"
            title="monitors"
            title-custom-btn="add-monitoring"
            :type-id="2"
            :type-id-md="7"
            :type-title-name="t('name-monitoring')"
          />
        </div>
        <div v-if="context.key === 'test-code'">
          <CpShiftTestCode :id-shift="idShiftValue" />
        </div>
      </template>
    </CmTab>
  </div>
</template>

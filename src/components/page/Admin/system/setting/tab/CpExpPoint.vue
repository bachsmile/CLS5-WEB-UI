<script lang="ts" setup>
import type { Item } from 'vue3-easy-data-table'
import CmTable from '@/components/common/CmTable.vue'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import CpActionFooterEdit from '@/components/page/gereral/CpActionFooterEdit.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import UserService from '@/api/user/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Any } from '@/typescript/interface'
import toast from '@/plugins/toast'
import { validatorStore } from '@/stores/validatator'

const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, FieldArray, yup, ruleMessage } = storeValidate
const { t } = window.i18n()
const headers = reactive([
  { text: '', value: 'checkbox' },
  { text: t('criteria-calculate-experience-point'), value: 'criteria', type: 'custom' },
  { text: t('point'), value: 'point', type: 'custom' },
  { text: t('multiply-the-actual-percentage'), value: 'isRatio', width: 200, type: 'custom' },
])
function getCriteriaById(criteriaId: number) {
  switch (criteriaId) {
    case 1:
      return t('attendance')
    case 2:
      return t('complete-course-content')
    case 3:
      return t('complete-course')
    case 4:
      return t('complete-survey-topic')
    case 5:
      return t('complete-exam-topic')
    case 6:
      return t('complete-learning-route-step')
    case 7:
      return t('complete-route')
    case 8:
      return t('view-document')
    case 9:
      return t('time-learn')
    default:
      return t('unknown')
  }
}

const items = ref<Item[]>([
  {
    id: 0,
    criteriaId: 1,
    isRatio: false,
    point: 0,
  },
  {
    id: 0,
    criteriaId: 2,
    isRatio: false,
    point: 0,
  },
  {
    id: 0,
    criteriaId: 3,
    isRatio: false,
    point: 0,
  },
  {
    id: 0,
    criteriaId: 4,
    isRatio: false,
    point: 0,
  },
  {
    id: 0,
    criteriaId: 5,
    isRatio: false,
    point: 0,
  },
  {
    id: 0,
    criteriaId: 6,
    isRatio: false,
    point: 0,
  },
  {
    id: 0,
    criteriaId: 7,
    isRatio: false,
    point: 0,
  },
  {
    id: 0,
    criteriaId: 8,
    isRatio: false,
    point: 0,
  },
  {
    id: 0,
    criteriaId: 9,
    isRatio: false,
    point: 0,
  },
])

const schema = yup.object({
  listPoint: yup.array().of(
    yup.object().shape({
      point: yup.number().typeError(ruleMessage.typeNumber).nullable().min(0, t('min-value', { val: 0 })).required(ruleMessage.required()),
    }),
  ),
})

function getSettingExpPoint() {
  MethodsUtil.requestApiCustom(UserService.GetSettingExpPoint, TYPE_REQUEST.GET).then((result: Any) => {
    if (result?.data)
      items.value = result?.data
  })
}
onMounted(() => {
  getSettingExpPoint()
})

const isChange = ref(false)
function updatePoint(idx: number, val: number) {
  isChange.value = true
  items.value[idx].point = val
}

function updateRatio(idx: number, val: boolean) {
  isChange.value = true
  items.value[idx].isRatio = val
}
const myForm = ref()
async function handleSaveExpPoint(idx: number, unloadButton: any) {
  await myForm.value.validate().then(async (result: Any) => {
    if (result.valid) {
      await MethodsUtil.requestApiCustom(UserService.PutUpdateExpPoint, TYPE_REQUEST.PUT, { experiences: items.value }).then((result: Any) => {
        toast('SUCCESS', t('USR_UpdateSuccess'))
      }).catch((err: Any) => {
        toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
      })
    }
  })
  unloadButton()
}
</script>

<template>
  <div class="mt-5">
    <Form
      ref="myForm"
      :validation-schema="schema"
      @submit.prevent="useForm"
    >
      <FieldArray
        name="listPoint"
      >
        <CmTable
          :headers="headers"
          :items="items"
          :disiable-pagination="true"
        >
          <template #rowItem="{ col, context }">
            <div v-if="col === 'criteria'">
              {{ getCriteriaById(context.criteriaId) }}
            </div>
            <div v-if="col === 'point'">
              <div
                class="d-flex align-center"
              >
                <div style="width: 70px;">
                  <Field
                    v-slot="{ field, errors }"
                    :model-value="context.point"
                    :name="`listPoint[${context.originIndex}].point`"
                    type="number"
                  >
                    <CmTextField
                      v-model:model-value="context.point"
                      :field="field"
                      :errors="errors"
                      @update:model-value="updatePoint(context.originIndex, $event)"
                    />
                  </Field>
                </div>
                <span
                  v-if="context.criteriaId === 9"
                  class="ml-1"
                >/ {{ t('minute') }}</span>
              </div>
            </div>
            <div v-if="col === 'isRatio'">
              <div class="d-flex justify-center">
                <CmCheckBox
                  v-if="context.criteriaId !== 9"
                  v-model="context.isRatio"
                  :disabled="context.point < 1 || (context.criteriaId === 1 || context.criteriaId === 4)"
                  @update:model-value="updateRatio(context.originIndex, $event)"
                />
              </div>
            </div>
          </template>
        </CmTable>
      </FieldArray>
    </form>
    <CpActionFooterEdit
      class="mt-4"
      is-save
      :is-cancel="false"
      @on-save="handleSaveExpPoint"
    />
  </div>
</template>

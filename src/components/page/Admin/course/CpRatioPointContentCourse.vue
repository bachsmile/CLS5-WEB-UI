<script setup lang="ts">
import { courseApproveManagerStore } from '@/stores/admin/course/approve'
import { validatorStore } from '@/stores/validatator'
import constant from '@/constant/constant'
import MethodsUtil from '@/utils/MethodsUtil'

const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CpActionHeaderPage = defineAsyncComponent(() => import('@/components/page/gereral/CpActionHeaderPage.vue'))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/** store */
const storeCourseApproveManager = courseApproveManagerStore()
const { rowsScore, myFormScore, disabledPoint, pointSetting } = storeToRefs(storeCourseApproveManager)
const { valueChange, autoUpdatePoint, updatePointSetting, selectedRowsPoint } = storeCourseApproveManager
const storeValidate = validatorStore()
const { schemaOption, Field, Form, FieldArray, useForm, yup } = storeValidate
const { submitForm } = useForm()
const schema = yup.object({
  content: yup.array().of(
    yup.object().shape({
      point: schemaOption.defaultNumberRatio,
    }),
  ),
  pointSetting: schemaOption.defaultNumber100Not0YubNoRequire,
})

/** data */
const headersScore = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-content'), value: 'name' },
  { text: t('factor'), value: 'point', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
])
</script>

<template>
  <div>
    <Form
      ref="myFormScore"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <div>
        <CpActionHeaderPage
          :title-custom-add="t('auto-seting')"
          :title="t('content-list')"
          is-custom-add-btn
          @click="autoUpdatePoint"
        />
      </div>
      <div class="mb-6 d-flex justify-start">
        <CmButton
          :title="t('setting-ratio')"
          color="primary"
          variant="tonal"
          class="mr-3"
          :disabled="disabledPoint"
          @click="updatePointSetting"
        />
        <Field
          v-slot="{ field, errors }"
          v-model="pointSetting"
          name="pointSetting"
        >
          <div>
            <CmTextField
              :field="field"
              :disabled="disabledPoint"
              class="input-point-setting"
              type="number"
              :min="1"
              :max="100"
            />
            <div
              v-if="errors?.length > 0"
              class="styleError text-errors"
            >
              {{ t(MethodsUtil.showErrorsYub(errors)) }}
            </div>
          </div>
        </Field>
      </div>
      <FieldArray
        name="content"
      >
        <CmTable
          :headers="headersScore"
          :items="rowsScore"
          disiable-pagination
          return-object
          custom-id="courseContentId"
          @update:selected="selectedRowsPoint"
        >
          <template #rowItem="{ col, context }">
            <div v-if="col === 'point'">
              <Field
                v-slot="{ field, errors }"
                v-model="context.point"
                :value="1"
                :name="`content[${context.originIndex}].point`"
              >
                <CmTextField
                  :field="field"
                  :errors="errors"
                  type="number"
                  :min="constant.MIN_NUMBER"
                  :max="constant.MAX_NUMBER"
                  @update:model-value="valueChange(Number($event), context)"
                />
              </Field>
            </div>
          </template>
        </CmTable>
      </FieldArray>
    </Form>
  </div>
</template>

<style lang="scss">
.input-point-setting{
  width: 192px;
}
</style>

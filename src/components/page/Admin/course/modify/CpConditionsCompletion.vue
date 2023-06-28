<script setup lang="ts">
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import constant from '@/constant/constant'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import CourseService from '@/api/course/index'
import { validatorStore } from '@/stores/validatator'
import toast from '@/plugins/toast'

const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))

/**
 * store
 */
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()

const schema = yup.object({
  requiredContentQuantity: schemaOption.defaultNumberNot0,
})

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const router = useRouter()
const isAmount = ref(false)
const myFormAddRequiredComplete = ref()
const condition = ref<any>({
  requiredContentQuantity: null,
})
async function fetchCondition() {
  const params = {
    id: Number(route.params.id),
  }
  await MethodsUtil.requestApiCustom(CourseService.GetRequiredFinishCourse, TYPE_REQUEST.GET, params).then((value: any) => {
    condition.value = value.data
    if (condition.value.requiredContentQuantity > 0)
      isAmount.value = true
  })
}
function onCancel() {
  router.push({ name: 'course-list' })
}
async function handleSave() {
  if (isAmount.value) {
    myFormAddRequiredComplete.value.validate().then(async (success: any) => {
      if (success.valid) {
        if (condition.value.requiredContentQuantity > condition.value.totalRequireContent) {
          toast('WARNING', t('amount-required-invalid'))
          return
        }
        else if (condition.value.requiredContentQuantity <= 0) {
          toast('WARNING', t('amount-content-meaning'))
          return
        }
        await MethodsUtil.requestApiCustom(CourseService.PostUpdateFinishRequired, TYPE_REQUEST.POST, condition).then((value: any) => {
          toast('SUCCESS', t(value.message))
        }).catch((error: any) => {
          toast('ERROR', t(error.response.data.message))
        })
      }
    })
  }
  else {
    condition.requiredContentQuantity = 0
  }
}
onMounted(() => {
  fetchCondition()
})
</script>

<template>
  <div class="mt-4">
    <div class="text-semibold-md">
      {{ t('setting-conditions') }}
    </div>
    <div>
      <CmCheckBox
        v-model="isAmount"
        :disabled="!condition.totalRequireContent"
        class="mr-2"
      >
        <span class="text-medium-md mr-4">{{ t('number-achieved') }}</span>
        <div
          v-if="isAmount"
        >
          <Form
            ref="myFormAddRequiredComplete"
            :validation-schema="schema"
            @submit.prevent="submitForm"
          >
            <Field
              v-slot="{ field, errors }"
              v-model="condition.requiredContentQuantity"
              name="requiredContentQuantity"
              type="number"
            >
              <div class="d-flex align-center">
                <div class="mr-3 conditon-input">
                  <CmTextField
                    :field="field"
                    type="number"
                    :min="1"
                    :max="constant.MAX_NUMBER"
                  />
                </div>
                <span class="text-regular-md">/{{ condition.totalRequireContent }} {{ t('content').toLowerCase() }}</span>
              </div>
              <div class="styleError text-errors">
                {{ errors[0] }}
              </div>
            </Field>
          </Form>
        </div>
      </CmCheckBox>
    </div>
    <div>
      <CpActionFooterEdit
        is-cancel
        is-save
        :title-cancel="t('come-back')"
        :title-save="t('save')"
        @onCancel="onCancel"
        @onSave="handleSave"
      />
    </div>
  </div>
</template>

<style lang="scss">
.conditon-input{
  width:  4.5rem;
}
</style>

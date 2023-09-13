<script lang="ts" setup>
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import { validatorStore } from '@/stores/validatator'
import MethodsUtil from '@/utils/MethodsUtil'

const props = withDefaults(defineProps<Props>(), {
  displayFirstTime: 0,
  totalQuestionDisplayInPage: 0,
  maxTotalQuestion: 0,
})
const emit = defineEmits<Emit>()
const { t } = window.i18n()
interface Props {
  displayFirstTime: number
  totalQuestionDisplayInPage: number
  maxTotalQuestion: number
}
interface Emit {
  (e: 'update:displayFirstTime', total: number): void
  (e: 'update:totalQuestionDisplayInPage', total: number): void
}

const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()

const isShowNumberPage = ref(false)
const isShowDisplayFirst = ref(false)
const displayFirstTimeData = ref(0)

watch(() => props.displayFirstTime, val => {
  if (val && val > 0) {
    isShowDisplayFirst.value = true
    displayFirstTimeData.value = val
  }
}, { immediate: true })
const totalQuestionDisplayInPageData = ref(0)
watch(() => props.totalQuestionDisplayInPage, val => {
  if (val && val > 0) {
    totalQuestionDisplayInPageData.value = val
    isShowNumberPage.value = true
  }
}, { immediate: true })

const myForm = ref()
const schema = computed(() => yup.object({
  totalQuestionDisplayInPageData: schemaOption.defaultNumberNoReqNoNullsMaxValue(props.maxTotalQuestion),
  displayFirstTimeData: schemaOption.defaultNumberNoReqPosNoNull,
}))
function clearDistPlayInPage(val: boolean) {
  if (!val)
    totalQuestionDisplayInPageData.value = 0
}
defineExpose({
  myForm,
})
</script>

<template>
  <div>
    <div class="text-semibold-md">
      {{ t('setting-custom') }}
    </div>
    <Form
      ref="myForm"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <VRow>
        <VCol
          cols="12"
          lg="4"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="totalQuestionDisplayInPageData"
            name="totalQuestionDisplayInPageData"
            type="text"
          >
            <div
              class="d-flex align-center"
              style="height: 44px;"
            >
              <CmCheckBox
                v-model:model-value="isShowNumberPage"
                @update:model-value="clearDistPlayInPage"
              >
                {{ t('number-pages') }}
              </CmCheckBox>
              <div
                v-if="isShowNumberPage"
                class="ml-2 d-flex align-center"
              >
                <CmTextField
                  :field="field"
                  :errors="errors"
                  :model-value="totalQuestionDisplayInPageData"
                  style="width: 60px;"
                  :is-show-errors="false"
                  @update:model-value="emit('update:totalQuestionDisplayInPage', $event)"
                />

                <span class="text-medium-md ml-2">
                  {{ t('question') }}
                </span>
              </div>
            </div>
            <div
              v-if="errors?.length > 0"
              class="styleError text-errors w-100 d-flex justify-center"
            >
              {{ t(MethodsUtil.showErrorsYub(errors)) }}
            </div>
          </Field>
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
          lg="4"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="displayFirstTimeData"
            name="displayFirstTimeData"
            type="text"
          >
            <div
              class="d-flex align-center"
              style="height: 44px;"
            >
              <CmCheckBox v-model:model-value="isShowDisplayFirst">
                {{ t('countdown-on-exam') }}
              </CmCheckBox>
              <div
                v-if="isShowDisplayFirst"
                class="ml-2 d-flex align-center"
              >
                <CmTextField
                  :model-value="displayFirstTimeData"
                  style="width: 60px;"
                  :field="field"
                  :is-show-errors="false"
                  :errors="errors"
                  @update:model-value="emit('update:displayFirstTime', $event)"
                />
                <span class="text-medium-md ml-2">
                  {{ t('minute') }}
                </span>
              </div>
            </div>

            <div
              v-if="errors?.length > 0"
              class="styleError text-errors w-100 d-flex justify-center"
            >
              {{ t(MethodsUtil.showErrorsYub(errors)) }}
            </div>
          </Field>
        </VCol>
      </VRow>
    </Form>
  </div>
</template>

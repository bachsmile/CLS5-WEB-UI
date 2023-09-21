<script lang="ts" setup>
import CmTextField from '@/components/common/CmTextField.vue'
import CpTopicSelect from '@/components/page/gereral/CpTopicSelect.vue'
import CmDateTimePicker from '@/components/common/CmDateTimePicker.vue'
import CmRadio from '@/components/common/CmRadio.vue'
import { validatorStore } from '@/stores/validatator'
import CmSelect from '@/components/common/CmSelect.vue'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import ComboboxService from '@/api/combobox/index'
import CmSwitch from '@/components/common/CmSwitch.vue'
import CpActionFooterEdit from '@/components/page/gereral/CpActionFooterEdit.vue'

const route = useRoute()
// eslint-disable-next-line vue/define-macros-order
const props = withDefaults(defineProps<Props>(), {
  data: null,
})

const emit = defineEmits<Emit>()

const storeValidate = validatorStore()

const { schemaOption, Field, Form, useForm, yup, ruleMessage } = storeValidate
const { submitForm } = useForm()
const { t } = window.i18n()
const schema = reactive({
  name: schemaOption.requiredString(),
  topicId: schemaOption.defaultSelectSingle,
  fromDate: schemaOption.defaultString,
  todate: schemaOption.defaultString,
  ratingScale: schemaOption.defaultSelectSingle,
  certificationTemplateId: schemaOption.defaultSelectSingle,
})

interface Props {
  data?: DataInput | null
}
interface Emit {
  (e: 'update:data', data: DataInput): void
  (e: 'cancel'): void
  (e: 'confirm', update: boolean, idbtn: number, unload: any): void
}
const router = useRouter()
interface DataInput {
  fromDate: any
  isHandWork: boolean
  isShift: boolean
  name: string
  examId: number
  todate: any
  topicId: number | null
  id?: number
  ratingScale?: number | null
  certificationTemplateId?: number | null
}

const dataInput = ref<DataInput>({
  name: '',
  fromDate: null,
  examId: Number(route.params.id),
  todate: null,
  topicId: null,
  ratingScale: null,
  certificationTemplateId: null,
  isHandWork: true,
  isShift: false,
})

const myForm = ref()
watch(() => props.data, val => {
  if (val)
    dataInput.value = val
}, { immediate: true })
const isSubmit = computed(() => {
  return myForm.value.validate
})

const comboboxRatingScale = ref<any[]>([])

// danh sách thang đánh giá
async function getComboboxRatingScale() {
  if (window._.isEmpty(comboboxRatingScale.value)) {
    window.requestApiCustom(ComboboxService.GetComboboxRatingScale, TYPE_REQUEST.GET).then((value: any) => {
      comboboxRatingScale.value = value?.data || []
    })
  }
}
const comboboxCertificate = ref<any[]>([])

// danh sách chứng nhận
function getComboboxCertificate() {
  if (window._.isEmpty(comboboxCertificate.value)) {
    const params = { type: 1 }
    window.requestApiCustom(ComboboxService.GetComboboxCertificate, TYPE_REQUEST.GET, params).then((value: any) => {
      comboboxCertificate.value = value?.data || []
    })
  }
}

// quay lại trang chuyên đề
function cancel() {
  emit('cancel')
}
if (route.params.thematicId) {
  getComboboxRatingScale()
  getComboboxCertificate()
}

defineExpose({
  isSubmit,
})
</script>

<template>
  <div class="mt-6">
    <Form
      ref="myForm"
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
              :text="`${t('name-test')}*`"
              :placeholder="t('name-test')"
              @update:model-value="emit('update:data', dataInput)"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          sm="4"
        >
          <Field
            v-slot="{ field, errors }"
            v-model:model-value="dataInput.topicId"
            name="topicId"
            type="number"
          >
            <CpTopicSelect
              v-model:model-value="dataInput.topicId"
              :field="field"
              :errors="errors"
              :type="3"
              :text="`${t('topic')}*`"
              :placeholder="t('choose-topic')"
              @update:model-value="emit('update:data', dataInput)"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          sm="4"
        >
          <Field
            v-slot="{ field, errors }"
            :model-value="dataInput.ratingScale"
            name="ratingScale"
            type="number"
          >
            <CmSelect
              v-model:model-value="dataInput.ratingScale"
              :clearable="false"
              :field="field"
              :errors="errors"
              :items="comboboxRatingScale"
              item-value="key"
              custom-key="value"
              :text="`${t('rating-scale')}*`"
              :placeholder="t('rating-scale')"
              @open="getComboboxRatingScale"
              @update:model-value="emit('update:data', dataInput)"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          sm="4"
        >
          <Field
            v-slot="{ field, errors }"
            :model-value="dataInput.certificationTemplateId"
            name="certificationTemplateId"
            type="number"
          >
            <CmSelect
              v-model:model-value="dataInput.certificationTemplateId"
              :clearable="false"
              :field="field"
              :errors="errors"
              :items="comboboxCertificate"
              item-value="key"
              custom-key="value"
              :text="`${t('certification-template')}*`"
              :placeholder="t('choose-template-cert')"
              @open="getComboboxCertificate"
              @update:model-value="emit('update:data', dataInput)"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          sm="4"
        >
          <Field
            v-slot="{ field, errors }"
            v-model:model-value="dataInput.fromDate"
            name="fromDate"
            type="text"
          >
            <CmDateTimePicker
              :model-value="dataInput.fromDate"
              :field="field"
              :errors="errors"
              :max-date="dataInput.todate"
              :text="`${t('start-time')}*`"
              @update:model-value="emit('update:data', dataInput)"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          sm="4"
        >
          <Field
            v-slot="{ field, errors }"
            v-model:model-value="dataInput.todate"
            name="todate"
            type="text"
          >
            <CmDateTimePicker
              :model-value="dataInput.todate"
              :field="field"
              :errors="errors"
              :min-date="dataInput.fromDate"
              :text="`${t('end-time')}*`"
              @update:model-value="emit('update:data', dataInput)"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          sm="4"
        >
          <label class="text-medium-sm color-dark">{{ t('method-create-test') }}</label>
          <div class="mt-2">
            <VRow>
              <VCol lg="6">
                <div class="d-flex align-center">
                  <CmRadio
                    v-model="dataInput.isHandWork"
                    name="type"
                    :value="true"
                    @update:model-value="emit('update:data', dataInput)"
                  />
                  <label class="ml-2">{{ t('handmade-create') }}</label>
                </div>
              </VCol>
              <VCol lg="6">
                <div class="d-flex align-center">
                  <CmRadio
                    v-model="dataInput.isHandWork"
                    name="type"
                    :value="false"
                    @update:model-value="emit('update:data', dataInput)"
                  />
                  <label class="ml-2">{{ t('auto-create') }}</label>
                </div>
              </VCol>
            </VRow>
          </div>
        </VCol>
        <VCol
          cols="12"
          sm="4"
          class="mt-2 d-flex align-end"
        >
          <CmSwitch
            v-model="dataInput.isShift"
            :label="t('divided-by-shifts')"
            :type="2"
            color="primary"
            class="mbn-2"
            @update:model-value="emit('update:data', dataInput)"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol class="mt-6">
          <CpActionFooterEdit
            is-save
            :is-save-and-update="!route.params.thematicId"
            :title-save="t('save')"
            :title-save-and-update="t('save-and-update')"
            :title-cancel="t('come-back')"
            @on-cancel="cancel"
            @on-save="(idx: number, unload: any) => emit('confirm', false, idx, unload)"
            @on-save-update="(idx: number, unload: any) => emit('confirm', true, idx, unload) "
          />
        </VCol>
      </VRow>
    </Form>
  </div>
</template>

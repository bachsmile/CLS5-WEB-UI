<script setup lang="ts">
import { comboboxStore } from '@/stores/combobox'
import ShareService from '@/api/shared/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import { validatorStore } from '@/stores/validatator'
import toast from '@/plugins/toast'
import { courseManagerStore } from '@/stores/admin/course/course'

const props = withDefaults(defineProps<Props>(), {
  isShowModalAddCost: false,
  excludeIds: [],
})

const emit = defineEmits<Emit>()

const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const CmTextArea = defineAsyncComponent(() => import('@/components/common/CmTextArea.vue'))

interface Props {
  isShowModalAddCost: boolean
  excludeIds?: any
  courseId?: number
  cost?: any
}
interface Emit {
  (e: 'update:isShowModalAddCost', value: any): void
  (e: 'saveChange'): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

/**
 * store
 */
const combobox = comboboxStore()
const { compoboxCostTypes } = storeToRefs(combobox)
const { categoryCostCombobox } = combobox

const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()

const storecourseManager = courseManagerStore()
const { costData } = storeToRefs(storecourseManager)
const { resetStateCostData } = storecourseManager

/** setting validate */
const schema = yup.object({
  name: schemaOption.defaultString,
  costTypeId: schemaOption.defaultSelectSingle,
  unitPrice: schemaOption.defaultNumber,
  description: schemaOption.defaultString,
})

const myFormAddCost = ref()

/** state */
const LABEL = Object.freeze({
  TITLE: t('add-cost'),
  TITLE1: `${t('cost-name')}*`,
  TITLE2: `${t('cost-type')}*`,
  TITLE3: `${t('money')}*`,
})
const data = reactive({
  deleteIds: [], // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})
const queryParams = ref({
  keyword: '',
  pageNumber: 1,
  pageSize: 10,
  excludeListId: [] as any,
})
const headers = ref([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-course'), value: 'name' },
  { text: t('topic'), value: 'topicCostName' },
])
const items = ref()
const totalRecord = ref(0)

/** method */
async function onCancel() {
  emit('update:isShowModalAddCost', false)
}
async function onConfirm() {
  if (costData.value.unitPrice !== null && costData.value.unitPrice.length > 0) {
    const amount = Number.parseFloat(costData.value.unitPrice)
    if (Number.isNaN(amount)) {
      toast('ERROR', t('number-invalids'))
      return
    }
  }
  myFormAddCost.value.validate().then(async (success: any) => {
    if (success.valid) {
      costData.value.courseId = props.courseId
      await MethodsUtil.requestApiCustom(costData.value?.id ? ShareService.PostUpdateCost : ShareService.PostCreateCost, TYPE_REQUEST.POST, costData.value).then((value: any) => {
        toast('SUCCESS', t(value.message))
        emit('saveChange')
        nextTick(() => {
          emit('update:isShowModalAddCost', false)
        })
      })
        .catch((error: any) => {
          toast('ERROR', t(error.response.data.message))
        })
    }
  })
}

function selectedRows(e: any) {
  data.selectedRowsIds = e
}

watch(() => props.isShowModalAddCost, isShow => {
  if (isShow) {
    if (!compoboxCostTypes.value?.length)
      categoryCostCombobox()
  }
  else {
    resetStateCostData()
  }
})
</script>

<template>
  <div>
    <CmDialogs
      :title="LABEL.TITLE"
      :is-dialog-visible="isShowModalAddCost"
      :button-ok-name="t('save')"
      close-on-back
      persistent
      @cancel="onCancel"
      @confirm="onConfirm"
    >
      <Form
        ref="myFormAddCost"
        :validation-schema="schema"
        @submit.prevent="submitForm"
      >
        <Field
          v-slot="{ field, errors }"
          v-model="costData.name"
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
          v-model:model-value="costData.costTypeId"
          name="costTypeId"
        >
          <CmSelect
            :model-value="costData.costTypeId"
            :field="field"
            :errors="errors"
            append-to-body
            :items="compoboxCostTypes"
            item-value="key"
            custom-key="value"
            :text="LABEL.TITLE1"
            :placeholder="LABEL.TITLE2"
            class="mb-4"
          />
        </Field>
        <Field
          v-slot="{ field, errors }"
          v-model="costData.unitPrice"
          name="unitPrice"
          type="number"
        >
          <CmTextField
            :field="field"
            :errors="errors"
            :text="LABEL.TITLE3"
            type="number"
            :placeholder="LABEL.TITLE3"
            class="mb-4"
          />
        </Field>
        <Field
          v-slot="{ field, errors }"
          v-model="costData.description"
          name="description"
          type="text"
        >
          <CmTextArea
            v-model="costData.description"
            :field="field"
            :errors="errors"
            :text="t('description')"
            :placeholder="t('description')"
          />
        </Field>
      </Form>
    </CmDialogs>
  </div>
</template>

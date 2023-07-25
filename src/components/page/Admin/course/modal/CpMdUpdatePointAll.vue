<script setup lang="ts">
import CmTextField from '@/components/common/CmTextField.vue'
import StringUtil from '@/utils/StringUtil'
import { validatorStore } from '@/stores/validatator'
import { load } from '@/stores/loadComponent.js'

const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
})
const emit = defineEmits<Emit>()
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
interface Props {
  isShowModal: boolean
  qrCode?: any
}
interface Emit {
  (e: 'update:isShowModal', value: any): void
  (e: 'update:changeAll', value: any): void
}

/** store */
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const schema = yup.object({
  point: schemaOption.defaultNumber,
})
const store = load()
const { unLoadComponent } = store
const pointSetting = ref<null | number>(null)
const myFormUpdatePointAll = ref()

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
async function onCancel() {
  emit('update:isShowModal', false)
}
async function onConfirm(idx: any) {
  myFormUpdatePointAll.value.validate().then(async (success: any) => {
    if (success.valid) {
      emit('update:changeAll', pointSetting.value)
      emit('update:isShowModal', false)
    }
    unLoadComponent(idx)
  })
}

// thay đổi điểm
function changePoint(event: any) {
  pointSetting.value = StringUtil.decimalToFixed(Number(event), 4)
}
</script>

<template>
  <div>
    <CmDialogs
      :title="t('update-point')"
      :button-ok-name="t('save')"
      close-on-back
      persistent
      :is-dialog-visible="isShowModal"
      @cancel="onCancel"
      @confirm="onConfirm"
    >
      <Form
        ref="myFormUpdatePointAll"
        :validation-schema="schema"
        @submit.prevent="submitForm"
      >
        <Field
          v-slot="{ field, errors }"
          v-model="pointSetting"
          name="point"
          type="text"
        >
          <CmTextField
            :field="field"
            :errors="errors"
            :model-value="pointSetting"
            :text="t('point')"
            :placeholder="t('point')"
            type="number"
            :min="0"
            :max="100"
            is-null-number
            :maxlength="3"
            @change="changePoint(pointSetting)"
          />
        </Field>
      </Form>
    </CmDialogs>
  </div>
</template>

<style lang="scss">
.box-zoom{
  background-color: #fff;
  border-radius: 12px;
  .box-img-qr {
    width: 600px;
  }
}
</style>

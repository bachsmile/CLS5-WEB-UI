<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import CmDateTimePicker from '@/components/common/CmDateTimePicker.vue'
import { load } from '@/stores/loadComponent.js'
import toast from '@/plugins/toast'

const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
})
const emit = defineEmits<Emit>()
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
interface Props {
  isShowModal: boolean
  content?: any
}
interface Emit {
  (e: 'update:isShowModal', value: any): void
  (e: 'confirm', value: any): void
}
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const store = load()
const { unLoadComponent } = store

const dateTimeQr = ref({
  startDateTime: null,
  endDateTime: null,
})
const schema = computed(() => ({
  startDateTime: schemaOption.defaultString,
  endDateTime: schemaOption.defaultString,
}))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

// computed
const startDateTime = computed(() => {
  if (!dateTimeQr.value.startDateTime)
    return ''
  return new Date(dateTimeQr.value.startDateTime).toISOString()
})
const endDateTime = computed(() => {
  if (!dateTimeQr.value.endDateTime)
    return ''
  return new Date(dateTimeQr.value.endDateTime).toISOString()
})
const dateRollCall = computed(() => {
  if (!props.content.dateRollCall)
    return ''
  return props.content.dateRollCall
})
const isShow = ref(false)
function show() {
//
}
function resetData() {
  dateTimeQr.value = {
    startDateTime: null,
    endDateTime: null,
  }
  isShow.value = false
}
const myFormAddExpAttend = ref()
async function onConfirm(idx: any) {
  await myFormAddExpAttend.value.validate().then((success: any) => {
    if (success.valid) {
      if (!startDateTime.value || !endDateTime.value) {
        toast('ERROR', t('noti-date-empty-qr'))
        unLoadComponent(idx)
        return
      }
      if (success)
        emit('confirm', dateTimeQr.value)
    }
    unLoadComponent(idx)
  })
}
async function onCancel() {
  emit('update:isShowModal', false)
}
</script>

<template>
  <div>
    <CmDialogs
      :is-dialog-visible="isShowModal"
      close-on-back
      :title="t('exp-attendance')"
      :button-ok-name="t('save')"
      persistent
      @cancel="onCancel"
      @show="show"
      @hide="resetData"
      @confirm="onConfirm"
    >
      <Form
        ref="myFormAddExpAttend"
        :validation-schema="schema"
      >
        <VRow>
          <VCol
            cols="12"
            sm="6"
          >
            <Field
              v-slot="{ field, errors }"
              v-model="dateTimeQr.startDateTime"
              name="startDateTime"
              type="text"
            >
              <CmDateTimePicker
                :key="endDateTime"
                :model-value="dateTimeQr.startDateTime"
                :field="field"
                :errors="errors"
                class="pb-2"
                :max-date="content?.dateRollCall || endDateTime"
                :min-date="content?.startDateRequire"
                :text="`${t('start-time')}*`"
                :placeholder="t('start-time')"
              />
            </Field>
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <Field
              v-slot="{ field, errors }"
              v-model="dateTimeQr.endDateTime"
              name="endDateTime"
              type="text"
            >
              <CmDateTimePicker
                :key="startDateTime"
                class="pb-2"
                :model-value="dateTimeQr.endDateTime"
                :field="field"
                :errors="errors"
                :max-date="content?.endDateRequire || ''"
                :min-date="content?.dateRollCall || startDateTime"
                :text="`${t('end-time')}*`"
                :placeholder="t('end-time')"
              />
            </Field>
          </VCol>
        </VRow>
      </Form>
    </CmDialogs>
  </div>
</template>

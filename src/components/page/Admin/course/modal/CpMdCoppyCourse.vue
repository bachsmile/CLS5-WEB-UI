<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import { typeDialog } from '@/constant/Globals'
import { courseManagerStore } from '@/stores/admin/course/course'
import CmCheckBox from '@/components/common/CmCheckBox.vue'

const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
  excludeIds: [],
})

const emit = defineEmits<Emit>()

const CmIconNoti = defineAsyncComponent(() => import('@/components/common/CmIconNoti.vue'))
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))

interface Props {
  isShowModal: boolean
  excludeIds?: any
  courseId?: number
  cost?: any
}
interface Emit {
  (e: 'update:isShowModal', value: any): void
  (e: 'saveChange'): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

/**
 * store
 */
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()

const storecourseManager = courseManagerStore()
const { coppyData } = storeToRefs(storecourseManager)
const { resetStatecoppyData } = storecourseManager

/** setting validate */
const schema = yup.object({
  name: schemaOption.defaultString,
})

const myFormCoppy = ref()

/** state */
const LABEL = Object.freeze({
  TITLE: t('coppy-course'),
  TITLE1: `${t('Course_Name')}*`,
})

/** method */
async function onCancel() {
  emit('update:isShowModal', false)
}
async function onConfirm() {
  myFormCoppy.value.validate().then(async (success: any) => {
    if (success.valid)
      emit('saveChange')
  })
}

watch(() => props.isShowModal, isShow => {
  if (!isShow)
    resetStatecoppyData()
})
</script>

<template>
  <div>
    <CmDialogs
      :is-dialog-visible="isShowModal"
      :button-ok-name="t('save')"
      close-on-back
      persistent
      @cancel="onCancel"
      @confirm="onConfirm"
    >
      <template #title>
        <div class="pt-2">
          <div class="mb-3">
            <CmIconNoti
              :type="2"
              :size="1"
            />
          </div>
          <div
            class="d-flex align-center"
            :class="`justify-${typeDialog}`"
          >
            {{ t(LABEL.TITLE) }}
          </div>
        </div>
      </template>

      <Form
        ref="myFormCoppy"
        :validation-schema="schema"
        @submit.prevent="submitForm"
      >
        <Field
          v-slot="{ field, errors }"
          v-model="coppyData.name"
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
        <div class="mb-2 text-medium-sm">
          {{ t('copy-component') }}
        </div>
        <VRow>
          <VCol
            cols="12"
            sm="6"
          >
            <CmCheckBox
              v-model="coppyData.teacher"
              :label="t('Teacher')"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <CmCheckBox
              v-model="coppyData.requiredFinish"
              :label="t('conditions-completion')"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <CmCheckBox
              v-model="coppyData.content"
              :label="t('content-lesson')"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <CmCheckBox
              v-model="coppyData.cost"
              :label="t('costs')"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <CmCheckBox
              v-model="coppyData.learner"
              :label="t('Learner')"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <CmCheckBox
              v-model="coppyData.setting"
              :label="t('setting-option')"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <CmCheckBox
              v-model="coppyData.requiredRegister"
              :label="t('course-attend-dk')"
            />
          </VCol>
        </VRow>
      </Form>
    </CmDialogs>
  </div>
</template>

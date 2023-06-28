<script setup lang="ts">
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import { validatorStore } from '@/stores/validatator'
import CourseService from '@/api/course/index'

const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
  excludeIds: [],
})

const emit = defineEmits<Emit>()

const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))

interface Props {
  isShowModal: boolean
  excludeIds?: any
  courseId?: number
  listContent?: any
}
interface Emit {
  (e: 'update:isShowModal', value: any): void
  (e: 'saveChange', value: any): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

/**
 * store
 */

const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()

/** setting validate */
const schema = yup.object({
  thematic: schemaOption.defaultSelectSingle,
})

const myFormMoveThematic = ref()
const route = useRoute()

/** state */
const LABEL = Object.freeze({
  TITLE: t('update-thematic-content'),
  TITLE1: `${t('thematics')}*`,
  PLH_SELECT: t('choose-thematics'),
})
const comboboxThemetic = ref<any[]>([])
const themeticId = ref()

/** method */
async function onCancel() {
  emit('update:isShowModal', false)
}
async function resetData() {
  themeticId.value = null
}
async function getListThematicContent() {
  const params = {
    courseId: Number(route.params.id),
  }
  await MethodsUtil.requestApiCustom(CourseService.GetListThematicContent, TYPE_REQUEST.GET, params).then((value: any) => {
    comboboxThemetic.value = value.data
  })
}
async function onConfirm() {
  myFormMoveThematic.value.validate().then(async (success: any) => {
    if (success.valid) {
      emit('saveChange', themeticId.value)
      emit('update:isShowModal', false)
    }
  })
}

watch(() => props.isShowModal, isShow => {
  if (isShow)
    getListThematicContent()

  else
    resetData()
})
</script>

<template>
  <div>
    <CmDialogs
      :title="LABEL.TITLE"
      :is-dialog-visible="isShowModal"
      :button-ok-name="t('save')"
      close-on-back
      persistent
      @cancel="onCancel"
      @confirm="onConfirm"
    >
      <Form
        ref="myFormMoveThematic"
        :validation-schema="schema"
        @submit.prevent="submitForm"
      >
        <Field
          v-slot="{ field, errors }"
          v-model:model-value="themeticId"
          name="thematic"
        >
          <CmSelect
            :model-value="themeticId"
            :field="field"
            :errors="errors"
            append-to-body
            :items="comboboxThemetic"
            item-value="key"
            custom-key="value"
            :text="LABEL.TITLE1"
            :placeholder="LABEL.PLH_SELECT"
            class="mb-4"
          />
        </Field>
      </Form>
    </CmDialogs>
  </div>
</template>

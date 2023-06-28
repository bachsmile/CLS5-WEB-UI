<script setup lang="ts">
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import { validatorStore } from '@/stores/validatator'
import CourseService from '@/api/course/index'
import { contentManagerStore } from '@/stores/admin/course/content'

const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
  excludeIds: [],
})

const emit = defineEmits<Emit>()

const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))

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
/**
 * Store
 */
const storeContentManager = contentManagerStore()
const {
  contentDataEdit, courseContentId,
} = storeToRefs(storeContentManager)
const {
  handleUpdateThematic,
} = storeContentManager

const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()

/** setting validate */
const schema = yup.object({
  name: schemaOption.defaultString,
})

const myFormUpdateThematic = ref()
const route = useRoute()

/** state */
const LABEL = Object.freeze({
  TITLE: t('update-thematic'),
  TITLE2: t('thematic-parent'),
  PLH_SELECT2: t('choose-thematics'),
})
const comboboxThemetic = ref<any[]>([])
const themeticId = ref()

/** method */
async function onCancel() {
  emit('update:isShowModal', false)
}
async function resetData() {
  contentDataEdit.value = ({
    name: null,
    themeticId: null,
    courseId: null,
    topicCourseId: 0,
    archiveTypeId: 13,
    description: '',
    url: null,
    dateTimeStart: null,
    dateTimeEnd: null,
    isRewind: false,
    isPdf: false,
  })
}
async function getListThematicContent() {
  const params = {
    courseId: Number(route.params.id),
    exceptId: Number(route.params.id) ? courseContentId.value : null,
  }

  await MethodsUtil.requestApiCustom(CourseService.GetListThematicContent, TYPE_REQUEST.GET, params).then((value: any) => {
    comboboxThemetic.value = value.data
  })
}

async function onConfirm() {
  myFormUpdateThematic.value.validate().then(async (success: any) => {
    if (success.valid) {
      handleUpdateThematic()
      nextTick(() => {
        emit('update:isShowModal', false)
      })
    }
  })
}

watch(() => props.isShowModal, isShow => {
  if (isShow)
    getListThematicContent()

  else resetData()
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
        ref="myFormUpdateThematic"
        :validation-schema="schema"
        @submit.prevent="submitForm"
      >
        <Field
          v-slot="{ field, errors }"
          v-model="contentDataEdit.name"
          name="name"
          type="text"
        >
          <CmTextField
            :field="field"
            :errors="errors"
            class="mb-6"
            :model-value="contentDataEdit.name"
            :text="t('thematics')"
            :placeholder="t('thematics')"
          />
        </Field>

        <CmSelect
          v-model:model-value="contentDataEdit.themeticId"
          append-to-body
          :items="comboboxThemetic"
          item-value="key"
          custom-key="value"
          :text="LABEL.TITLE2"
          :placeholder="LABEL.PLH_SELECT2"
          class="mb-4"
        />
      </Form>
    </CmDialogs>
  </div>
</template>

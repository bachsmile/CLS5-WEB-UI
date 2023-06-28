<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import MethodsUtil from '@/utils/MethodsUtil'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { contentManagerStore } from '@/stores/admin/course/content'
import toast from '@/plugins/toast'
import CmVideoUpload from '@/components/common/CmVideoUpload.vue'
import { load } from '@/stores/loadComponent.js'

const emit = defineEmits<Emit>()

const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))

const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))

/** lib */

const CpInputFile = defineAsyncComponent(() => import('@/components/page/gereral/CpInputFile.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()
interface Emit {
  (e: 'cancel'): void
  (e: 'addSuccess'): void
}

/**
 * store
 */
const store = load()
const { unLoadComponent } = store
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()

const storeContentManager = contentManagerStore()
const { contentRefer } = storeToRefs(storeContentManager)

const schema = yup.object({
  name: schemaOption.requiredString(),
})
const myFormAddRefer = ref()
const file = reactive({
  filePath: null as any,
  type: null as any,
})
const errorsInputFile = ref<any>([])
const LABEL = Object.freeze({
  TITLE1: `${t('name-files')}*`,
  TITLE2: `${t('choose-files-upload')}*`,
})
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE

function handleChangeFile(data: any) {
  if (data.fileExtension === '.mp4') {
    file.filePath = data.filePath
    file.type = 'mp4'
  }

  if (contentRefer.value.name === null)
    contentRefer.value.name = data?.name

  contentRefer.value.url = data?.fileFolder
  if (!contentRefer.value.url)
    errorsInputFile.value = [t('please-choose-files')]

  else
    errorsInputFile.value = []
}
function onCancel() {
  emit('cancel')
}

function resetData() {
  contentRefer.value.name = undefined
  contentRefer.value.courseContentId = undefined
  contentRefer.value.isPdf = false
  contentRefer.value.url = undefined
}
async function handleSave() {
  myFormAddRefer.value.validate().then(async (success: any) => {
    if (!contentRefer.value.url) {
      errorsInputFile.value = [t('please-choose-files')]
      return
    }
    if (success.valid) {
      let response = null
      contentRefer.value.courseId = route.params.id ?? null
      if (contentRefer.value.courseContentId && contentRefer.value.courseContentId !== null) {
        response = await MethodsUtil.requestApiCustom(CourseService.PostUpdateRefer, TYPE_REQUEST.POST, contentRefer.value)
      }
      else { // cập nhật
        contentRefer.value.courseId = route.params.id
        contentRefer.value.archiveTypeId = 14
        response = await MethodsUtil.requestApiCustom(CourseService.PostAddRefer, TYPE_REQUEST.POST, contentRefer.value)
      }
      if (response.code === 200) {
        resetData()
        toast('SUCCESS', t(response.message))
        emit('cancel')
        emit('addSuccess')
      }
      else {
        toast('ERROR', t(response.message))
      }
    }
  })
}
async function dowloadFile(idx: any) {
  await MethodsUtil.dowloadSampleFile(
    SERVERFILE + file.filePath,
    'GET',
    contentRefer.value.name,
  ).then(value => {
    setTimeout(() => {
      unLoadComponent(idx)
    }, 1000)
  })
}
</script>

<template>
  <div>
    <Form
      ref="myFormAddRefer"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <VRow class="mb-3">
        <VCol
          cols="12"
          sm="6"
        >
          <div class="text-medium-sm mb-1">
            {{ LABEL.TITLE1 }}
          </div>
          <Field
            v-slot="{ field, errors }"
            v-model="contentRefer.name"
            name="name"
            type="text"
          >
            <CmTextField
              :field="field"
              :errors="errors"
              :placeholder="LABEL.TITLE1"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          sm="6"
        >
          <div class="text-medium-sm mb-1">
            {{ LABEL.TITLE2 }}
          </div>
          <div>
            <CpInputFile
              :is-btn-download="!['mp4'].includes(file.type)"
              :errors="errorsInputFile"
              @change="handleChangeFile"
            />
          </div>
        </VCol>
        <VCol
          v-if="['mp4'].includes(file.type) && file.filePath"
          cols="12"
          sm="6"
        >
          <CmVideoUpload
            class="mb-2"
            :model-value="file.filePath"
          />
          <div class="d-flex justify-center">
            <CmButton
              is-load
              variant="tonal"
              color="primary"
              @click="dowloadFile"
            >
              {{ t('download') }}
            </CmButton>
          </div>
        </VCol>
      </VRow>
    </Form>
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

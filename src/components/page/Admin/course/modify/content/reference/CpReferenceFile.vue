<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import MethodsUtil from '@/utils/MethodsUtil'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { contentManagerStore } from '@/stores/admin/course/content'
import toast from '@/plugins/toast'
import CmVideoUpload from '@/components/common/CmVideoUpload.vue'
import { load } from '@/stores/loadComponent.js'
import { documentExtention } from '@/constant/Globals'
import ServerFileService from '@/api/server-file/index'

const emit = defineEmits<Emit>()

const CmItemFileUpload = defineAsyncComponent(() => import('@/components/common/CmItemFileUpload.vue'))

const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CmPreviewFile = defineAsyncComponent(() => import('@/components/common/CmPreviewFile.vue'))
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
const { resetRefer } = storeContentManager

const schema = yup.object({
  name: schemaOption.requiredString(),
})
const myFormAddRefer = ref()
const files = ref({
  filePath: null as any,
  fileFolder: null as any,
  type: null as any,
  localDocFileName: null as any,
  haveDocument: false,
})
const errorsInputFile = ref<any>([])
const isLoadingFile = ref<any>(false)
const LABEL = Object.freeze({
  TITLE1: `${t('name-files')}*`,
  TITLE2: `${t('choose-files-upload')}*`,
})
const fileUpload = ref([{ name: 'Real-Time', icon: 'tabler:file', size: 0, processing: 95 }])

const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE

function onCancel() {
  resetRefer()
  emit('cancel')
}

function resetData() {
  contentRefer.value.name = undefined
  contentRefer.value.courseContentId = undefined
  contentRefer.value.isPdf = false
  contentRefer.value.url = undefined
}

async function handleSave(idx: any) {
  myFormAddRefer.value.validate().then(async (success: any) => {
    if (!contentRefer.value.url) {
      errorsInputFile.value = [t('please-choose-files')]
      toast('ERROR', t('please-choose-files'))
      unLoadComponent(idx)
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
        resetRefer()
        emit('cancel')
        emit('addSuccess')
      }
      else {
        toast('ERROR', t(response.message))
      }
    }
  })
}

/** *****************************Preiview file********************************************** */
// cập nhật dữ liệu chỉnh sửa
function getDetailDocContent() {
  if (contentRefer.value.url && contentRefer.value.url !== null) {
    files.value.fileFolder = contentRefer.value.url
    getLocalInfo(contentRefer.value.url)
  }
  else { contentRefer.value.timeTypeId = 1 }
}

// lấy thông tin server file từ file folder
async function getInfor(folder: any) {
  return await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.GetInforFile}${folder}`, TYPE_REQUEST.GET)
}

// lấy thông tin server file từ file folder và cập nhật lại data file để hiển thị
async function getLocalInfo(folder: any, getFileSize?: any) {
  await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.GetInforFile}${folder}`, TYPE_REQUEST.GET).then((data: any) => {
    files.value.localDocFileName = data.fileName
    files.value = {
      ...files.value,
      ...data,
    }
    if (data.fileExtension === '.mp4') {
      files.value.type = 'mp4'
      files.value.filePath = data.filePath
    }
    files.value.haveDocument = true
    isLoadingFile.value = false
  })
}

// upload server file lần 2 với trạng thái isSecure = true để mã hóa file => file path có thể xem ở pdf
async function upFileServerPreview(fileUp: any) {
  const model = {
    files: fileUp,
    isSecure: true,
  }
  const data = await MethodsUtil.uploadFile(model)
  files.value.fileFolder = data.fileFolder
  contentRefer.value.url = data?.fileFolder
  getLocalInfo(data.filePath)
}

// thay đổi dữ liệu từ input file
function handleChangeFile(data: any, fileUp: any) {
  isLoadingFile.value = true
  if (data.fileExtension === '.mp4') {
    files.value.type = 'mp4'
    files.value.filePath = data.filePath
    contentRefer.value.url = data?.fileFolder
    contentRefer.value.urlFileName = null
    files.value.haveDocument = true
  }
  else {
    files.value.type = data.fileExtension
    contentRefer.value.urlFileName = data.fileFolder
  }
  if (contentRefer.value.name === null)
    contentRefer.value.name = data?.name

  if (!contentRefer.value.url && !contentRefer.value.urlFileName)
    errorsInputFile.value = [t('please-choose-files')]

  else
    errorsInputFile.value = []
  if (documentExtention.includes(data.fileExtension))
    upFileServerPreview(fileUp)

  else
    isLoadingFile.value = false
}

// Lấy thông tin file dowload từ urlFileName rồi dowload
async function dowloadFile(idx: any) {
  await getInfor(files.value.type === 'mp4' ? contentRefer.value.url : contentRefer.value.urlFileName).then((value: any) => {
    MethodsUtil.dowloadSampleFile(
      SERVERFILE + value.filePath,
      'GET',
      files.value.localDocFileName,
    ).then(() => {
      setTimeout(() => {
        unLoadComponent(idx)
      }, 1000)
    })
  })
}
function handleDeleteDoc(type: any, idx: any) {
  switch (type) {
    case 'local':
      files.value = {
        filePath: null as any,
        fileFolder: null as any,
        type: null as any,
        localDocFileName: null as any,
        haveDocument: false,
      }
      contentRefer.value.urlFileName = ''
      contentRefer.value.url = ''
      break

    default:
      break
  }
  unLoadComponent(idx)
}
onMounted(() => {
  getDetailDocContent()
})
</script>

<template>
  <div>
    <Form
      ref="myFormAddRefer"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <VRow>
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
              :file-name="files.localDocFileName"
              :is-btn-download="!['mp4'].includes(files.type)"
              :errors="errorsInputFile"
              @change="handleChangeFile"
            />
          </div>
        </VCol>
        <VCol
          v-if="['mp4'].includes(files.type) && files.filePath"
          cols="12"
          sm="6"
        >
          <CmVideoUpload
            :model-value="files.filePath"
          />
        </VCol>
        <VCol
          v-else
          cols="12"
          sm="6"
        >
          <div v-if="isLoadingFile">
            <CmItemFileUpload
              :icon-status="false"
              :files="fileUpload"
            />
          </div>
          <CmPreviewFile
            v-if="files?.filePath && files?.fileFolder && !isLoadingFile"
            width="100"
            :src="files?.filePath"
            :file-folder="files?.fileFolder"
          />
        </VCol>
      </VRow>
      <VRow v-if="!isLoadingFile && files.haveDocument">
        <VCol
          cols="12"
          sm="6"
        >
          <div class=" d-flex justify-center">
            <CmButton
              class="mr-2"
              variant="outlined"
              is-load
              icon="tabler:download"
              :size-icon="18"
              @click="dowloadFile"
            />
            <CmButton
              is-load
              icon="tabler:trash"
              variant="outlined"
              color="error"
              :size-icon="18"
              @click="((idx: any) => handleDeleteDoc('local', idx))"
            />
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

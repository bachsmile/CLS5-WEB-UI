<script setup lang="ts">
import axios from 'axios'
import MethodsUtil from '@/utils/MethodsUtil'
import ServerFileService from '@/api/server-file'
import toast from '@/plugins/toast'
import AuthUtil from '@/auth'
import { load } from '@/stores/loadComponent.js'
import constant from '@/constant/constant'

const props = withDefaults(defineProps<Props>(), ({
  accept: '',
  isBtnDownload: false,
  isSecure: false,
  isBackground: false,
  isRequestFileInstall: false,
  acceptDownload: false,
  disabled: false,
  icon: 'tabler:file',
}))
const emit = defineEmits<Emit>()
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CpMdProcessing = defineAsyncComponent(() => import('@/components/page/gereral/modal/CpMdProcessing.vue'))
const CpMdRequestInstall = defineAsyncComponent(() => import('@/components/page/gereral/modal/CpMdRequestInstall.vue'))
const CmItemFileUpload = defineAsyncComponent(() => import('@/components/common/CmItemFileUpload.vue'))

interface Emit {
  (e: 'onChangeFile', value: any): void
  (e: 'update:acceptDownload', value: any): void
  (e: 'change', value: any, file?: any): void
  (e: 'haveFile', value: any): void
  (e: 'update:fileUpload', value: any): void
}
const store = load()
const { unLoadComponent } = store
interface Props {
  accept?: string
  icon?: string
  fileName?: string | null
  errors?: any
  modelValue?: any
  isBtnDownload?: boolean
  isSecure?: boolean
  isBackground?: boolean
  disabled?: boolean
  fileType?: string
  isRequestFileInstall?: boolean
  acceptDownload?: boolean
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const inputFile = ref<HTMLInputElement | null>(null)
const isShowModalProcessing = ref(false)
const isShowModalOptionInst = ref(false)
const intervalProgress = ref()
const intervalTime = ref(100)
const haveFile = ref(false)
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE
const userData = JSON.parse(localStorage.getItem('userData') || '')
const dataFile = ref(props.modelValue)
const fileNameInput = ref(props.fileName)
const fileUpload = ref([{ name: 'Real-Time', icon: 'tabler:file', size: 0, type: 0, processing: 95 }])

const params = ref({
  files: null as any,
  isSecure: props.isSecure || false as any,
  UserId: null as any,
  isBackground: props.isBackground as any,
  fileType: null as any,
})
const filesData = ref(
  {
    name: '',
    icon: props.icon,
    size: 0,
    processing: 0,
    fileName: '',
    fileType: null,
    fileExtension: '',
    filePath: '',
    fileOrigin: '',
    fileFolder: '',
  },
)

function hanleClickInput(idx: any) {
  if (props.disabled)
    return
  if (props.isRequestFileInstall) {
    isShowModalOptionInst.value = true
    setTimeout(() => {
      unLoadComponent(idx)
    }, 2000)
  }
  else { openChooseFile(idx) }
}
function confirmContinue() {
  openChooseFile()
  isShowModalOptionInst.value = false
}
function updateOptionUpload(data: any) {
  emit('update:acceptDownload', data)
}
function openChooseFile(idx?: any) {
  inputFile.value?.click()
  if (idx) {
    setTimeout(() => {
      unLoadComponent(idx)
    }, 2000)
  }
}
function checkTimeDelay(size: number) {
  if (size > 10 ** 8)
    intervalTime.value = 800

  else if (size > 10 ** 7)
    intervalTime.value = 200

  else if (size > 10 ** 6)
    intervalTime.value = 100

  else
    intervalTime.value = 50
}
async function onFileSelected(event: any) {
  filesData.value.processing = 0
  const tmpFiles = event.target.files || event.dataTransfer.files
  if (!tmpFiles?.length)
    return
  const file = tmpFiles[0]
  params.value.files = file
  if (props.fileType)
    params.value.fileType = props.fileType
  filesData.value.name = file.name
  filesData.value.size = file.size
  filesData.value.icon = MethodsUtil.checkTypeFileUpload(file.type)?.icon
  emit('update:fileUpload', filesData.value)
  emit('onChangeFile', file)
  await checkTimeDelay(file.size)
  await upFileServer(file)
  event.target.value = null
}

const uploadRequests = ref<any>([])
const cancelTokenSource = axios.CancelToken.source()

// upload file to serve file
async function upFileServer(file: any) {
  isShowModalProcessing.value = true

  intervalProgress.value = setInterval(() => {
    if (filesData.value.processing === 90) {
      clearInterval(intervalProgress.value)
      intervalProgress.value = null
      return
    }
    filesData.value.processing += 1
    emit('update:fileUpload', filesData.value)
  }, intervalTime.value)
  if (userData)
    params.value.UserId = userData.id

  const formData = new FormData()
  formData.append('IsSecure', params.value.isSecure)
  formData.append('files', params.value.files)
  formData.append('UserId', params.value.UserId)
  if (params.value.fileType)
    formData.append('FileType', params.value.fileType)

  formData.append('IsBackground', params.value.isBackground)
  const token = AuthUtil.getToken()

  const uploadRequest = axios.post(`${SERVERFILE}${ServerFileService.UploadFile}`, formData, {
    cancelToken: cancelTokenSource.token,
    onUploadProgress: (progressEvent: any) => {
      // const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    },
    headers: {
      // Authorization: `Bearer ${token}`,
      Authorization: constant.TOKEN_SV_FILE,
    },

  })
    .then((value: any) => {
      if (value.data?.fileFolder) {
        filesData.value = {
          ...filesData.value,
          ...value.data,
        }
        fileNameInput.value = filesData.value.name
        filesData.value.processing = 100
        clearInterval(intervalProgress.value)
        isShowModalProcessing.value = false
        fileUpload.value[0].icon = MethodsUtil.checkTypeFileUpload(file.type)?.icon
        fileUpload.value[0].name = fileNameInput.value
        fileUpload.value[0].size = filesData.value.size
        fileUpload.value[0].processing = 100
        fileUpload.value[0].type = 1

        toast('SUCCESS', t('up-file'))
        haveFile.value = true
        emit('update:fileUpload', filesData.value)
        emit('change', filesData.value, file)
      }
    })
    .catch(() => {
      uploadRequests.value.splice(0, 1)
    })
  uploadRequests.value.push({ cancelTokenSource, request: uploadRequest })
}
const messageError = computed(() => {
  if (props.errors?.length)
    return t(props.errors[0])

  return ''
})
function cancelProcessing(index: any) {
  if (!window._.isEmpty(uploadRequests.value[index])) {
    uploadRequests.value[index].cancelTokenSource.cancel('Hủy cuộc gọi')
    uploadRequests.value[index].request.cancel() // Hủy cuộc gọi Axios
    uploadRequests.value.splice(index, 1)
  }
}
async function dowloadFile(idx: any) {
  MethodsUtil.dowloadSampleFile(
    `${SERVERFILE}${filesData.value.filePath}`,
    'GET',
    filesData.value.name,
  ).then(value => {
    setTimeout(() => {
      unLoadComponent(idx)
    }, 1000)
  })
}
watch(() => props.isSecure, (val: any) => {
  params.value.isSecure = val
})
watch(() => props.fileName, (val: any) => {
  fileNameInput.value = val
})
watch(() => props.modelValue, (val: any) => {
  if (window._.isEmpty(val)) {
    dataFile.value = null
    filesData.value = {
      name: '',
      icon: props.icon,
      size: 0,
      processing: 0,
      fileName: '',
      fileType: null,
      fileExtension: '',
      filePath: '',
      fileOrigin: '',
      fileFolder: '',
    }
  }
})
defineExpose({
  openChooseFile,
})
</script>

<template>
  <div>
    <div class="input-drop-file">
      <div
        class="box-drop-input"
        @click="hanleClickInput"
      >
        <div class="d-flex justify-center">
          <div class="icon-noti">
            <VIcon
              icon="tabler:cloud-upload"
              color="infor"
              class="noti-zindex"
              :size="24"
            />
            <span
              class="ring1 ring1-type-4"
            />
            <span
              class="ring2 ring2-type-4"
            />
          </div>
        </div>
        <div class="d-flex justify-center align-center">
          <div class="box-action-left text-semibold-sm mr-1">
            Bấm để tải lên
          </div>
          <div class="box-action-right text-regular-sm">
            hoặc kéo và thả
          </div>
        </div>
      </div>
      <div>
        <CmItemFileUpload
          v-if="fileUpload[0].type === 1"
          :files="fileUpload"
        />
      </div>
    </div>
    <div class="d-flex cm-input-file">
      <VFileInput
        ref="inputFile"
        v-model="dataFile"
        :error="errors?.length > 0 ?? false"
        :error-messages="messageError"
        class="mr-3 d-none"
        prepend-icon=""
        :placeholder="t('upload')"
        outlined
        dense
        :clearable="false"
        :accept="accept"
        @change="onFileSelected"
      >
        <template
          v-if="!dataFile?.length"
          #prepend-inner
        >
          <span>{{ fileName }}</span>
        </template>
      </VFileInput>
      <CpMdProcessing
        v-model:is-show-modal="isShowModalProcessing"
        :files="[filesData]"
        :icon="props.icon"
        @cancel="cancelProcessing"
      />
    </div>

    <CpMdRequestInstall
      v-model:isDialogVisible="isShowModalOptionInst"
      :accept-download="acceptDownload"
      @updateOptionUpload="updateOptionUpload"
      @confirm="confirmContinue"
    />
  </div>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;
.cm-input-file .v-field--variant-outlined .v-field__outline__start {
    border-radius: 8px 0 0 8px !important;
}

.cm-input-file .v-field--variant-outlined .v-field__outline__end {
    border-radius: 0 8px 8px 0  !important;
}
.v-file-input .v-input__details{
  padding-inline-start: 16px !important;
  padding-inline-end: 16px !important;
}
.cm-input-file .v-file-input .v-field__input{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: inline;

}
.cm-input-file .v-field--variant-outlined .v-field__outline__start {
    border-radius: 8px 0 0 8px !important;
    background-color:  rgb(var(--v-theme-surface));
    opacity: 1;
  }
.cm-input-file .v-field__outline{
  z-index: -1 !important;
}
.cm-input-file .v-field--variant-outlined .v-field__outline__end {
    border-radius: 0 8px 8px 0  !important;
    background-color:  rgb(var(--v-theme-surface));
    opacity: 1;
  }

  .input-drop-file{
    position: relative;
    .box-drop-input{
      border-radius: 8px;
      border: 1px solid rgb(var(--v-gray-300));
      background: var(--white, #FFF);
      padding: 16px 24px;
      .box-action-left{
        color: rgb(var(--v-primary-700))
      }
      .box-action-right{
        color: rgb(var(--v-gray-500))
      }
    }
  }
</style>

<script setup lang="ts">
import CmAudio from '@/components/common/CmAudio.vue'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import ServerFileService from '@/api/server-file/index'
import CmDialogs from '@/components/common/CmDialogs.vue'
import CmItemFileUpload from '@/components/common/CmItemFileUpload.vue'
import toast from '@/plugins/toast'

import {
  MediaType,
} from '@/constant/Globals'

const props = withDefaults(defineProps<Props>(), ({
  src: '',
  type: 1,
  autoplay: false,
}))

const emit = defineEmits<Emit>()

const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))

const CmImgUpload = defineAsyncComponent(() => import('@/components/common/CmImgUpload.vue'))
const CpInputFile = defineAsyncComponent(() => import('@/components/page/gereral/CpInputFile.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))

interface Props {
  src?: any
  disabled?: boolean
  type?: number
  typeMedia?: number
  isDownload?: boolean
  autoplay?: boolean
  isPause?: boolean
}
interface Emit {
  (e: 'update:fileFolder', value: any): void
  (e: 'deleteFile', value?: any): void
}
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE

const isViewDetail = ref(false)
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const urlFile = ref('')
const urlYoutube = ref('')
const youtubeId = ref('')
const refUploadImg = ref<any>(null)
const refUploadVideo = ref<any>(null)
const inputFile = ref<any>(null)

const dataFile = ref<any>({
  filePath: null,
  fileFolder: null,
})
const isShowModalYoutube = ref(false)
const fileUpload = ref([{ name: 'Real-Time', icon: 'tabler:file', size: 0, type: 0, processing: 95, statusDownload: 2, fileFolder: '', filePath: '' }])
const typeFile = ref<any>()
function onCancel() {
  isShowModalYoutube.value = false
}

function onConfirmYoutube() {
  isShowModalYoutube.value = false
  typeFile.value = 4
  youtubeId.value = MethodsUtil.getYoutubeId(urlYoutube.value)
  urlFile.value = `https://www.youtube.com/embed/${youtubeId.value}`
  emit('update:fileFolder', youtubeId)
}

function previewYoutube() {
  youtubeId.value = MethodsUtil.getYoutubeId(urlYoutube.value)
}
function onOpenYoutubeUrl() {
  isShowModalYoutube.value = true
}
function changeMedia(type: any, value: any) {
  switch (type) {
    case 'img':
      typeFile.value = MethodsUtil.getMediaType(value.fileExtension)
      emit('update:fileFolder', value?.fileFolder)
      break

    default:
      break
  }
}
async function getInfor(folder: any) {
  return await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.GetInforFile}${folder}`, TYPE_REQUEST.GET)
}
async function downloadFile(item: any, idx: number, unLoadComponent: any) {
  MethodsUtil.dowloadSampleFile(`${SERVERFILE}${item.filePath}`,
    TYPE_REQUEST.GET, item.name || ' local').then((data: any) => {
    unLoadComponent(idx)
    if (data.status === 200)
      return true

    else
      toast('WARNING', t('download-file-failed'))
    unLoadComponent(idx)
  })
    .catch(() => {
      unLoadComponent(idx)
    })
}
async function uploadFileLocal(data: any, file: any) {
  if (data?.fileFolder) {
    await getInfor(data?.fileFolder).then((value: any) => {
      if (value?.filePath) {
        typeFile.value = MethodsUtil.getMediaType(value.fileExtension)
        urlFile.value = value.filePath
        dataFile.value.filePath = value.filePath
        dataFile.value.fileFolder = data.fileFolder
        dataFile.value.serverCode = data?.serverCode
        fileUpload.value[0].name = value.fileName
        fileUpload.value[0].type = 1
        fileUpload.value[0].statusDownload = 3
        fileUpload.value[0].size = value.fileSize
        emit('update:fileFolder', data?.fileFolder)
      }
    })
  }
}
function handleDelteFile(val: any) {
  emit('deleteFile', val)
}
function uploadFile() {
  switch (typeFile.value) {
    case 1:
      refUploadImg.value?.hanleClickImage()
      break
    case 2:
      inputFile.value?.openChooseFile()
      break
    case 3:
      inputFile.value?.openChooseFile()
      break
    default:
      inputFile.value?.openChooseFile()
      break
  }
}
async function initData(val: any) {
  if (val.includes('fol-')) {
    await getInfor(val).then(value => {
      if (value?.filePath) {
        typeFile.value = MethodsUtil.getMediaType(value.fileExtension)
        fileUpload.value[0].name = value.fileName
        fileUpload.value[0].type = 0
        fileUpload.value[0].statusDownload = 3
        fileUpload.value[0].statusDelete = !props.disabled
        fileUpload.value[0].size = value.fileSize
        fileUpload.value[0].filePath = value.filePath
        fileUpload.value[0].fileFolder = value.fileFolder
        if (typeFile.value === 5 && !value.isSecure)
          fileUpload.value[0].statusDownload = 1

        urlFile.value = value.filePath
        dataFile.value.filePath = value.filePath
        dataFile.value.fileFolder = val
      }
    })
  }
  else {
    youtubeId.value = val
    typeFile.value = MediaType.YOUTUBE
    urlFile.value = `https://www.youtube.com/embed/${youtubeId.value}`
  }
}
const mediaVideo = ref()
watch(() => props.src, async (val: any) => {
  if (window._.isEmpty(val)) {
    urlFile.value = val
    youtubeId.value = val
    urlYoutube.value = val
    return
  }
  initData(val)
}, { deep: true, immediate: true })
watch(() => props.typeMedia, async (val: any) => {
  if (val)
    typeFile.value = val
}, { deep: true, immediate: true })
watch(() => props.isPause, (val: any) => {
  if (val === false)
    mediaVideo.value.pause()
})
defineExpose({
  inputFile,
  refUploadVideo,
  refUploadImg,
  mediaVideo,
  openImage: () => refUploadImg.value?.hanleClickImage(),
  openVideo: () => inputFile.value?.openChooseFile(),
  openAudio: () => inputFile.value?.openChooseFile(),
  openFile: () => inputFile.value?.openChooseFile(),
  openYoutube: () => onOpenYoutubeUrl(),
})
</script>

<template>
  <div
    class="media-content "
  >
    <div :class="{ imageFullContainer: !!urlFile && typeFile === MediaType.IMAGE }">
      <div :class="{ imageFull: !!urlFile && typeFile === MediaType.IMAGE }">
        <CmImgUpload
          ref="refUploadImg"
          v-model:src="urlFile"
          :disabled="disabled"
          :hide="typeFile !== MediaType.IMAGE || !urlFile"
          color="infor"
          is-size-full
          :is-classic-border="false"
          :is-rounded="true"
          :is-icon-text="false"
          icon="tabler:square-rounded-plus-filled"
          :tooltip="t('system-management.100x100')"
          @update:file="($event: any) => changeMedia('img', $event)"
        />
      </div>
    </div>
    <div class="d-none">
      <CpInputFile
        ref="inputFile"
        v-model:src="urlFile"
        class="w-100 "
        :accept="MethodsUtil.getMediaTypeExtention(typeFile)"
        :disabled="disabled"
        :is-btn-download="false"
        is-request-file-install
        @change="uploadFileLocal"
      />
    </div>
    <div
      v-if="typeFile === MediaType.AUDIO && urlFile"
    >
      <CmAudio
        v-model:src="urlFile"
        :is-pause="isPause"
        width="100%"
      />
    </div>

    <div
      v-if="typeFile === MediaType.VIDEO && urlFile"
      class="d-flex justify-center imageFullContainer"
    >
      <video
        ref="mediaVideo"
        controls
        :autoplay="autoplay"
        name="media"
        class="imageFull"
      >
        <source
          :src="`${SERVERFILE}${urlFile}`"
          type="video/mp4"
        >
      </video>
    </div>
    <div
      v-if="typeFile === MediaType.YOUTUBE && urlFile"
      class="d-flex justify-center imageFullContainer"
    >
      <embed
        v-if="!isPause"
        :src="urlFile"
        style="--width-ratio: 1;"
        class="imageFull"
      >
    </div>
    <div
      v-if="typeFile === MediaType.OTHER_FILE && !!urlFile"
      class="d-flex justify-center"
    >
      <CmItemFileUpload
        v-if="fileUpload[0].type === 0"
        :files="fileUpload"
        :type="0"
        class="w-100"
        @downloadFile="downloadFile"
        @deletes="handleDelteFile"
      />
    </div>
    <div
      v-if="urlFile && !disabled"
      :class="[type === 1 ? 'actionFile' : 'actionFileAbs']"
    >
      <CmButton
        icon="tabler:upload"
        :size-icon="18"
        variant="outlined"
        class="mr-3 bg-white"
        bg-color="bg-white"
        color="white"
        text-color="color-dark"
        @click="uploadFile"
      />
      <CmButton
        icon="fe:trash"
        :size-icon="18"
        variant="outlined"
        class="mr-3 bg-white"
        bg-color="bg-white"
        color="white"
        text-color="color-dark"
        @click="handleDelteFile"
      />
    </div>
  </div>
  <div
    v-if="!disabled"
    class="d-none"
  >
    <CmDialogs
      :title="t('Đường dẫn youtube')"
      :is-dialog-visible="isShowModalYoutube"
      :button-ok-name="t('save')"
      close-on-back
      persistent
      size="md"
      @cancel="onCancel"
      @confirm="onConfirmYoutube"
    >
      <div class="d-flex align-center mb-2">
        <CmTextField
          v-model="urlYoutube"
          :placeholder="t('enter-link')"
          class="w-100 mr-2"
        />
        <CmButton
          :disabled="!urlYoutube || urlYoutube?.length === 0"
          @click="previewYoutube"
        >
          {{ t("search") }}
        </CmButton>
      </div>
      <div
        v-if="youtubeId"
        class="d-flex justify-center imageFullContainer"
      >
        <embed
          class="w-100 imageFull"
          :src="`https://www.youtube.com/embed/${youtubeId}`"
        >
      </div>
    </CmDialogs>
  </div>
</template>

<style scoped>
.media-content{
  position: relative;
  width: 100%;
  padding-bottom: 12px;
}
/* .imageFull{
  width: 100%;
  min-width: 350px;
  height: 12.5rem;
} */
.imageFullContainer {
    position: relative;
    width: 100%;
    padding-top: 56.25%; /* Tỉ lệ 4:3 */
  }

  .imageFull {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: lightgray; /* Để thấy rõ vùng ảnh */
    border-radius: 4px;
  }
.actionFileAbs{
  position: absolute;
  display: none;
  top: 50%;
  left:50%;
  justify-content: center;
  transform: translate(-50%, -50%);
  z-index: 10;
}
.actionFile{
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
.media-content:hover .actionFileAbs{
  display: flex;
}
</style>

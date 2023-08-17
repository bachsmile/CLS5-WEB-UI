<script setup lang="ts">
import CmAudio from '@/components/common/CmAudio.vue'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import ServerFileService from '@/api/server-file/index'
import CmDialogs from '@/components/common/CmDialogs.vue'

import {
  MediaType,
} from '@/constant/Globals'

const props = withDefaults(defineProps<Props>(), ({
  src: '',
  type: 1,
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

async function uploadFileLocal(data: any, file: any) {
  if (data?.fileFolder) {
    await getInfor(data?.fileFolder).then((value: any) => {
      if (value?.filePath) {
        typeFile.value = MethodsUtil.getMediaType(value.fileExtension)
        urlFile.value = value.filePath
        dataFile.value.filePath = value.filePath
        dataFile.value.fileFolder = data.fileFolder
        dataFile.value.serverCode = data?.serverCode
        emit('update:fileFolder', data?.fileFolder)
      }
    })
  }
}
function handleDelteFile() {
  emit('deleteFile')
}
function uploadFile() {
  switch (typeFile.value) {
    case 1:
      refUploadImg.value?.hanleClickImage()
      break
    case 2:
      refUploadImg.value?.hanleClickImage()
      break

    default:
      break
  }
}
async function initData(val: any) {
  if (val.includes('fol-')) {
    await getInfor(val).then(value => {
      if (value?.filePath) {
        typeFile.value = MethodsUtil.getMediaType(value.fileExtension)
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
defineExpose({
  inputFile,
  refUploadVideo,
  refUploadImg,
  openImage: () => refUploadImg.value?.hanleClickImage(),
  openVideo: () => inputFile.value?.openChooseFile(),
  openAudio: () => inputFile.value?.openChooseFile(),
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
        :disabled="isViewDetail"
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
        width="100%"
      />
    </div>

    <div
      v-if="typeFile === MediaType.VIDEO && urlFile"
      class="d-flex justify-center imageFullContainer"
    >
      <embed
        :src="`${SERVERFILE}${urlFile}`"
        class="imageFull"
      >
    </div>
    <div
      v-if="typeFile === MediaType.YOUTUBE && urlFile"
      class="d-flex justify-center imageFullContainer"
    >
      <embed
        :src="urlFile"
        style="--width-ratio: 1;"
        class="imageFull"
      >
    </div>
    <div
      v-if="urlFile"
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
  <div>
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

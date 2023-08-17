<script setup lang="ts">
import CmAvatar from '@/components/common/CmAvatar.vue'
import toast from '@/plugins/toast'
import MethodsUtil from '@/utils/MethodsUtil'
import ServerFileService from '@/api/server-file/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { avatar } from '@/constant/Globals'

interface Props {
  disabled?: boolean
  isClassicBorder?: boolean
  isSizeFull?: boolean // kích thước full cha
  size?: number // kích thước theo cài đặt
  isRounded?: string | number | boolean
  icon?: string
  modelValue?: any
}

const props = withDefaults(defineProps<Props>(), ({
  disabled: false,
  size: avatar.size,
  isRounded: false,
  isClassicBorder: true,
  icon: '',
}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update:modelValue', value: any): void
  (e: 'update:processing', value: any): void
  (e: 'update:file', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const videoInput = ref<HTMLInputElement | null>(null)
const isLoadingVideo = ref(false)
const timeOutWaitingLoadVideo = ref()
const loadingStep = ref(0)
const videoUrl = ref(props.modelValue)
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE

/** method  */
async function getFileInfo(folder: any) {
  const data = await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.GetInforFile}${folder}`, TYPE_REQUEST.GET)
  if (data.isProcessing) {
    videoUrl.value = data.filePath

    isLoadingVideo.value = false
    if (videoUrl.value)
      emit('update:modelValue', videoUrl.value)

    clearInterval(timeOutWaitingLoadVideo.value)
  }
}

async function waitingForVideoLoaded(url: any) {
  timeOutWaitingLoadVideo.value = setInterval(async () => {
    if (loadingStep.value === 20) {
      clearInterval(timeOutWaitingLoadVideo.value)
      return
    }
    loadingStep.value += 1
    await getFileInfo(url)
  }, 3000)
}
async function uploadFileToServerfile(file: any) {
  isLoadingVideo.value = true
  const model = {
    files: file,
    isSecure: false,
    IsBackground: true,
  }
  await MethodsUtil.uploadFile(model).then(data => {
    if (data?.fileFolder) {
      waitingForVideoLoaded(data.fileFolder)
      emit('update:file', data)
    }
  })
    .catch(() => {
      isLoadingVideo.value = false
    })
}
function reloadVideo() {
  videoUrl.value = ''
}
function addVideoFromFile(event: any) {
  const tmpFiles = event.target.files || event.dataTransfer.files
  if (tmpFiles?.length > 0) {
    const file = tmpFiles[0]
    if (file.size > 5 * 1024 ** 2)
      toast('WARNING', t('confirm-waiting-file-upload'))
    reloadVideo()
    uploadFileToServerfile(file)
  }
}
function hanleClickVideo() {
  videoInput.value?.click()
}
function removeUpload() {
  isLoadingVideo.value = false
  videoUrl.value = ''
}
watch(isLoadingVideo, (val: any) => {
  emit('update:processing', val)
})
defineExpose({
  hanleClickVideo,
})
</script>

<template>
  <div
    class="cm-video-upload"
    :class="{ 'w-100 h-100': isSizeFull }"
  >
    <VIcon
      v-if="isLoadingVideo"
      class="icon-close"
      icon="material-symbols:close"
      :size="36"
      @click="removeUpload"
    />
    <CmAvatar
      v-show="!videoUrl"
      :is-loading="isLoadingVideo"
      :color="isLoadingVideo ? 'white' : 'primary'"
      :size="size"
      :icon="icon"
      :is-classic-border="isClassicBorder"
      :rounded="isRounded"
      :is-text="isLoadingVideo"
      :class="{ 'w-100 h-100': isSizeFull }"
      class="cm-video-input"
      @click="hanleClickVideo"
    />
    <video
      v-if="videoUrl && !isLoadingVideo"
      controls
      :class="{ 'w-100 h-100': isSizeFull, 'border-avatar': isClassicBorder }"
      class="cusor-pointer"
      style="
        height: 100%;
        max-width: 100%;
        width: 100%;
        object-fit: fill;
      "
      @click="hanleClickVideo"
    >
      <source
        :src="SERVERFILE + videoUrl"
        type="video/mp4"
      >
      {{ t('noti-browers-not-video') }}
    </video>
    <input
      ref="videoInput"
      accept=".mp4, .ogg, |video/*"
      type="file"
      hidden
      :disabled="disabled"
      @input="addVideoFromFile"
    >
  </div>
</template>

<style lang="scss">
@use "@/styles/variables/global" as *;
.border-avatar {
  border: 4px solid $color-white;
  box-shadow: $box-shadow-lg;
  border-radius: 8px;
}
.cm-video-upload{
  position: relative;
  .cm-video-input{
   position: absolute;
  }

}
.cm-video-upload:hover{
  .cm-video-input{
   display: flex !important;
  }
}
.icon-close{
  position: absolute;
  right: 0;
  top: 0;
  padding: 8px;
  z-index: 999;
  cursor: pointer;
}
</style>

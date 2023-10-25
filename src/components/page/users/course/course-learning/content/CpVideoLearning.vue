<script setup lang="ts">
import videojs from 'video.js'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import 'video.js/dist/video-js.css'
import '@videojs/http-streaming'
import { myCourseManagerStore } from '@/stores/user/course/course'
import ServerFileService from '@/api/server-file/index'
import 'videojs-youtube'

interface Emit {
  (e: 'timeUpdateChange', value: any): void
  (e: 'setCurrentProgress', value: any): void
}
const emit = defineEmits<Emit>()
const myCourseManagerManager = myCourseManagerStore()
const { contentCurrent, isReview } = storeToRefs(myCourseManagerManager)
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE
const serverCode = ref()
const isProcessing = ref(false)
const isLoading = ref(false)
const timeOutWaitingProcessing = ref()
const isIOS_Safari = ref(false)
const accessToken = ref()
const videoState = ref(-1)
const playerRef = ref()
const options = ref<any>({
  controlBar: {
    liveDisplay: true,
    pictureInPictureToggle: false,
  },
  youtube: {
    customVars:
            {
              rel: 0,
            },
    rel: 0,
    disablekb: 1,
    modestbranding: 0,
    enablePrivacyEnhancedMode: false,
    autoplay: false,
  },
  userActions: {
    doubleClick: false,
  },
})
const player = ref()
const currentTimeIOSTemp = ref(0)
const videoExtension = computed (() => {
  console.log(isYoutubeVideo(contentCurrent.value.urlFile))

  if (isYoutubeVideo(contentCurrent.value.urlFile))
    return 'youtube'
  const arr = contentCurrent.value.urlFile?.split('.')
  if (arr && arr?.length > 1)
    return arr.pop()
  return 'm3u8'
})
const videoType = computed (() => {
  console.log(videoExtension.value)
  switch (videoExtension.value) {
    case 'mp3': return 'audio/mpeg'
    case 'flac': return 'audio/x-flac'
    case 'ape': return 'audio/x-ape'
    case 'aiff': return 'audio/x-pn-aiff'
    case 'aac': return 'audio/aac'
    case 'wma': return 'audio/x-ms-wma'
    case 'wav': return 'audio/wav'
    case 'm4a': return 'audio/mp4'
    case 'ogg': return 'audio/ogg'
    case 'mp4': return 'video/mp4'
    case 'm3u8': return 'application/x-mpegURL'
    case 'youtube': return 'video/youtube'
    default: return 'application/x-mpegURL'
  }
})
const videoSource = computed (() => {
  if (contentCurrent.value?.acceptDownload) {
    if (contentCurrent.value.urlFile)
      return `${SERVERFILE}${contentCurrent.value.urlFile}`

    return null
  }
  switch (videoExtension.value) {
    case 'mp3':
    case 'm4a':
    case 'wav':
    case 'wma':
    case 'aac':
    case 'flac':
    case 'aiff':
    case 'ape':
      return `${SERVERFILE}${contentCurrent.value.urlFile}`
    case 'ogg':
    case 'mp4':
    case 'm3u8':
      if (serverCode.value)
        return `${SERVERFILE}/${serverCode.value}/preview${isIOS_Safari.value ? 'safari' : ''}?folderVideo=${contentCurrent.value.urlFile}`

      return `${SERVERFILE}/sfv4/preview${isIOS_Safari.value ? 'safari' : ''}?folderVideo=${contentCurrent.value.urlFile}`

    default: return contentCurrent.value.urlFile
  }
})
const currentTime = computed (() => player.value?.currentTime())
const duration = computed (() => player.value?.duration())
const volume = computed (() => player.value?.volume())

async function getInfoFile(folder: any) {
  await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.GetInforFile}${folder}`, TYPE_REQUEST.GET).then(async (data: any) => {
    if (data?.serverCode)
      serverCode.value = data.serverCode
    if (data?.isProcessing) {
      // this.$emit('disableMediaProcessing', false)
      isProcessing.value = true
      if ((contentCurrent.value?.acceptDownload || contentCurrent.value?.contentArchiveTypeId === 5))
        contentCurrent.value.urlFile = data?.filePath

      clearInterval(timeOutWaitingProcessing.value)
      await nextTick()
      handleMediaFile()
    }
    else {
      clearInterval(timeOutWaitingProcessing.value)

      // this.$emit('disableMediaProcessing', true)
      // this.isProcessing = false
      // this.isLoading = false
    }
  })
}
function handleMediaFile() {
  // Nếu hệ điều hành đang sử dụng là iOS thì cài đặt các thông tin để cho phép
  // thêm header vào trước các request
  if (getMobileOperatingSystem() === 'iOS' || detectBrowser() === 'Safari') {
    isIOS_Safari.value = true
    options.value.html5 = {
      hls: {
        overrideNative: true,
      },
      nativeAudioTracks: false,
      nativeVideoTracks: false,
    }
    videojs.options.hls.overrideNative = true
    videojs.options.html5.nativeAudioTracks = false
    videojs.options.html5.nativeVideoTracks = false
  }

  player.value = videojs(playerRef.value, options.value)
  const xhr = (videojs as any).Vhs.xhr
  xhr.beforeRequest = (optionPr: any) => {
    const fileName = optionPr.uri.replace(/^.*[\\\/]/, '')
    optionPr.headers = optionPr.headers || {}
    optionPr.headers.Role = fileName
    // eslint-disable-next-line dot-notation
    optionPr.headers['Accepts'] = contentCurrent.value.urlFile
    // eslint-disable-next-line dot-notation
    optionPr.headers['Authorization'] = `Bearer ${accessToken.value}`
  }
  player.value.on('ready', () => {
    console.log(videoType.value, videoSource.value)
    player.value.src({ type: videoType.value, src: videoSource.value })
    player.value.playsinline(true)
  })
  player.value.on('play', () => {
    if (currentTimeIOSTemp.value && (getMobileOperatingSystem() === 'iOS' || detectBrowser() === 'Safari')) {
      player.value?.currentTime(currentTimeIOSTemp.value)
      currentTimeIOSTemp.value = 0
    }
    videoStateChange({ data: 1 })
  })
  player.value.on('pause', () => {
    videoStateChange({ data: 2 })
  })
  player.value.on('ended', () => {
    videoStateChange({ data: 0 })
  })
  player.value.on('timeupdate', () => {
    timeUpdateChange({ currentTime: player.value?.currentTime() })
  })
  player.value.on('durationchange', () => {
    timeUpdateChange({ durationTime: player.value?.duration() })
  })

  const content = document.getElementById('my_video')
  if (content) {
    const progress: Element[] = Array.from(content.getElementsByClassName('vjs-control-bar'))
    console.log(progress)

    if (progress) {
      progress?.forEach((element: any) => {
        element.parentNode.removeChild(element)
      })
    }
  }
  isLoading.value = false
}

//* *system */
function videoStateChange(value: any) {
  videoState.value = value.data
  console.log(value)

  // this.$emit('videoStateChange', videoState.value)
}
function timeUpdateChange(value: any) {
  emit('timeUpdateChange', value)
}
function volumeUpdateChange(value: any) {
  // this.$emit('volumeUpdateChange', value)
}
function isYoutubeVideo(url: any) {
  const regExp = /^^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/

  return url?.match(regExp) || false
}
function getMobileOperatingSystem() {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent))
    return 'Windows Phone'

  if (/android/i.test(userAgent))
    return 'Android'

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  // if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
  //   return 'iOS'
  // }
  if (['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform)
          || (navigator.userAgent.includes('Mac') && 'ontouchend' in document))
    return 'iOS'

  return 'unknown'
}

function detectBrowser() {
  if ((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) !== -1)
    return 'Opera'
  if (navigator.userAgent.includes('Chrome'))
    return 'Chrome'
  if (navigator.userAgent.includes('Safari'))
    return 'Safari'
  if (navigator.userAgent.includes('Firefox'))
    return 'Firefox'
  if ((navigator.userAgent.includes('MSIE')) || (!!(document as any).documentMode === true))
    return 'IE'// crap

  return 'Unknown'
}

//* *system */
function play() {
  player.value?.play()
}
function pause() {
  player.value?.pause()
}
function seekTo(seconds: any, isUpdateLastPointer?: any) {
  if (isUpdateLastPointer && (getMobileOperatingSystem() === 'iOS' || detectBrowser() === 'Safari')) {
    currentTimeIOSTemp.value = seconds
    emit('setCurrentProgress', seconds)
    return
  }
  player.value?.currentTime(seconds)
}
function setVolume(value: any) {
  if (player.value)
    player.value.volume(value)
}
function setSpeedRate(value: any) {
  if (player.value)
    player.value.playbackRate(value)
}
accessToken.value = localStorage.accessToken
onBeforeUnmount(() => {
  clearInterval(timeOutWaitingProcessing.value)
})
onMounted(async () => {
  // kiểm tra file video là local hay youtobe
  if (!contentCurrent.value?.urlFile?.includes('/DataFile') && !contentCurrent.value?.urlFile?.includes('youtube')) {
    const urlFile = contentCurrent.value.acceptDownload ? contentCurrent.value.urlFileName : contentCurrent.value.urlFile
    console.log(urlFile)
    timeOutWaitingProcessing.value = setInterval(() => {
      getInfoFile(urlFile)
    }, 5000)
    getInfoFile(urlFile)
  }
  else {
    isProcessing.value = true

    // this.$emit('disableMediaProcessing', false)
    await nextTick()
    handleMediaFile()
  }
})

defineExpose({
  play,
  pause,
  seekTo,
  setVolume,
  setSpeedRate,
})
</script>

<template>
  <div>
    <video
      id="my_video"
      ref="playerRef"
      class="video-js vjs-default-skin vjs-big-play-centered vjs-show-big-play-button-on-pause my-video"
      oncontextmenu="return false;"
      preload="auto"
      controls
      playsinline
      :autoplay="false"
    />

    <button @click="play">
      play
    </button>
    <button @click="pause">
      pause
    </button>
    <button @click="seekTo(10)">
      seekTo
    </button>
  </div>
</template>

<style lang="scss">
.my-video{
  width: 100% !important;
  height: 75vh;
}
</style>
